// import getEventsFromChain from "./controller";

const { debugTransactions } = require("./controller");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.get("/", debugTransactions);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
