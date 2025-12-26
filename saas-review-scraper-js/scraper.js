const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/scrape", (req, res) => {
  const reviews = JSON.parse(fs.readFileSync("reviews.json", "utf8"));
  res.json(reviews); // Always return reviews
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
