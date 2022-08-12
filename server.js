const express = require("express");
const compression = require("compression");
const path = require("path");
const { nanoid } = require("nanoid");

const app = express();
app.use(compression());

const views = path.join(__dirname, "./views");
const PORT = process.env.PORT || 3000;

require("./db");

const ShortUrl = require("./models/shortUrl");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(views));

app.use((req, res, next) => {
  res.set({
    Link: "<https://cdnjs.cloudflare.com/>; rel=preconnect",
    Link: "<https://cdnjs.cloudflare.com/ajax/libs/picocss/1.5.3/pico.min.css>; rel=preload; as=style",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Origin": "https://grilink.herokuapp.com/",
    "Content-Security-Policy": "upgrade-insecure-requests",
    "Permissions-Policy":
      "accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=(), clipboard-read=(), gamepad=(), speaker-selection=(), conversion-measurement=(), focus-without-user-activation=(), hid=(), idle-detection=(), interest-cohort=(), serial=(), sync-script=(), trust-token-redemption=(), window-placement=(), vertical-scroll=()",
    "Referrer-Policy": "no-referrer-when-downgrade",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Security-Policy": "upgrade-insecure-requests",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-WebKit-CSP": "upgrade-insecure-requests",
    "Cache-Control": "max-age=3600, must-revalidate",
  });
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/latest", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("latest", { shortUrls });
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
      return res.status(200).redirect(`/?success=${data.short}`);
    }
  });
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (!shortUrl) return res.status(404).send('<h1>⚠️ URL not found. <a href="/">Go Back</a></h1>');

  shortUrl.clicks++;
  shortUrl.save();

  return res.redirect(shortUrl.full);
});

app.listen(PORT, () => console.log(`🟢 Server listening on: ▶️ http://localhost:${PORT}`));
