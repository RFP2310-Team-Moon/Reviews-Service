require("dotenv").config();
const express = require("express");
const router = require("./router");

const app = express();
const port = process.env.PORT || 5432;

app.use(express.json());
app.use("/api", router);

app.listen(port, (err) => {
  if (err) {
    console.log("Error starting server");
  } else {
    console.log("Server running on port: ", process.env.PORT);
  }
});
