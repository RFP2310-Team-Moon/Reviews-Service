const { pool } = require("./db");

const cache = {
  getReviews: {},
  getMetadata: {},
};

module.exports = {
  getReviews: async (req, res) => {
    try {
      const productId = req.query.product_id;
      const page = req.query.page || 1;
      const count = req.query.count || 5;
      let final;
      // if (cache.getReviews[productId + page + count]) {
      //   final = cache.getReviews[productId];
      // } else {
      const qString3 = `SELECT reviews.id as review_id,
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
          WHERE reviews.product_id=${productId}
          GROUP BY reviews.id
          ORDER BY date ASC
          LIMIT ${count}
          OFFSET ${(page - 1) * count};`;
      const result3 = await pool.query(qString3);
      final = {
        product: productId,
        page,
        count,
        result: result3.rows,
      };
      for (let j = 0; j < final.result.length; j += 1) {
        const formattedDate = new Date(Number(final.result[j].date));
        const isoDateTime = formattedDate.toISOString();
        final.result[j].date = isoDateTime;

        if (final.result[j].photos !== "") {
          const photoArr = [];
          const idUrl = final.result[j].photos.split(", ");
          for (let i = 0; i < idUrl.length; i += 2) {
            photoArr.push({
              id: Number(idUrl[i]),
              url: idUrl[i + 1],
            });
          }
          final.result[j].photos = photoArr;
        }
      }
      // cache.getReviews[productId + "-" + page + "-" + count] = final;
      // }
      // console.log(cache.getReviews);
      res.status(200).send(final);
    } catch (err) {
      console.error(err);
    }
  },
  postReview: async (req, res) => {
    try {
      /* EMAIL VALIDATION */
      const mailFormat = /\S+@\S+\.\S+/;
      if (
        typeof req.query.email !== "string" ||
        !req.query.email.match(mailFormat)
      ) {
        console.log("invalid email");
        res.sendStatus(500);
      }

      /* PHOTO VALIDATION */
      let photos = req.query.photos.replace(/'/g, '"');
      photos = JSON.parse(photos);
      if (!Array.isArray(photos)) {
        console.log("Photos Incorrect Format");
        res.sendStatus(500);
      }
      for (let i = 0; i < photos.length; i += 1) {
        if (typeof photos[i] !== "string") {
          console.log("Photo link is not a string:", photos[i]);
          res.sendStatus(500);
        }
      }

      /* CHAR VALIDATION */
      const params = req.query;
      delete params.photos;
      const keys = Object.keys(params);
      if (keys.indexOf("name") !== -1) {
        keys[keys.indexOf("name")] = "reviewer_name";
      }
      if (keys.indexOf("email") !== -1) {
        keys[keys.indexOf("email")] = "reviewer_email";
      }

      /* INSERT TEXT */
      const qStringReviews = `INSERT INTO reviews (${keys})
        VALUES (${Object.values(params)})
        RETURNING id;`;
      const result = await pool.query(qStringReviews);

      /* INSERT PHOTOS */
      const photoInsert = photos.map((url) => [String(result.rows[0].id), url]);
      const photoInsertQuery = {
        text: `INSERT INTO photos (review_id, url) VALUES ($1, $2);`,
        values: photoInsert.length === 1 ? photoInsert[0] : photoInsert,
      };
      await pool.query(photoInsertQuery);

      console.log("INSERTED", req.query);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
    }
  },
  report: async (req, res) => {
    try {
      const { review_id } = req.params;
      const qString = `UPDATE reviews SET reported = true WHERE id=${review_id};`;
      await pool.query(qString);
      console.log(`Review id: ${review_id} reported successfully`);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
    }
  },
  markHelpful: async (req, res) => {
    try {
      const { review_id } = req.params;
      const qString = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id=${review_id};`;
      await pool.query(qString);
      console.log("Helpful +1 for Review id", review_id);
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
    }
  },
  getMetadata: async (req, res) => {
    try {
      const { product_id } = req.query;
      // Average Rating by Characteristics
      const qStringChar = `SELECT id, name, avg
        FROM avgRating
        WHERE product_id=${product_id}
        ORDER BY id;`;
      // Star Rating Count
      const qStringRate = `SELECT product_id, rating, COUNT(rating)
        FROM reviews
        WHERE product_id=${product_id}
        GROUP BY rating, product_id;`;
      // Rec Count
      const qStringRec = `SELECT recommend, COUNT(recommend)
        FROM reviews
        WHERE product_id=${product_id}
        GROUP BY product_id, recommend;`;

      const result1 = await pool.query(qStringChar);
      const result2 = await pool.query(qStringRate);
      const result3 = await pool.query(qStringRec);

      const characteristics = {};
      result1.rows.forEach((char) => {
        characteristics[char.name] = {
          id: char.id,
          value: char.avg,
        };
      });

      const ratings = {};
      result2.rows.forEach((rating) => {
        ratings[rating.rating] = rating.count;
      });

      const recommended = {};
      result3.rows.forEach((rec) => {
        recommended[rec.recommend] = rec.count;
      });

      const result = {
        product_id,
        ratings,
        recommended,
        characteristics,
      };

      res.send(result);
    } catch (err) {
      console.error(err);
    }
  },
};
