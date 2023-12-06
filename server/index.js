const express = require("express");
const path = require("path");
const router = require("./router");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/", router);

app.listen(port, (err) => {
  if (err) {
    console.log("Error starting server");
  } else {
    console.log("Server running on port: ", port);
  }
});
