require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { scrapeTopStories } = require('./services/scraper');

const PORT = process.env.PORT || 5000;

const runInitialScrape = async () => {
  try {
    const stories = await scrapeTopStories();
    console.log(`Initial scrape complete — ${stories.length} stories saved`);
  } catch (err) {
    console.error('Initial scrape failed:', err.message);
  }
};

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    runInitialScrape();
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
