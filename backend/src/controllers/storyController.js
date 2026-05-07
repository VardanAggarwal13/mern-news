const mongoose = require('mongoose');
const Story = require('../models/Story');

const listStories = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const [stories, total] = await Promise.all([
      Story.find().sort({ points: -1, createdAt: -1 }).skip(skip).limit(limit),
      Story.countDocuments(),
    ]);

    res.json({
      stories,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    next(err);
  }
};

const getStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid story id');
    }

    const story = await Story.findById(id);
    if (!story) {
      res.status(404);
      throw new Error('Story not found');
    }

    res.json(story);
  } catch (err) {
    next(err);
  }
};

const toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid story id');
    }

    const story = await Story.findById(id);
    if (!story) {
      res.status(404);
      throw new Error('Story not found');
    }

    const user = req.user;
    const idx = user.bookmarks.findIndex((b) => b.toString() === id);
    let bookmarked;

    if (idx === -1) {
      user.bookmarks.push(story._id);
      bookmarked = true;
    } else {
      user.bookmarks.splice(idx, 1);
      bookmarked = false;
    }

    await user.save();

    res.json({
      bookmarked,
      bookmarks: user.bookmarks,
    });
  } catch (err) {
    next(err);
  }
};

const getMyBookmarks = async (req, res, next) => {
  try {
    await req.user.populate({
      path: 'bookmarks',
      options: { sort: { points: -1, createdAt: -1 } },
    });
    res.json({ stories: req.user.bookmarks });
  } catch (err) {
    next(err);
  }
};

module.exports = { listStories, getStory, toggleBookmark, getMyBookmarks };
