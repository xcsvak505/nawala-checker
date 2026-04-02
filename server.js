const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

// ✅ allow frontend edgeone
app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.post("/api/check", async (req, res) => {
  try {
    const domain = req.body.domain;

    const response = await fetch("https://app.lk21.st/api/amarok/nawala-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "https://app.lk21.st",
        "Referer": "https://app.lk21.st/amarok",
        "User-Agent": "Mozilla/5.0"
        // 🔥 kalau masih gagal, aktifin ini:
        // "Cookie": "amarok_session=ISI_COOKIE_KAMU"
      },
      body: JSON.stringify({
        domains: [domain]
      })
    });

    const text = await response.text();

    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch {
      res.send(text);
    }

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
