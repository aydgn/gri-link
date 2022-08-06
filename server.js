const express = require("express");
const path = require("path");
const { nanoid } = require("nanoid");

const app = express();
const views = path.join(__dirname, "./views");
const PORT = process.env.PORT || 3000;

require("./db");

const ShortUrl = require("./models/shortUrl");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(views));

app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "GET, POST",
    "Content-Security-Policy": "upgrade-insecure-requests",
    "X-Content-Security-Policy": "upgrade-insecure-requests",
    "X-WebKit-CSP": "upgrade-insecure-requests",
    Link: "<assets/scripts/main.js>; rel=preload; as=script; nopush, <https://unpkg.com/>; rel=preconnect",
  });
  next();
});

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls });
});

app.post("/shortenUrl", async (req, res) => {
  const URL = req.body.url;
  const ID = req.body.id;

  if (!URL) return res.send("Please enter a URL");

  // Check if ID is already in use
  if (ID && (await ShortUrl.findOne({ short: ID }))) {
    return res.send("ID is already in use");
  }

  ShortUrl.create({ full: URL, short: ID || nanoid(3) }, (err, data) => {
    if (err) {
      console.log("🦄 Error:", err);
    } else {
      console.log("✅ URL sent to DB:", data);
      res.status(200).redirect("/");
    }
  });
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (!shortUrl) return res.status(404).send('URL not found. <a href="/">Go Back</a>');

  shortUrl.clicks++;
  shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(PORT, () => {
  console.log(`🟢 Server listening on: ▶️ http://localhost:${PORT}`);
});
