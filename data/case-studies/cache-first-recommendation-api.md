# Building a Cache-First Recommendation API for Sneaky

## Introduction

Sneaky's home feed is built around fast product discovery. Users swipe through fashion products, save items to wishlist, move products into cart, revisit recently viewed products, and open merchant checkout links when they are ready to buy.

Because the feed is interaction-heavy, the recommendation API cannot behave like a slow reporting query. It has to return relevant products quickly, avoid duplicates, support guest users, and become more personal as user activity grows.

To solve this, I built Sneaky's recommendation API around a **cache-first ranking flow**.

Instead of recalculating product scores on every request, the backend first checks Redis for a precomputed ranked list of product IDs. If the cache exists, the API fetches those products and returns them in the same order. If the cache is missing, the backend runs the ranking logic, stores the ranked IDs in Redis, and returns the result.

This made the recommendation system faster, easier to scale, and easier to evolve toward ML reranking later.

---

## The Problem

The recommendation system had to support a swipe-based product feed with several competing requirements:

* Return products quickly for the home feed.
* Personalize recommendations when enough user behavior exists.
* Support guest users with no activity history.
* Avoid showing products already saved, carted, recently viewed, or passed.
* Keep the feed diverse across brand, category, and merchant.
* Use Redis and Kafka so ranking work does not always sit in the request path.
* Keep ML optional so product discovery still works if the ML service is unavailable.

The important challenge was not only how to score products. The harder problem was deciding **when scoring should happen**.

If every home feed request recalculated rankings from scratch, the API would repeat expensive work again and again. As the product catalog and activity history grew, that approach would become slower and harder to scale.

So I designed the recommendation endpoint as a cache-first API.

---

## What I Built

I implemented a recommendation flow for:

```http
GET /api/products/recommended
```

The API uses Redis as the first lookup layer for ranked product IDs.

The main cache keys are:

```txt
recommendations:guest
recommendations:user:{userId}
```

The flow works like this:

```txt
Client requests recommended products
        ↓
Backend checks Redis for ranked product IDs
        ↓
Cache hit?
        ↓
Yes → fetch product records and preserve Redis ranking order
        ↓
No → score active products using rule-based ranking
        ↓
Apply diversity reranking
        ↓
Optionally apply ML reranking when enabled and healthy
        ↓
Store ranked product IDs in Redis with 15-minute TTL
        ↓
Return recommended products
```

This design separates the expensive ranking step from normal repeat feed reads.

On cache hits, the backend does not need to rebuild the whole ranking model. It only needs to load products by ID and preserve the cached order.

---

## Architecture Implementation

The implementation is split across clear backend responsibilities.

The controller exposes the recommendation endpoint and handles request-level concerns such as authentication context, paging, and query parameters.

The service layer decides whether the request should use guest ranking or personalized ranking. It checks whether the user has enough behavior signals before switching into personalized recommendations.

Redis acts as the cache-aside layer. The backend reads ranked product IDs first, and only runs the scoring pipeline when no usable cached ranking exists.

PostgreSQL remains the source of truth for products, users, brands, cart, wishlist, and notification records. Redis does not replace the database; it stores temporary ranking and analytics data that can be regenerated.

Kafka activity events are used to keep behavior data moving outside the request thread. Product views, passes, cart actions, and wishlist actions can update Redis counters, user preference profiles, and recommendation cache state asynchronously.

The frontend coordinates feed consumption with Redux. As the user approaches the end of the current product list, the frontend can request more recommendations while sending already loaded product IDs so the backend avoids returning duplicates.

---

## Ranking Logic

The live scoring fallback uses a rule-based ranking model.

Positive signals include:

* Brand affinity
* Category affinity
* Merchant affinity
* Similar price range
* Wishlist history
* Cart history
* Recently viewed products
* Product popularity

Negative signals include:

* Products the user already passed
* Products already in wishlist
* Products already in cart
* Products recently viewed too often
* Repeated brand, category, or merchant values in a tight feed window

The system uses a personalization threshold before switching from guest ranking to user-specific ranking:

```txt
MIN_PERSONALIZATION_SIGNALS = 20
```

This prevents the feed from over-personalizing too early. If a user has only viewed one product, that is not enough evidence to reshape the whole feed.

For guest users or users with weak history, Sneaky uses popularity, recency, and diversity instead.

---

## Cache Strategy

The cache stores ranked product IDs instead of full product payloads.

That decision keeps Redis data smaller and avoids stale product details. Product data still comes from PostgreSQL, while Redis only controls the ordering.

The cached ranking has a short TTL:

```txt
CACHE_TTL = 15 minutes
```

A short TTL gives a useful balance:

* Repeat feed requests become faster.
* Rankings do not stay stale for too long.
* New behavior can affect recommendations quickly.
* Redis can be cleared or regenerated without risking permanent data loss.

The backend also preserves Redis order when fetching product records from the database. This is important because a database `IN` query does not always return rows in the same order as the input IDs.

---

## Kafka and Event-Driven Refresh

The recommendation cache becomes more useful when user behavior can refresh it in the background.

Sneaky publishes activity events for:

* Product views
* Product passes
* Cart actions
* Wishlist actions

These events can be processed asynchronously to update:

* Redis popularity counters
* Recently viewed products
* Passed-product memory
* User preference profiles
* Recommendation cache invalidation or refresh

This means the API request that records a product action does not need to wait for every recommendation update to finish.

That separation keeps user-facing cart, wishlist, and product APIs responsive while still allowing the recommendation system to improve from behavior data.

---

## Optional ML Reranking

I did not make ML a hard dependency for the feed.

Instead, the rule-based recommender generates candidates first. Then, when the standalone `Sneaky_Recommender` service is enabled and healthy, the backend can send engineered interaction features to the ML service for reranking.

The integration is fail-open.

If ML is disabled, slow, unhealthy, returns incomplete data, or gives invalid scores, the backend keeps the existing rule-based order.

This was an important architecture decision because recommendation quality should improve with ML, but the product feed should not break because of ML.

---

## What I Learned

The biggest lesson was that recommendation systems are not only about scoring formulas. They are also about system design.

A useful recommendation API needs to answer practical engineering questions:

* Where does ranking happen?
* How often should ranking happen?
* What data should be cached?
* What should remain in the database?
* What happens when Redis is unavailable?
* What happens when ML is unavailable?
* How do we avoid stale or repeated feed items?
* How do we personalize without overfitting to weak early behavior?

I also learned that caching product IDs is often cleaner than caching full objects. The cache controls ranking, while the database remains responsible for product truth.

Another key learning was that ML does not need to be the first version of personalization. A rule-based system can be a strong first layer when the signals are clear, explainable, and easy to tune.

The final lesson was about fail-open architecture. Optional infrastructure should enhance the product experience, not become the reason the core experience fails.

---

## Outcome

The cache-first recommendation API gave Sneaky a stronger foundation for product discovery.

It supports guest ranking, personalized ranking, Redis cached feed reads, diversity reranking, Kafka-driven behavior updates, and optional ML reranking while keeping the product feed reliable.

The result is a recommendation architecture that is practical for the current product stage and ready to evolve as the dataset grows.
