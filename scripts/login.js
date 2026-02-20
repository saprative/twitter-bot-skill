const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const ENV_PATH = path.resolve(__dirname, '../.env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

(async () => {
  console.log('\n🐦 TweetClaw Setup Wizard');
  console.log('=======================');

  let appKey = process.env.TWITTER_API_KEY;
  let appSecret = process.env.TWITTER_API_SECRET;

  // 1. Get App Credentials if missing
  if (!appKey || !appSecret) {
    console.log('\n[Step 1] Twitter Developer App Credentials');
    console.log('To use this bot, you need "API Key" and "API Key Secret" from the Twitter Developer Portal.');
    console.log('1. Go to https://developer.twitter.com/en/portal/projects-and-apps');
    console.log('2. Create an App (or use an existing one).');
    console.log('3. In "User authentication settings", enable OAuth 1.0a.');
    console.log('4. Set "App permissions" to "Read and Write".');
    console.log('5. Copy the keys from the "Keys and tokens" tab.\n');
    
    appKey = (await question('Enter API Key (Consumer Key): ')).trim();
    appSecret = (await question('Enter API Key Secret (Consumer Secret): ')).trim();

    if (!appKey || !appSecret) {
      console.error('❌ Error: Keys are required to proceed.');
      process.exit(1);
    }
  }

  const client = new TwitterApi({ appKey, appSecret });

  try {
    // 2. Generate Auth Link
    const authLink = await client.generateAuthLink('oob');

    console.log('\n[Step 2] Authorize Account');
    console.log('Open this link in your browser to authorize the bot:');
    console.log(`\n👉  ${authLink.url}\n`);

    const pin = (await question('Enter the PIN code displayed by Twitter: ')).trim();

    if (!pin) {
      console.error('❌ Error: PIN is required.');
      process.exit(1);
    }

    // 3. Login
    const { client: loggedClient, accessToken, accessSecret, screenName, userId } = await client.login(pin);

    console.log(`\n✅ Success! Logged in as @${screenName}`);

    // 4. Save to .env
    let envContent = '';
    if (fs.existsSync(ENV_PATH)) {
      envContent = fs.readFileSync(ENV_PATH, 'utf8');
    }

    const updates = {
      TWITTER_API_KEY: appKey,
      TWITTER_API_SECRET: appSecret,
      TWITTER_ACCESS_TOKEN: accessToken,
      TWITTER_ACCESS_SECRET: accessSecret
    };

    // Helper to update or append env vars
    Object.entries(updates).forEach(([key, val]) => {
      const regex = new RegExp(`^${key}=.*`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${val}`);
      } else {
        // Ensure new lines start on a new line
        if (envContent && !envContent.endsWith('\n')) envContent += '\n';
        envContent += `${key}=${val}`;
      }
    });

    fs.writeFileSync(ENV_PATH, envContent.trim() + '\n');
    console.log(`\n💾 Credentials saved to .env`);
    console.log('🚀 Setup complete! You can now use TweetClaw.');

  } catch (e) {
    console.error('\n❌ Authentication Failed:', e.message);
    console.log('Tip: Ensure your App Keys are correct and have "Read and Write" permissions enabled in the Developer Portal.');
  } finally {
    rl.close();
  }
})();
