const { scrapeTopStories } = require('../services/scraper');

const triggerScrape = async (req, res, next) => {
  try {
    const stories = await scrapeTopStories();
    res.json({
      message: 'Scrape complete',
      count: stories.length,
      stories,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { triggerScrape };
