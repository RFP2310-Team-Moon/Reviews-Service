DROP TABLE IF EXISTS "reviews";
CREATE TABLE "reviews" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INT,
  "rating" SMALLINT CHECK (rating > 0 AND rating < 6),
  "date" BIGINT,
  "summary" TEXT,
  "body" TEXT,
  "recommend" BOOLEAN,
  "reported" BOOLEAN DEFAULT false,
  "reviewer_name" TEXT,
  "reviewer_email" TEXT,
  "response" TEXT DEFAULT '',
  "helpfulness" INT DEFAULT 0
);


DROP TABLE IF EXISTS "photos";
CREATE TABLE "photos" (
  "id" SERIAL PRIMARY KEY,
  "review_id" INT,
  FOREIGN KEY (review_id)
    REFERENCES reviews(id),
  "url" TEXT
);

DROP TABLE IF EXISTS "chars";
CREATE TABLE "chars" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INT,
  "name" TEXT
);

DROP TABLE IF EXISTS "char_reviews";
CREATE TABLE "char_reviews" (
  "id" SERIAL PRIMARY KEY,
  "characteristic_id" INT,
  FOREIGN KEY (characteristic_id)
    REFERENCES chars(id),
  "review_id" INT,
  FOREIGN KEY (review_id)
    REFERENCES reviews(id),
  "value" SMALLINT CHECK (value > 0 AND value < 6)
);

/* IMPORT DATA */
\copy reviews FROM 'data/reviews.csv' CSV HEADER;
\copy photos FROM 'data/reviews_photos.csv' CSV HEADER;
\copy chars FROM 'data/characteristics.csv' CSV HEADER;
\copy char_reviews FROM 'data/characteristic_reviews.csv' CSV HEADER;

\copy reviews FROM 'data/output101.csv' CSV HEADER;

/* CREATE INDEXES */
CREATE INDEX idx_product_id ON reviews (product_id);
CREATE INDEX idx_avgRating_product_id ON avgRating (product_id);
CREATE INDEX idx_chars_product_id ON chars (product_id);
CREATE INDEX idx_chars_product_id ON chars (product_id);
CREATE INDEX idx_review_id ON photos (review_id);
CREATE INDEX idx_date ON reviews (date);

CREATE INDEX idx_rating ON reviews (rating);
CREATE INDEX idx_recommend ON reviews (recommend);

/* UPDATE SEQUENCES */
ALTER SEQUENCE reviews_id_seq RESTART WITH 5774953;
ALTER SEQUENCE photos_id_seq RESTART WITH 2742541;
ALTER SEQUENCE char_reviews_id_seq RESTART WITH 19327576;


-- UPDATE THE ID TO START WITH 1 + last id
-- GET last id
--- select id from reviews order by id desc limit 5;
-- QUERY FOR TO GET ALL SEQUENCES
--- SELECT * FROM pg_sequences Review;
-- ALTER SEQUENCE reviews_id_seq RESTART WITH 5774953;

/* MATERIALIZED VIEWS FOR AGGREGATED DATA */
-- CREATE MATERIALIZED VIEW starCount
-- AS SELECT product_id, rating, COUNT(rating)
-- FROM reviews
-- GROUP BY rating, product_id;

-- CREATE MATERIALIZED VIEW recCount
-- AS SELECT product_id, recommend, COUNT(recommend)
-- FROM reviews
-- GROUP BY recommend, product_id;

CREATE MATERIALIZED VIEW avgRating
AS SELECT product_id, c.id, c.name, AVG(cr.value)
FROM chars as c, char_reviews as cr
WHERE c.id = cr.characteristic_id
GROUP BY c.name, c.id;


REFRESH MATERIALIZED VIEW avgRating;

-- ALTER TABLE reviews
-- ADD COLUMN formatted_date TIMESTAMP WITH TIME ZONE;

-- UPDATE reviews
-- SET formatted_date =  TIME ZONE('UTC',TO_TIMESTAMP(date));

-- ALTER TABLE reviews
-- DROP COLUMN formatted_date;

-- ALTER TABLE reviews
-- RENAME COLUMN formatted_date TO date;



/Users/christianlee/hack-reactor/sdc/Reviews-Service/data/raw/characteristic_reviews.csv

scp -i SDC.pem ~/hack-reactor/sdc/Reviews-Service/data/raw/output100.csv ubuntu@ec2-107-20-23-72.compute-1.amazonaws.com:~/Reviews-Service/data


data/raw/characteristics.csv

/Users/christianlee/hack-reactor/sdc/Reviews-Service/data/raw
scp -i AWS.pem ~/hackreactor/course/Products-Service/data/product.csv [your-ssh-link]:~/Products-Service/data/