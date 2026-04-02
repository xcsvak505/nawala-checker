const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend hidup 🔥");
});

app.post("/api/check", async (req, res) => {
  try {
    const domain = req.body.domain;

    if (!domain) {
      return res.status(400).json({ error: "Domain required" });
    }

    const response = await fetch("https://app.lk21.st/api/amarok/nawala-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://app.lk21.st",
        "Referer": "https://app.lk21.st/amarok",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",

        // ✅ COOKIE FIX (punya kamu)
        "Cookie": "amarok_session=d21fa8ce031b8a898cca218440a80a6a4c41a803d2d2c1f72bf8ea4ea1eeeade"
      },
      body: JSON.stringify({
        domains: [domain]
      })
    });

    const text = await response.text();

    console.log("RAW:", text); // debug

    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch {
      res.status(500).send(text);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
