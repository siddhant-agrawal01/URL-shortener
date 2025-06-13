// routes/redirectRoutes.js
const express = require('express');
const router = express.Router();
const { redirectUrl } = require('../controllers/urlController');

router.get('/:code', redirectUrl); // short/:code will be handled here

module.exports = router;
