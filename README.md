# TweetClaw Skill for OpenClaw

A simple Node.js-based skill that allows an OpenClaw agent to post tweets using the Twitter API v2.

## Requirements

*   **Node.js**
*   **Twitter Developer Account** (API Key, API Secret)
*   **OpenClaw** (Agent Framework)

## Installation

1.  Clone or place this skill in your `~/Agents` directory.
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Configure API credentials in `.env` (copy from `.env.example`):
    ```bash
    TWITTER_API_KEY=your_key
    TWITTER_API_SECRET=your_secret
    ```
4.  Run the CLI login script to authorize your account:
    ```bash
    node scripts/login.js
    ```
    This will generate the Access Token and Secret for you.

## Usage

This skill exposes a `post_tweet.js` script that accepts a tweet message as an argument.

```bash
node scripts/post_tweet.js "Hello World from OpenClaw!"
```

## License

MIT © [Saprative Jana](mailto:saprative@gmail.com)
