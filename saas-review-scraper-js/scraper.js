// scraper.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors()); // enable CORS for frontend fetch

app.post("/scrape", async (req, res) => {
  const { company, start, end } = req.body;
  const startDate = new Date(start);
  const endDate = new Date(end);

  let page = 1;
  const maxPages = 2; // limit to 2 pages for demo
  let reviews = [];

  try {
    while (page <= maxPages) {
      const url = `https://www.trustpilot.com/review/${company}?page=${page}`;
      const response = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const $ = cheerio.load(response.data);

      $("article").each((_, el) => {
        try {
          const title = $(el).find("h2").text().trim();
          const text = $(el).find("p").first().text().trim();
          const dateAttr = $(el).find("time").attr("datetime");
          if (!dateAttr) return;
          const date = new Date(dateAttr);

          if (date >= startDate && date <= endDate) {
            reviews.push({
              title,
              review: text,
              date: date.toISOString().split("T")[0],
              source: "Trustpilot"
            });
          }
        } catch (err) {
          console.log("Error parsing review:", err.message);
        }
      });

      page++;
    }

    // Save to file
    fs.writeFileSync("reviews.json", JSON.stringify(reviews, null, 2));
    res.json(reviews);
  } catch (err) {
    console.log("Error scraping:", err.message);
    res.status(500).json({ error: "Failed to scrape reviews" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
