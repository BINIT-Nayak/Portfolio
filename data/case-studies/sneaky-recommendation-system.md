# Building Sneaky’s Recommendation System: Why I Chose Points-Based Recommendation Before Machine Learning

## Introduction

Recommendation systems are one of the most important parts of modern product discovery platforms. Whether it is an e-commerce app, social media feed, music app, movie platform, or job portal, recommendations directly affect how users discover relevant content.

When I started building the recommendation system for **Sneaky**, I had two possible approaches:

1. Build an ML-based recommendation system.
2. Start with a rule-based or points-based recommendation system.

At first, ML sounds like the obvious answer because recommendation systems are commonly associated with machine learning. But after analyzing Sneaky’s current stage, available data, product requirements, and engineering complexity, I decided to implement a **points-based recommendation system** first.

This decision was intentional.

Sneaky currently has clear and meaningful user signals such as:

* Wishlist products
* Cart products
* Recently viewed products
* Passed or left-swiped products
* Product brands
* Product categories
* Price range
* Merchant/store
* Product popularity

Because these signals are already well-defined, a rule-based scoring system is a strong fit for the current product stage. It allows Sneaky to generate relevant recommendations without requiring ML training, large datasets, or complex model infrastructure.

The system is simple, explainable, tunable, and fast enough for an early-stage product.

---

## Problem Statement

Sneaky needed a recommendation system that could show users relevant products based on their behavior.

The system had to solve a few important problems:

* Recommend products based on user preferences.
* Avoid showing the same product repeatedly.
* Reduce products similar to items the user has passed.
* Promote products similar to items in wishlist, cart, or recently viewed history.
* Keep the feed diverse so the user does not see the same category, brand, or merchant again and again.
* Support guest users who do not have personal activity yet.
* Keep API response time fast.
* Allow the system to improve later with ML when enough user behavior data is available.

The challenge was not only to rank products, but also to create a recommendation flow that felt useful, fast, and scalable.

---

## Why I Did Not Start with ML Immediately

Machine learning is powerful, but it is not always the best starting point.

For Sneaky, an ML-based recommender would require a large amount of real user behavior data. Without enough data, the model may not learn meaningful patterns. It could also add unnecessary complexity in terms of data pipelines, model training, evaluation, deployment, monitoring, and retraining.

At the current stage, Sneaky does not need to immediately predict complex hidden patterns. It already has clear signals that can be converted into scoring rules.

For example:

* If a user wishlists Nike shoes, show more Nike or similar category products.
* If a user adds premium products to cart, give higher priority to similar price-range products.
* If a user keeps passing products from one category, reduce similar products.
* If a product is already in wishlist or cart, avoid showing it again.
* If the same product was recently viewed, reduce its priority temporarily.

These rules are explainable and easy to debug.

So instead of starting with ML, I used a points-based recommendation system as the first version.

---

## ML-Based Recommendation vs Points-Based Recommendation

A points-based recommendation system uses manually designed scoring rules.

For example:

* Same brand as liked product: +8
* Same category as liked product: +5
* Same merchant: +4
* Similar price range: +3
* Same category as passed product: -10

The final product score is calculated using these positive and negative signals. Products are then sorted by score and shown to the user.

An ML-based recommendation system, on the other hand, learns from user behavior data. It can detect patterns that are hard to manually define.

For example:

* Users who pass Nike running shoes may still like Nike lifestyle sneakers.
* Users who wishlist premium brands may tolerate higher price ranges.
* Cart behavior should matter more than casual views.
* Some categories convert better after certain previous interactions.
* Brand, category, and price combinations may matter more than each feature alone.

These patterns are useful, but they require enough real user behavior data.

That is why, for Sneaky, I decided not to replace the current rule-based system immediately. A better future approach would be to use ML as a **reranker**, not as a complete replacement from day one.

---

## Current Recommendation Architecture in Sneaky

Sneaky’s recommendation system follows a layered architecture.

The current flow is:

```txt
Client Request
     ↓
Recommendation API
     ↓
Check Redis Cache
     ↓
If cache exists → Fetch products in cached order
     ↓
If cache missing → Run scoring model
     ↓
Apply diversity reranking
     ↓
Store ranked product IDs in Redis
     ↓
Return recommended products to frontend
```

The system is designed to be cache-first.

This means the recommendation API first checks whether ranked product IDs are already available in Redis. If available, it fetches those products and returns them in the same ranking order. If not available, it runs the full scoring logic and stores the result in Redis for future requests.

This keeps the recommendation API fast and avoids running expensive scoring logic on every homepage load.

