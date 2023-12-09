const { pool } = require("./db");
module.exports = {
  getReviews: async (req, res) => {
    try {
      const productId = req.query.product_id;
      const page = req.query.page || 1;
      const count = req.query.count || 5;
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
      const final = {
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

      res.status(200).send(final);
    } catch (err) {
      console.error(err);
    }
  },
  postReview: async (req, res) => {
    try {
      const keys = Object.keys(req.query);
      if (keys.indexOf("name") !== -1) {
        keys[keys.indexOf("name")] = "reviewer_name";
      }
      if (keys.indexOf("email") !== -1) {
        keys[keys.indexOf("email")] = "reviewer_email";
      }

      const qString = `INSERT INTO reviews (${keys})
        VALUES (${Object.values(req.query)});`;

      const result = await pool.query(qString);
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
      const result = await pool.query("SELECT * FROM reviews LIMIT 10;");
      res.send(result.rows);
    } catch (err) {
      console.error(err);
    }
  },
};
