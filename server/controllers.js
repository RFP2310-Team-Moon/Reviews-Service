const { pool } = require("./db");
module.exports = {
  getReviews: async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM reviews LIMIT 10;");
      res.send(result.rows);
    } catch (err) {
      console.error(err);
    }
  },
  // postReview: (req, res) => {},
  // report: (req, res) => {},
  // markHelpful: (req, res) => {},
  // getMetadata: (req, res) => {},
};