---

## Overall Recommendation Flow

The backend first fetches active and approved products.

Then it checks whether the user is logged in or logged out.

For guest users, Sneaky cannot personalize recommendations because there is no user-specific behavior. So it uses guest ranking based on popularity, newest products, and diversity.

For logged-in users, Sneaky collects user activity signals such as:

* Wishlist product IDs
* Cart product IDs
* Recently viewed product IDs
* Passed product IDs

If the user has enough preference signals, the backend scores every active product. The products with the highest scores are selected as candidates. After that, a diversity pass rearranges products to avoid repetition.

Finally, the API returns a limited number of products to the frontend.

The current result limit is:

```txt
RECOMMENDATION_RESULT_LIMIT = 30
```

So the frontend receives 30 recommended products at a time.

---

## Personalization Threshold

One important decision in Sneaky’s recommendation system is that personalization should not start too early.

If the user has very little activity, the system may make incorrect assumptions.

For example, if a user only views one Nike shoe, it does not necessarily mean the user wants only Nike shoes. If the system personalizes too aggressively from limited behavior, the feed can become repetitive or inaccurate.

To avoid this, Sneaky uses a minimum signal threshold:

```txt
MIN_PERSONALIZATION_SIGNALS = 20
```

The signals include:

* Wishlist product IDs
* Cart product IDs
* Passed product IDs

If the user has fewer than 20 signals, Sneaky falls back to guest recommendations.

This makes the recommendation system safer because it does not over-personalize with weak data.

---

## Positive Scoring Logic

Sneaky gives positive points when a candidate product matches products the user has liked, saved, carted, or viewed.

The current positive scoring values are:

```txt
BRAND_MATCH_SCORE = 8.0
CATEGORY_MATCH_SCORE = 5.0
MERCHANT_MATCH_SCORE = 4.0
PRICE_MATCH_SCORE = 3.0
POPULARITY_SCORE = 2.0
```

This means:

* Same brand as a liked/cart/viewed product gives +8.
* Same category gives +5.
* Same merchant/store gives +4.
* Similar price range gives +3.
* Popular products receive a small popularity boost.

For example, if a user likes a Nike running shoe from Amazon around ₹10,000, then another Nike running shoe from Amazon around a similar price can receive:

```txt
+8 brand match
+5 category match
+4 merchant match
+3 similar price
= +20 score
```

If multiple liked, carted, or viewed products match the candidate product, the score can stack.

This makes the recommendation system more responsive to repeated user interest.

---

## Price Similarity Logic

Price similarity is important because user buying intent is often connected to budget.

Sneaky uses a price range ratio:

```txt
PRICE_RANGE_RATIO = 0.25
```

This means a candidate product is considered price-similar if it is within ±25% of the signal product price.

Example:

```txt
User liked product price = ₹10,000

Allowed range:
₹10,000 ± 25%

Minimum = ₹7,500
Maximum = ₹12,500
```

So a ₹11,000 product receives the price match score.

But a ₹15,000 product does not receive that score.

This helps Sneaky recommend products that match the user’s expected spending range.

---

## Popularity Scoring

Popularity is used as a small boost, not the main ranking factor.

Sneaky reads the top most-viewed products from Redis.

```txt
POPULAR_PRODUCT_LIMIT = 100
```

The top 100 most-viewed product IDs are considered for popularity scoring.

The scoring formula is:

```txt
POPULARITY_SCORE / (rank + 1)
```

So:

```txt
Rank 0 product = 2.0 / 1 = +2.0
Rank 1 product = 2.0 / 2 = +1.0
Rank 2 product = 2.0 / 3 = +0.66
```

This ensures that popular products get a boost, but popularity does not overpower personal preferences.

This is important because the recommendation system should not become only a “popular products” feed.

---

## Negative Scoring Logic

Negative scoring is used to reduce products that the user has already rejected, already viewed, or already owns in wishlist/cart.

The current penalties are:

```txt
PASSED_BRAND_PENALTY = 6.0
PASSED_CATEGORY_PENALTY = 10.0
PASSED_MERCHANT_PENALTY = 5.0
VIEWED_EXACT_PRODUCT_PENALTY = 12.0
PASSED_EXACT_PRODUCT_PENALTY = 35.0
OWNED_EXACT_PRODUCT_PENALTY = 50.0
```

This means:

* Same brand as a passed product gets -6.
* Same category as a passed product gets -10.
* Same merchant as a passed product gets -5.
* Recently viewed exact product gets -12.
* Exact passed product gets -35.
* Product already in wishlist/cart gets -50.

