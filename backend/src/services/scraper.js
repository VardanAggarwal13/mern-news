const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const HN_URL = 'https://news.ycombinator.com';
const MAX_STORIES = 10;

const scrapeTopStories = async () => {
  const { data: html } = await axios.get(HN_URL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; HN-Scraper/1.0; +https://example.com)',
    },
    timeout: 15000,
  });

  const $ = cheerio.load(html);
  const items = $('tr.athing').slice(0, MAX_STORIES);
  const stories = [];

  items.each((_, el) => {
    const $row = $(el);
    const hnId = $row.attr('id');
    const $titleLink = $row.find('.titleline > a').first();
    const title = $titleLink.text().trim();
    let url = $titleLink.attr('href') || '';

    if (url && !/^https?:\/\//i.test(url)) {
      url = `${HN_URL}/${url.replace(/^\//, '')}`;
    }

    const $subtext = $row.next('tr').find('.subtext');
    const pointsText = $subtext.find('.score').text().trim();
    const points = parseInt(pointsText.replace(/[^0-9]/g, ''), 10) || 0;
    const author = $subtext.find('.hnuser').text().trim() || 'unknown';
    const postedAt = $subtext.find('.age').text().trim();

    if (hnId && title) {
      stories.push({ hnId, title, url, points, author, postedAt });
    }
  });

  if (stories.length === 0) {
    throw new Error('No stories were parsed — HN markup may have changed');
  }

  const ops = stories.map((s) => ({
    updateOne: {
      filter: { hnId: s.hnId },
      update: { $set: s },
      upsert: true,
    },
  }));

  await Story.bulkWrite(ops);

  return stories;
};

module.exports = { scrapeTopStories };
