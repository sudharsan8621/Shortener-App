const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Url = require('../models/Url');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// POST /api/shorten
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) return res.status(400).json({ error: 'Long URL is required' });

  try {
    // Check if longUrl already shortened
    let url = await Url.findOne({ longUrl });
    if (url) return res.json(url);

    // Generate unique short code
    const shortCode = shortid.generate();

    url = new Url({
      longUrl,
      shortCode
    });

    await url.save();

    res.json({
      longUrl: url.longUrl,
      shortCode: url.shortCode,
      shortUrl: `${BASE_URL}/${url.shortCode}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
});

// GET /:shortCode (redirect)
router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const url = await Url.findOne({ shortCode });

    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json('No URL found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
});

// BONUS: Admin route to list all URLs
router.get('/admin/urls', async (req, res) => {
  try {
    const urls = await Url.find().sort({ date: -1 });
    res.json(urls);
  } catch (error) {
    console.error(error);
    res.status(500).json('Server error');
  }
});

module.exports = router;
