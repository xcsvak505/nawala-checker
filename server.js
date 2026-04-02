const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ test route (biar kita tau hidup)
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
        "User-Agent": "Mozilla/5.0"
        // kalau perlu:
        // "Cookie": "amarok_session=ISI_COOKIE"
      },
      body: JSON.stringify({
        domains: [domain]
      })
    });

    const text = await response.text();

    console.log("LK21 RAW:", text); // 🔥 debug penting

    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch {
      res.status(500).send(text);
    }

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
