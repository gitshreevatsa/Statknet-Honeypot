// import getEventsFromChain from "./controller";
const cors = require("cors");
const { debugTransactions, testABI } = require("./controller");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());
app.get("/", debugTransactions);
app.get("/test", testABI);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
