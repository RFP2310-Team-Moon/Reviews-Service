const { pool } = require("./db");
module.exports = {
  getReviews: async (req, res) => {
    try {
      const productId = req.query.product_id;
      const page = req.query.page || 1;
      const count = req.query.count || 5;
      const qString = `SELECT id,
        rating,
        summary,
        recommend,
        response,
        body,
        date,
        reviewer_name,
        helpfulness
        FROM reviews
        WHERE product_id=${productId}
        ORDER BY date ASC
        LIMIT ${count}
        OFFSET ${(page - 1) * count}`;

      /*
        SELECT reviews.id AS "review_id", rating, summary, recommend, response, body, date, reviewer_name, helpfulness, photos.url
        FROM reviews INNER JOIN photos ON review_id = photos.review_id
        WHERE reviews.product_id=2
        ORDER BY date ASC
        LIMIT 5
        OFFSET 0

        Select STRING_AGG(p.id || ', ' || url ,', '), review_id from reviews inner join photos AS p ON reviews.id = p.review_id where product_id = 2 group by review_id;

        SELECT p.review_id,
        AVG(rating),
        summary,
        recommend,
        response,
        body,
        date,
        reviewer_name,
        helpfulness,
        STRING_AGG(p.id || ', ' || p.url, ', ')
        FROM reviews
        INNER JOIN photos as p
        ON review_id = p.review_id
        WHERE reviews.product_id=2
        group by p.review_id, rating;


      */
      const result = await pool.query(qString);
      for (let i = 0; i < result.rows.length; i += 1) {
        const date = moment(result.rows[i].date);
        date = date.format("DD/MM/YYYY HH:mm:ss");

        console.log(date);
        result.rows[i].date = date;
      }
      const result2 = {
        product: productId,
        page,
        count,
        result: result.rows,
      };
      console.log(result.rows);
      res.send(result2);
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
