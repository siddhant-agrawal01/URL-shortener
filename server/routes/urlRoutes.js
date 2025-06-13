
const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  redirectUrl,
  getAnalytics,
  getUrlsByTag,
} = require('../controllers/urlController');
const { getAllUrls } = require('../controllers/urlController');

router.get('/all', getAllUrls);


router.post('/shorten', shortenUrl);
router.get('/analytics/:code', getAnalytics);
router.get('/tag/:tag', getUrlsByTag);

router.get('/short/:code', redirectUrl);

module.exports = router;
