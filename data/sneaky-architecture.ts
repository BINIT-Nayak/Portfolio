export const architectureNodes = [
  {
    id: "client",
    name: "React Client",
    category: "Frontend",
    x: 50,
    y: 13,
    description:
      "React and Redux coordinate swipe state, authenticated UI, wishlist/cart flows, and background feed prefetch. The client appends unique products returned by the API.",
  },
  {
    id: "api",
    name: "Spring Boot API",
    category: "Application",
    x: 50,
    y: 45,
    description:
      "JWT-secured APIs handle authentication context, validation, commerce rules, and recommendation orchestration. The service chooses cached ranking or fallback scoring.",
  },
  {
    id: "database",
    name: "PostgreSQL",
    category: "Persistent data",
    x: 50,
    y: 77,
    description:
      "The persistent source of truth for users, products, carts, wishlists, and notifications. Product records enrich cached recommendation IDs while the API preserves ranking order.",
  },
  {
    id: "redis",
    name: "Redis",
    category: "Cache-aside",
    x: 16.67,
    y: 45,
    description:
      "Recommendation reads first look up ranked IDs in Redis using guest or user-specific keys with a 15-minute TTL. A cache miss falls back to scoring and refreshes the cache.",
  },
  {
    id: "kafka",
    name: "Kafka",
    category: "Asynchronous events",
    x: 83.33,
    y: 13,
    description:
      "When Kafka analytics is enabled, product views, passes, wishlist actions, and cart events are processed asynchronously to update analytics and preference signals, supporting recommendation refresh outside the normal read path.",
  },
  {
    id: "engine",
    name: "Recommendation Engine",
    category: "Candidate generation",
    x: 16.67,
    y: 77,
    description:
      "Generates and scores candidates using affinity, price fit, popularity, and positive/negative behavior signals. Diversity reranking reduces repetition; weak-history users receive guest ranking.",
  },
  {
    id: "ml",
    name: "Optional ML Reranker",
    category: "Fail-open enhancement",
    x: 83.33,
    y: 77,
    description:
      "A separate FastAPI/scikit-learn service reranks rule-generated candidates when enabled and a trained model is loaded. Disabled ML, timeouts, invalid scores, or partial results preserve the rule-based order instead of blocking the feed.",
  },
] as const;

export const architectureEdges = {
  request: "M450 88V144",
  lookup: "M350 180H250",
  ids: "M250 180H350",
  enrich: "M450 216V272",
  records: "M470 272V216",
  response: "M470 144V88",
  scoring: "M400 216V244H150V272",
  events: "M550 180H750V88",
  refresh: "M150 272V216",
  rerank: "M150 344V374H750V344",
} as const;

export const requestSteps = [
  {
    title: "User opens feed",
    node: "client",
    edge: null,
    detail:
      "The client starts a recommendation request for the feed. This example assumes a usable ranking already exists in Redis.",
  },
  {
    title: "API receives request",
    node: "api",
    edge: "request",
    detail:
      "Spring Boot resolves guest or authenticated user context for GET /api/products/recommended.",
  },
  {
    title: "Redis lookup",
    node: "redis",
    edge: "lookup",
    detail:
      "The API checks the guest or user-specific recommendation key. On this cache-hit path, full scoring is unnecessary.",
  },
  {
    title: "Recommendation IDs",
    node: "api",
    edge: "ids",
    detail:
      "Redis returns ranked product IDs—not cached product payloads. The existing order represents the recommendation ranking.",
  },
  {
    title: "Database enrichment",
    node: "database",
    edge: "enrich",
    detail:
      "The API loads current product records from PostgreSQL for those IDs, keeping product details separate from the ranking cache.",
  },
  {
    title: "Response assembled",
    node: "api",
    edge: "records",
    detail:
      "The API maps records back into cached ranking order and prepares the product response.",
  },
  {
    title: "UI receives feed",
    node: "client",
    edge: "response",
    detail:
      "React receives the products and updates the discovery feed. Background prefetch can request more while excluding already loaded IDs.",
  },
] as const;