This helps reduce repetitive and irrelevant recommendations.

For example, if a user keeps passing running shoes, then another running shoe receives a penalty. If it is also from the same brand and same merchant, it receives additional penalties.

```txt
Same category as passed product: -10
Same brand as passed product: -6
Same merchant as passed product: -5

Total penalty = -21
```

If it is the exact same product already passed, it receives an even larger penalty.

This allows the system to learn from negative feedback without using ML.

---

## Handling Already Saved or Carted Products

Products already present in wishlist or cart are not completely removed from the recommendation list. Instead, they receive a strong penalty.

```txt
OWNED_EXACT_PRODUCT_PENALTY = 50.0
```

This naturally pushes those products toward the bottom.

The reason for penalizing instead of hard-removing is flexibility. In some cases, the product may still be needed in fallback scenarios. But under normal ranking, it should not appear again near the top.

This improves user experience because users do not keep seeing products they have already saved or added to cart.

---

## Handling Recently Viewed Products

Sneaky also penalizes recently viewed exact products.

```txt
VIEWED_EXACT_PRODUCT_PENALTY = 12.0
```

This prevents the same product from appearing again immediately after the user has already opened it.

Recently viewed memory is limited to:

```txt
RECENTLY_VIEWED_LIMIT = 20
```

This means Sneaky remembers the last 20 recently viewed products for recommendation adjustment.

---

## Passed Product Memory

Passed or left-swiped products are important negative signals.

Sneaky stores passed products in Redis.

The current limit is:

```txt
PASSED_PRODUCTS_LIMIT = 80
```

This means the system remembers up to the last 80 passed products.

This memory helps the recommender reduce similar products and avoid repeating items the user has already rejected.

---

## Candidate Selection

After scoring all active products, Sneaky does not directly return everything.

It first keeps the top recommendation candidates.

```txt
RECOMMENDATION_CANDIDATE_LIMIT = 250
```

Then it applies diversity reranking on those candidates.

Finally, the API returns:

```txt
RECOMMENDATION_RESULT_LIMIT = 30
```

This approach gives the backend enough candidate products to rearrange and diversify the feed before sending the final result to the frontend.

---

## Diversity Reranking

One of the biggest challenges in recommendation systems is repetition.

If a user likes running shoes, the system may keep showing:

```txt
Running shoe
Running shoe
Running shoe
Running shoe
Running shoe
```

Technically, these products may have high scores. But the user experience becomes poor because the feed feels repetitive.

To solve this, Sneaky applies diversity reranking.

The system checks a recent window of already selected products:

```txt
DIVERSITY_WINDOW_SIZE = 4
```

For each next product, it compares the candidate with the last 4 selected products.

The diversity penalties are:

```txt
CATEGORY_REPEAT_WINDOW_PENALTY = 7.0
BRAND_REPEAT_WINDOW_PENALTY = 3.0
MERCHANT_REPEAT_WINDOW_PENALTY = 2.0
```

So if a candidate repeats the same category as one of the last 4 products, it receives a category repeat penalty.

If the last 4 products include two running products, another running product may receive:

```txt
-14 category repeat penalty
```

This does not permanently block running products. It only pushes them lower temporarily so that other products can appear in between.

This improves product discovery and prevents feed loops.

---

## Guest User Ranking

Guest users do not have personal behavior signals.

So Sneaky uses a simpler ranking strategy for logged-out users:

* Popularity from Redis
* Newest products as tie-breaker
* Diversity reranking

This ensures that guest users still see relevant and fresh products even without personalization.

The guest recommendation cache key is:

```txt
recommendations:guest
```

---

## Logged-In User Ranking

For logged-in users, Sneaky follows a personalized ranking flow.

The backend loads:

* Wishlist products
* Cart products
* Recently viewed products from Redis
* Passed products from Redis

Then it checks whether the user has enough signals.

If the user has fewer than 20 signals, Sneaky uses guest ranking.

If the user has 20 or more signals, Sneaky calculates a personal recommendation score for every active product.

The user-specific Redis cache key is:

```txt
recommendations:user:{userId}
```

This allows Sneaky to store personalized ranked product IDs for each user.

---

## Example Scoring Scenario

Suppose the user has the following activity:

Wishlist:

```txt
Nike Running shoe ₹10,000 from Amazon
Adidas Training shoe ₹8,000 from Myntra
```

Passed:

```txt
Vans Skate shoe ₹7,000 from Ajio
```

Now assume the candidate product is:

```txt
Nike Training shoe ₹9,000 from Amazon
```

The scoring can be:

