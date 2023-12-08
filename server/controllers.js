const { pool } = require("./db");
module.exports = {
  getReviews: async (req, res) => {
    try {
      const productId = req.query.product_id;
      const page = req.query.page || 1;
      const count = req.query.count || 5;
      // // CONCAT ALL PHOTO URLS BY REVIEW ID
      // const qString2 = `SELECT STRING_AGG(id || ', ' || url ,', '), review_id
      // FROM photos
      // WHERE review_id
      // IN (SELECT id
      // FROM reviews
      // WHERE product_id=${productId}
      // ORDER BY date ASC
      // LIMIT ${count}
      // OFFSET ${(page - 1) * count})
      // GROUP BY review_id;`;
      // STRING_AGG('{"id":' || p.id || ', "url":"' || p.url || '"}',', ') as photos

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

      res.send(final);
    } catch (err) {
      console.error(err);
    }
  },
  postReview: async (req, res) => {
    try {
      const qString = "SELECT * FROM reviews LIMIT 10;";
      const result = await pool.query();
      res.send(result.rows);
    } catch (err) {
      console.error(err);
    }
  },
  report: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM reviews LIMIT 10;");
      res.send(result.rows);
    } catch (err) {
      console.error(err);
    }
  },
  markHelpful: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM reviews LIMIT 10;");
      res.send(result.rows);
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
