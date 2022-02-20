const express = require("express");
const ShortUrl = require("../models/shortUrl");
const urlIsValid = require("../utils/urlIsValid");
const router = express.Router();

//Check if the given url exist and returns the shortenUrl from DB, else creates one and save it if the given url is valid
router.post("/shorturl", findByOriginalUrl, async (req, res) => {
  const { url, shortUrl } = res;

  if (shortUrl) {
    res.json(shortUrl);
    return;
  }

  if (urlIsValid(url)) {
    const newShortUrl = await ShortUrl.create({ original_url: url });
    const { original_url, short_url } = await newShortUrl.save();
    res.status(201).json({ original_url, short_url });
    return;
  }

  res.json({ error: "invalid url" });
});

//Find in Db the given shortUrl from params and redirect to the originalUrl
router.get("/shorturl/:shortUrl", async (req, res) => {
  const short_url = req.params.shortUrl;
  if (short_url) {
    try {
      const { original_url } = await ShortUrl.findOne({ short_url });
      res.redirect(original_url);
    } catch (err) {
      res.json({ error: "this url doesn't exist" });
    }
  }
});

//Find and return shortUrl by given url, else returns the same url
async function findByOriginalUrl(req, res, next) {
  const url = req.body.url;

  try {
    const { original_url, short_url } = await ShortUrl.findOne({
      original_url: url,
    });
    res.shortUrl = { original_url, short_url };
  } catch (err) {
    res.url = url;
  }

  next();
}

module.exports = router;