```txt
Matches Nike wishlist brand: +8
Similar price to ₹10,000 product: +3
Same merchant Amazon: +4
Matches Training category from Adidas product: +5
Similar price to ₹8,000 product: +3
Popularity boost: +1

Total = 24
```

Now assume another candidate product is:

```txt
Vans Skate shoe ₹7,200 from Ajio
```

The scoring can be:

```txt
Same brand as passed product: -6
Same category as passed product: -10
Same merchant as passed product: -5
Similar price to liked product: +3
Popularity boost: +1

Total = -17
```

So the Nike Training product ranks much higher than the Vans Skate product.

This shows how Sneaky uses both positive and negative signals to improve recommendation quality.

---

## Redis Precomputed Recommendation Layer

To improve performance, Sneaky stores ranked product IDs in Redis.

The cache keys are:

```txt
recommendations:guest
recommendations:user:{userId}
```

The API follows a cache-first approach:

```txt
1. Try Redis.
2. If cached product IDs exist, fetch only those products.
3. Preserve cached ranking order.
4. Return products quickly.
5. If cache is missing, run full scoring.
6. Store product IDs in Redis.
7. Return products.
```

The cache TTL is:

```txt
15 minutes
```

This means the expensive scoring logic does not need to run on every request.

It also keeps the recommendation response fast for homepage loading and swipe-based browsing.

---

## Kafka-Based Refresh Flow

When Kafka analytics is enabled, Sneaky can refresh recommendations asynchronously based on user activity.

The flow is:

```txt
User activity happens
     ↓
Product viewed / passed / wishlist added / cart added
     ↓
Event is published
     ↓
Kafka consumer records analytics in Redis
     ↓
Consumer refreshes recommendation cache
```

This moves heavy recomputation away from the API request path.

Instead of recalculating recommendations only when the user opens the home feed, the system can update recommendation caches in the background when important user events happen.

This makes the system more scalable.

---

## Frontend Background Prefetch

The frontend currently receives 30 recommended products.

When the user reaches the last 10 products, the frontend triggers a background request:

```txt
GET /api/products/recommended?excludeIds=id1&excludeIds=id2...
```

The frontend sends already loaded product IDs as `excludeIds`.

The backend excludes those products and returns fresh recommendations.

Then Redux appends only new products and skips duplicates.

This creates a smoother swipe experience because the user can continue browsing without immediately reaching a “Start Over” state.

The flow looks like this:

```txt
Initial 30 products loaded
     ↓
User swipes products
     ↓
When last 10 products remain
     ↓
Frontend prefetches next recommendations
     ↓
Backend excludes already loaded product IDs
     ↓
Redux appends new unique products
     ↓
User continues browsing smoothly
```

---

## Key Features of Sneaky’s Recommendation System

### 1. Personalized Ranking

Sneaky ranks products based on actual user signals such as wishlist, cart, views, and passes.

### 2. Guest Recommendation Support

Even without login, users can see products based on popularity, recency, and diversity.

### 3. Positive and Negative Feedback

The system uses both positive signals and negative signals.

Positive signals include wishlist, cart, views, brand match, category match, merchant match, and price similarity.

Negative signals include passed products, recently viewed products, and already owned wishlist/cart products.

### 4. Redis-Based Performance Optimization

Recommendations are cached in Redis so the API does not need to run full scoring every time.

### 5. Diversity Reranking

The system avoids repeating the same brand, category, or merchant too frequently.

### 6. Kafka-Ready Refresh Architecture

User actions can trigger analytics events, and Kafka consumers can refresh recommendation caches.

### 7. Frontend Prefetching

The frontend loads more products before the user runs out of cards, improving the swipe experience.

### 8. Explainable Logic

Because the system is points-based, every recommendation can be explained and debugged.

---

## Major Engineering Challenges

### Challenge 1: Avoiding Over-Personalization

If recommendations start too early, a few weak signals can dominate the feed.

For example, if a user views one Nike product, the system should not assume the user only wants Nike products.

Solution:

Sneaky uses a minimum personalization threshold of 20 signals. Until then, the system falls back to guest ranking.

---

### Challenge 2: Balancing Positive and Negative Signals

A product may match the user’s liked brand but also belong to a category the user has passed multiple times.

For example:

```txt
Nike Running shoe
```

The user may like Nike but may have passed many running shoes.

Solution:

Sneaky calculates both positive and negative scores. This allows the final ranking to reflect mixed signals.

---

### Challenge 3: Preventing Feed Repetition

High-scoring products may belong to the same category or brand, causing a repetitive feed.

