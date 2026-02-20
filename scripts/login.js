const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ENV_PATH = path.resolve(__dirname, '../.env');

// Check for App Keys
if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
  console.error("Error: TWITTER_API_KEY and TWITTER_API_SECRET must be set in .env to initiate login.");
  console.error("Please create a Twitter Developer App and add its keys to .env first.");
  process.exit(1);
}

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
});

(async () => {
  try {
    // Generate auth link
    const authLink = await client.generateAuthLink('oob'); // Out-of-band (PIN flow)
    
    console.log('=================================================');
    console.log('🐦 TweetClaw CLI Login');
    console.log('=================================================');
    console.log('1. Open this URL in your browser:');
    console.log(`   ${authLink.url}`);
    console.log('2. Authorize the app.');
    console.log('3. Copy the PIN code provided by Twitter.');
    console.log('=================================================');

    rl.question('Paste the PIN code here: ', async (pin) => {
      try {
        const { client: loggedClient, accessToken, accessSecret, screenName, userId } = await client.login(pin);
        
        console.log(`\n✅ Login successful! Logged in as @${screenName} (${userId})`);

        // Update .env file
        updateEnvFile('TWITTER_ACCESS_TOKEN', accessToken);
        updateEnvFile('TWITTER_ACCESS_SECRET', accessSecret);

        console.log('🔑 Credentials saved to .env file.');
        console.log('You can now use tweetclaw to post tweets!');
      } catch (e) {
        console.error('\n❌ Login failed:', e.message);
      } finally {
        rl.close();
      }
    });

  } catch (e) {
    console.error('Error starting auth flow:', e);
    rl.close();
  }
})();

function updateEnvFile(key, value) {
  let envContent = '';
  if (fs.existsSync(ENV_PATH)) {
    envContent = fs.readFileSync(ENV_PATH, 'utf8');
  }

  const regex = new RegExp(`^${key}=.*`, 'm');
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${key}=${value}`);
  } else {
    envContent += `\n${key}=${value}`;
  }

  fs.writeFileSync(ENV_PATH, envContent.trim() + '\n');
}
