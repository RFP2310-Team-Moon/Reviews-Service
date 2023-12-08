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


\copy reviews FROM '/Users/christianlee/hack-reactor/sdc/Reviews-Service/data/data/reviews.csv' CSV HEADER;
\copy photos FROM '/Users/christianlee/hack-reactor/sdc/Reviews-Service/data/data/reviews_photos.csv' CSV HEADER;
\copy chars FROM '/Users/christianlee/hack-reactor/sdc/Reviews-Service/data/data/characteristics.csv' CSV HEADER;
\copy char_reviews FROM '/Users/christianlee/hack-reactor/sdc/Reviews-Service/data/data/characteristic_reviews.csv' CSV HEADER;
