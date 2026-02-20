#!/usr/bin/env node
const { Command } = require('commander');
const path = require('path');
const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const readline = require('readline');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const program = new Command();
const ENV_PATH = path.resolve(__dirname, '../.env');

// --- Helpers ---
const question = (query) => new Promise((resolve) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  });
});

const updateEnvFile = (key, value, envContent) => {
  const regex = new RegExp(`^${key}=.*`, 'm');
  if (regex.test(envContent)) {
    return envContent.replace(regex, `${key}=${value}`);
  }
  return envContent + (envContent.endsWith('\n') ? '' : '\n') + `${key}=${value}`;
};

const saveEnv = (updates) => {
  let content = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, 'utf8') : '';
  Object.entries(updates).forEach(([key, val]) => {
    content = updateEnvFile(key, val, content);
  });
  fs.writeFileSync(ENV_PATH, content.trim() + '\n');
};

// --- Commands ---

program
  .name('tweetclaw')
  .description('Twitter CLI bot skill for OpenClaw')
  .version('1.0.0');

program.command('login')
  .description('Authenticate with Twitter')
  .action(async () => {
    console.log('\n🐦 TweetClaw Setup Wizard');
    console.log('=======================');

    let appKey = process.env.TWITTER_API_KEY;
    let appSecret = process.env.TWITTER_API_SECRET;

    if (!appKey || !appSecret) {
      console.log('\n[Step 1] Twitter Developer App Credentials');
      appKey = (await question('Enter API Key (Consumer Key): ')).trim();
      appSecret = (await question('Enter API Key Secret (Consumer Secret): ')).trim();

      if (!appKey || !appSecret) {
        console.error('❌ Error: Keys are required.');
        process.exit(1);
      }
    }

    const client = new TwitterApi({ appKey, appSecret });

    try {
      const authLink = await client.generateAuthLink('oob');
      console.log('\n[Step 2] Authorize Account');
      console.log(`\n👉  ${authLink.url}\n`);

      const pin = (await question('Enter the PIN code: ')).trim();
      if (!pin) throw new Error('PIN required');

      const { accessToken, accessSecret, screenName } = await client.login(pin);
      console.log(`\n✅ Logged in as @${screenName}`);

      saveEnv({
        TWITTER_API_KEY: appKey,
        TWITTER_API_SECRET: appSecret,
        TWITTER_ACCESS_TOKEN: accessToken,
        TWITTER_ACCESS_SECRET: accessSecret
      });
      console.log('💾 Credentials saved to .env');

    } catch (e) {
      console.error('\n❌ Login Failed:', e.message);
      process.exit(1);
    }
  });

program.command('post <text>')
  .description('Post a tweet')
  .action(async (text) => {
    if (!process.env.TWITTER_ACCESS_TOKEN || !process.env.TWITTER_ACCESS_SECRET) {
      console.error('❌ Not logged in. Run `tweetclaw login` first.');
      process.exit(1);
    }

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    try {
      const tweet = await client.v2.tweet(text);
      console.log(`✅ Tweet posted! ID: ${tweet.data.id}`);
      console.log(`https://twitter.com/i/status/${tweet.data.id}`);
    } catch (error) {
      console.error('❌ Error posting tweet:', error.message);
      process.exit(1);
    }
  });

program.parse();
