const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", async (req, res) => {
  try {
    const qString = "SELECT * FROM REVIEWS LIMIT 10;";
    const result = await db.query(qString);
    console.log(result);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("Error starting server");
  } else {
    console.log("Server running on port: ", process.env.PORT);
  }
});