Solution:

Sneaky applies diversity reranking using a recent window of 4 products. Repeated category, brand, and merchant values receive temporary penalties.

---

### Challenge 4: Keeping API Response Fast

Scoring every active product on every request can become expensive as the product catalog grows.

Solution:

Sneaky uses Redis precomputed recommendation caching. The API first checks cached ranked product IDs and only recomputes when needed.

---

### Challenge 5: Handling Guest Users

Guest users do not have wishlist, cart, pass, or view history.

Solution:

Sneaky uses popularity, newest products, and diversity reranking for guest recommendations.

---

### Challenge 6: Avoiding Duplicate Products on Frontend

In a swipe-based experience, duplicate products can make the app feel broken or repetitive.

Solution:

The frontend sends `excludeIds` while fetching more recommendations. The backend excludes already loaded products, and Redux appends only new products.

---

## Why This Architecture Works Well for Sneaky

The current recommendation system is suitable for Sneaky because it matches the product’s current stage.

It is:

* Fast to build
* Easy to debug
* Easy to tune
* Explainable
* Lightweight
* Compatible with Redis caching
* Ready for future ML reranking

Most importantly, it works with the data Sneaky already has.

Instead of waiting for a large dataset and ML pipeline, Sneaky can recommend products from day one using meaningful user behavior signals.

---

## Where ML Can Improve Sneaky Later

Although the current points-based recommender is a good fit, ML can become useful later.

ML can help when Sneaky has enough real user behavior data, such as:

* Product views
* Product passes
* Wishlist additions
* Cart additions
* Merchant clicks
* Product detail opens
* Purchase or conversion data

ML can learn patterns that are difficult to manually define.

For example:

* Users who pass Nike running shoes may still like Nike lifestyle sneakers.
* Users who wishlist premium brands may tolerate higher price ranges.
* Cart behavior should matter more than casual views.
* Some categories convert better after specific previous interactions.
* Brand, category, and price combinations may matter more than each feature alone.

These are not simple one-rule decisions. They are behavioral patterns.

That is where ML can add value.

---

## Future Architecture: ML as a Reranker

For Sneaky, I would not replace the current points-based system immediately.

A better future architecture would be:

```txt
Current rule-based recommender finds candidate products
        ↓
ML model predicts which candidates the user is most likely to wishlist/cart/click
        ↓
Existing diversity logic prevents repetitive results
        ↓
Redis caches the final ranking
```

This approach is practical because the current rule-based system can continue doing what it does well: candidate generation.

Then ML can improve the ordering of those candidates.

This is called reranking.

Instead of asking ML to search the entire product catalog from scratch, Sneaky can first select strong candidates using rules and then let ML predict the best order.

This gives the system a balanced architecture:

* Rules provide control and explainability.
* ML improves personalization.
* Diversity logic protects user experience.
* Redis keeps the response fast.

---

## When ML Should Be Added

ML should not be added just because it sounds advanced.

For Sneaky, ML makes sense when:

* There are enough user events.
* The product catalog becomes large.
* Manual rule tuning becomes difficult.
* Recommendation quality starts affecting retention or conversion.
* User behavior patterns become too complex to hand-code.
* The same rule weights do not work well for different user groups.

Until then, the current points-based system is a better engineering choice.

---

## Outcome

The points-based recommendation system helped Sneaky achieve a practical recommendation flow without ML complexity.

The key outcomes are:

* Personalized recommendations for logged-in users.
* Guest recommendations for logged-out users.
* Better ranking using wishlist, cart, views, passes, brand, category, price, merchant, and popularity.
* Reduced repetition using diversity reranking.
* Faster API responses using Redis precomputed recommendation cache.
* Better swipe experience using frontend background prefetch.
* A future-ready architecture where ML can be added later as a reranker.

The biggest learning from this implementation is that machine learning is not always the best first step.

For an early-stage product, a well-designed points-based recommendation system can be more valuable because it is simple, explainable, and easier to control.

ML should be introduced when the product has enough data and when the recommendation problem becomes too complex for manual scoring rules.

---

## Final Thoughts

Sneaky’s recommendation system follows a practical engineering approach:

```txt
Start simple.
Use clear signals.
Make ranking explainable.
Cache expensive results.
Avoid repetitive feeds.
Collect behavior data.
Add ML only when it is justified.
```

This architecture gives Sneaky the best of both worlds.

The current system is simple enough to maintain today, but flexible enough to evolve into an ML-powered recommendation engine later.

That is why, for Sneaky, a points-based recommendation system was not a compromise. It was the right first version.
