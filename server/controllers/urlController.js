// controllers/urlController.js

const Url = require('../models/Url');
const { nanoid } = require('nanoid');
const deviceDetector = require('../utils/deviceDetector');
const hashUtil = require('../utils/hashUtil');
// GET /api/url/all
 const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find();

    const data = urls.map((url) => {
      const totalVisits = url.visits.length;
      const uniqueVisitors = new Set(url.visits.map(v => v.hash)).size;

      return {
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        totalVisits,
        uniqueVisitors,
        tags: url.tags,
        deviceCount: url.visits.reduce((acc, v) => {
          acc[v.device] = (acc[v.device] || 0) + 1;
          return acc;
        }, {}),
        timeSeries: url.visits.reduce((acc, v) => {
          const dateKey = new Date(v.timestamp).toISOString().slice(0, 10);
          acc[dateKey] = (acc[dateKey] || 0) + 1;
          return acc;
        }, {}),
        topReferrers: Object.entries(url.visits.reduce((acc, v) => {
          acc[v.referrer] = (acc[v.referrer] || 0) + 1;
          return acc;
        }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5),
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all URLs' });
  }
};

// POST /api/url/shorten
const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customCode, tags, expiryDate } = req.body;
    let shortCode = customCode || nanoid(7);

    // Check uniqueness for custom code
    const existing = await Url.findOne({ shortCode });
    if (existing) {
      return res.status(400).json({ message: 'Short code already in use.' });
    }

    const url = new Url({
      originalUrl,
      shortCode,
      customCode: customCode || null,
      tags,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    });

    await url.save();
    res.status(201).json({ shortUrl: `${process.env.BASE_URL}/short/${shortCode}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error while shortening URL.' });
  }
};

// GET /short/:code
const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) return res.status(404).json({ message: 'URL not found' });

    // Handle expiry
    if (url.expiryDate && new Date() > url.expiryDate) {
      return res.status(410).json({ message: 'Short URL has expired' });
    }

    // Log visit
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const device = deviceDetector(userAgent);
    const hash = hashUtil(ip + userAgent);
    const referrer = req.get('Referer') || 'direct';

    url.visits.push({
      timestamp: new Date(),
      ip,
      device,
      referrer,
      hash,
    });

    await url.save();

    res.redirect(302, url.originalUrl);
  } catch (error) {
    res.status(500).json({ message: 'Server error during redirection' });
  }
};

// GET /api/url/analytics/:code
const getAnalytics = async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) return res.status(404).json({ message: 'URL not found' });

    const visits = url.visits;

    const totalVisits = visits.length;
    const uniqueHashes = new Set(visits.map((v) => v.hash));
    const uniqueVisitors = uniqueHashes.size;

    const deviceCount = {};
    const referrerCount = {};
    const timeSeries = {};

    visits.forEach((v) => {
      deviceCount[v.device] = (deviceCount[v.device] || 0) + 1;
      referrerCount[v.referrer] = (referrerCount[v.referrer] || 0) + 1;

      const dateKey = new Date(v.timestamp).toISOString().slice(0, 10); // YYYY-MM-DD
      timeSeries[dateKey] = (timeSeries[dateKey] || 0) + 1;
    });

    const topReferrers = Object.entries(referrerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    res.json({
      originalUrl: url.originalUrl,
      totalVisits,
      uniqueVisitors,
      deviceCount,
      topReferrers,
      timeSeries,
      tags: url.tags,


  deviceType: deviceCount, // ✅ rename
  referrers: referrerCount, // ✅ rename timeSeries: Object.entries(timeSeries).map(([time, count]) => ({ time, count })),

  topReferrers, // optional if used separately

  timeSeries: Object.entries(timeSeries).map(([time, count]) => ({ time, count })),

  topReferrers, 

    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};

// GET /api/url/tag/:tag
const getUrlsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const urls = await Url.find({ tags: tag });

    const result = urls.map((url) => ({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      totalVisits: url.visits.length,
      tags: url.tags,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tagged URLs' });
  }
};

module.exports = {
  shortenUrl,
  redirectUrl,
  getAnalytics,
  getUrlsByTag,
  getAllUrls,
};
