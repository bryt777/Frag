import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const DEFAULT_RESPONSE = (username) => ({
  username: username.startsWith("@") ? username : `@${username}`,
  price: "Unknown",
  status: "Unknown",
  available: false,
  message: "",
  developer: "ankucode",
  channel: "trybyte || @AnkuCode"
});

// Instagram checker
async function checkInstagram(username) {
  const cleaned = username.replace(/^@/, "");
  const url = `https://www.instagram.com/${cleaned}/`;

  try {
    const resp = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 Fragmesnt/1.0"
      },
      timeout: 5000,
      validateStatus: null
    });

    if (resp.status === 200) return { available: false, status: "Taken" };
    if (resp.status === 404) return { available: true, status: "Available" };
    return { available: false, status: "Unknown" };
  } catch {
    return { available: false, status: "Error" };
  }
}

// GET API
app.get("/check", async (req, res) => {
  const username = req.query.username;
  if (!username) return res.json({ error: "username missing" });

  const base = DEFAULT_RESPONSE(username);
  const live = req.query.live === "1";

  if (!live) {
    base.message = "Add &live=1 to check live";
    return res.json(base);
  }

  const result = await checkInstagram(username);
  base.status = result.status;
  base.available = result.available;

  return res.json(base);
});

// Root
app.get("/", (req, res) => {
  res.json({ service: "Fragmesnt API Ready!" });
});

// Export for Vercel
export default app;
