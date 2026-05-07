const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    hnId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      default: 'unknown',
      trim: true,
    },
    postedAt: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Story', storySchema);
