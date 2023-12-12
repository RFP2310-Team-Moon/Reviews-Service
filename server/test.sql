/* AVG RATING */
-- EXPLAIN ANALYZE
-- SELECT c.id, c.name, AVG(cr.value)
--   FROM chars as c
--   JOIN char_reviews as cr ON c.id = cr.characteristic_id
--   WHERE product_id=12
--   GROUP BY c.name, c.id
--   ORDER BY c.id;

EXPLAIN ANALYZE
SELECT id, name, avg
  FROM avgRating
  WHERE product_id=12
  ORDER BY id;

DROP MATERIALIZED VIEW IF EXISTS starcount ;

/* STAR COUNT */
-- EXPLAIN ANALYZE
-- SELECT rating, count
--   FROM starCount
--   WHERE product_id=13
--   ORDER BY rating ASC;
EXPLAIN ANALYZE
  SELECT product_id, rating, COUNT(rating)
  FROM reviews
  WHERE product_id=13
  GROUP BY rating, product_id;


/* RECOMMEND COMPARE */
-- EXPLAIN ANALYZE
-- SELECT *
--   FROM recCount
--   WHERE product_id=13;
EXPLAIN ANALYZE
SELECT recommend, COUNT(recommend)
  FROM reviews
  WHERE product_id=13
  GROUP BY product_id, recommend;




const qStringChar = `SELECT c.id, c.name, AVG(cr.value)
  FROM chars as c
  JOIN char_reviews as cr ON c.id = cr.characteristic_id
  WHERE product_id=${product_id}
  GROUP BY c.name, c.id
  ORDER BY c.id;`;

const qStringRate = `SELECT rating, COUNT(rating)
  FROM reviews
  WHERE product_id=${product_id}
  GROUP BY rating
  ORDER BY rating ASC;`;



 EXPLAIN ANALYZE
  SELECT reviews.id as review_id,
          rating,
          summary,
          recommend,
          response,
          body,
          date,
          reviewer_name,
          helpfulness,
          STRING_AGG(p.id || ', ' || p.url ,', ') as photos
          FROM reviews
          JOIN photos as p ON reviews.id=p.review_id
          WHERE reviews.product_id=18
          GROUP BY reviews.id
          ORDER BY date ASC
          LIMIT 5;