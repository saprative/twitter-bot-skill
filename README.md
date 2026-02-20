# TweetClaw Skill for OpenClaw

A simple Node.js-based skill that allows an OpenClaw agent to post tweets using the Twitter API v2.

## Requirements

*   **Node.js**
*   **Twitter Developer Account** (API Key, Secret, Access Token, Access Secret)
*   **OpenClaw** (Agent Framework)

## Installation

1.  Clone or place this skill in your `~/Agents` directory.
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Configure credentials in a `.env` file (see `.env.example`).

## Usage

This skill exposes a `post_tweet.js` script that accepts a tweet message as an argument.

```bash
node scripts/post_tweet.js "Hello World from OpenClaw!"
```

## License

MIT © [Saprative Jana](mailto:saprative@gmail.com)
