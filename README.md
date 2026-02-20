# TweetClaw Skill for OpenClaw

A Node.js-based skill that allows an OpenClaw agent to post tweets using the Twitter API v2. It includes a built-in CLI setup wizard for easy authentication.

## Requirements

*   **Node.js**
*   **Twitter Developer Account** (API Key, API Secret)

## Installation

1.  Clone or place this skill in your `~/Agents` directory.
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Run the CLI setup wizard:
    ```bash
    node scripts/login.js
    ```
    This script will guide you through:
    *   Setting up your App Keys (if not already set)
    *   Logging into your Twitter account via browser
    *   Saving your tokens securely to `.env`

## Usage

### Post a Tweet
```bash
node scripts/post_tweet.js "Hello World from OpenClaw!"
```

## License

MIT © [Saprative Jana](mailto:saprative@gmail.com)
