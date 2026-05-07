const express = require('express');
const { getMyBookmarks } = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me/bookmarks', protect, getMyBookmarks);

module.exports = router;
