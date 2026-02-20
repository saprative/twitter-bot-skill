const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { TwitterApi } = require('twitter-api-v2');

// Check environment variables
if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET || !process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_SECRET) {
  console.error("Error: Missing Twitter API credentials. Please configure .env file.");
  process.exit(1);
}

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

const tweetText = process.argv[2];

if (!tweetText) {
  console.error("Usage: node scripts/post_tweet.js \"Hello World!\"");
  process.exit(1);
}

(async () => {
  try {
    const tweet = await client.v2.tweet(tweetText);
    console.log(`Tweet posted successfully! ID: ${tweet.data.id}`);
    console.log(`URL: https://twitter.com/user/status/${tweet.data.id}`);
  } catch (error) {
    console.error("Error posting tweet:", error);
    process.exit(1);
  }
})();
