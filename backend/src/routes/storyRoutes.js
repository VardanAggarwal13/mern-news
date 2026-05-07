const express = require('express');
const {
  listStories,
  getStory,
  toggleBookmark,
} = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listStories);
router.get('/:id', getStory);
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
