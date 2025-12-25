const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");


const app = express();
app.use(express.json());


app.post("/scrape", async (req, res) => {
const { company, start, end } = req.body;
const startDate = new Date(start);
const endDate = new Date(end);


let page = 1;
let reviews = [];


while (page <= 2) { // limit pages for demo
const url = `https://www.trustpilot.com/review/${company}?page=${page}`;
const response = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
const $ = cheerio.load(response.data);


$("article").each((_, el) => {
try {
const title = $(el).find("h2").text().trim();
const text = $(el).find("p").first().text().trim();
const date = new Date($(el).find("time").attr("datetime"));


if (date >= startDate && date <= endDate) {
reviews.push({
title,
review: text,
date: date.toISOString().split("T")[0],
source: "Trustpilot"
});
}
} catch {}
});


page++;
}


fs.writeFileSync("reviews.json", JSON.stringify(reviews, null, 2));
res.json(reviews);
});


app.listen(3000, () => console.log("Server running on port 3000"));