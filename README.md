# 🤖 Telegram Connect

[![npm version](https://img.shields.io/npm/v/telegram-connect.svg)](https://npmjs.com/package/telegram-connect)
[![License](https://img.shields.io/npm/l/telegram-connect.svg)](https://github.com/code-programmingg/telegram-connect/blob/main/LICENSE)
[![Downloads](https://img.shields.io/npm/dm/telegram-connect.svg)](https://npmjs.com/package/telegram-connect)

A modern, lightweight Telegram Bot API wrapper for Node.js with full ES Module and CommonJS support.

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
  - [ES Modules (Recommended)](#es-modules-recommended)
  - [CommonJS](#commonjs)
- [API Reference](#-api-reference)
  - [connect(options)](#connectoptions)
  - [Bot Methods](#bot-methods)
  - [Context Methods](#context-methods)
  - [Button Types](#button-types)
- [Examples](#-examples)
  - [Basic Echo Bot](#basic-echo-bot)
  - [Bot with Multiple Commands](#bot-with-multiple-commands)
  - [Welcome New Members](#welcome-new-members)
  - [Advanced Keyboard Layout](#advanced-keyboard-layout)
  - [Custom Prefix Usage](#custom-prefix-usage)
- [Environment Setup](#-environment-setup)
- [Requirements](#-requirements)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)
- [Acknowledgments](#-acknowledgments)

## ✨ Features

- 🚀 **Modern JavaScript** - Built for ES Modules with CommonJS fallback
- 🎯 **Simple API** - Clean and intuitive interface
- 🔘 **Inline Keyboards** - Easy button creation and handling
- 📝 **Command Handling** - Built-in command routing
- 👥 **Group Events** - Handle new member joins and other group events
- 🛡️ **Type Safety** - Well-structured with clear interfaces
- ⚡ **Lightweight** - Minimal dependencies

## 📦 Installation

```bash
npm install telegram-connect
```

## 🚀 Quick Start

> ⚠️ **Important Order**: Always call `bot.start()` first before using `bot.commands`, `bot.on()`, or other bot methods!

### ES Modules (Recommended)

```javascript
import { connect, Button } from "telegram-connect";
import fetch from "node-fetch";

// Required for Node.js environments
global.fetch = fetch;

const bot = connect({
  token: "YOUR_BOT_TOKEN_HERE",
});

// ⚠️ IMPORTANT: Start the bot first!
bot.start({ loggerMessage: true });

// Now you can use bot.commands and bot.on methods
bot.commands.start((ctx) => {
  ctx.replyWithButtons(
    "Welcome! 👋",
    ctx.inlineKeyboard([
      Button.url("Visit Our Website", "https://example.com"),
    ]),
  );
});

// Handle new member joins
bot.on("join", (conn) => {
  const mama = conn.newMember.first_name;
  conn.sendMessage(`Welcome ${mama}! 🎉`);
});

// Handle regular messages
bot.on("message", (ctx) => {
  if (!ctx.text.startsWith("/")) {
    ctx.sendMessage("Message received! ✅");
  }
});

// Error handling
bot.on("error", (err) => {
  console.error("[❌ ERROR]", err);
});
```

### CommonJS

```javascript
const { connect, Button } = require("telegram-connect");
const fetch = require("node-fetch");

global.fetch = fetch;

const bot = connect({
  token: "YOUR_BOT_TOKEN_HERE",
});

// ⚠️ IMPORTANT: Start the bot before using any bot methods!
// Same usage as ES Modules...
```

## 📚 API Reference

### `connect(options)`

Creates a new bot instance.

**Parameters:**

- `options.token` (string) - Your Telegram Bot Token from [@BotFather](https://t.me/botfather)

**Returns:** Bot instance

### Bot Methods

#### `bot.start(options)`

Starts the bot polling.

> ⚠️ **Important**: You must call `bot.start()` before using any bot methods like `bot.commands`, `bot.on()`, etc. The bot instance needs to be initialized first.

**Options:**

- `loggerMessage` (boolean) - Enable/disable console logging

#### `bot.commands.start(handler)`

Handles the `/start` command.

**Parameters:**

- `handler` (function) - Callback function with context parameter

#### `bot.on(event, handler)`

Registers event listeners.

**Events:**

- `'message'` - Incoming messages
- `'join'` - New member joins group/channel
- `'error'` - Error events

### Context Methods

#### `ctx.replyWithButtons(text, keyboard)`

Sends a message with inline keyboard.

**Parameters:**

- `text` (string) - Message text
- `keyboard` - Inline keyboard markup

#### `ctx.sendMessage(text)`

Sends a text message.

**Parameters:**

- `text` (string) - Message to send

#### `ctx.inlineKeyboard(buttons)`

Creates inline keyboard markup.

**Parameters:**

- `buttons` (array) - Array of button rows

### Join Event Context

When handling `'join'` events, the context object contains:

#### `conn.newMember`

Information about the new member who joined.

**Properties:**

- `first_name` (string) - First name of the new member
- `last_name` (string) - Last name of the new member (optional)
- `username` (string) - Username of the new member (optional)
- `id` (number) - User ID of the new member

#### `conn.sendMessage(text)`

Sends a welcome message to the group.

**Parameters:**

- `text` (string) - Welcome message to send

### Button Types

#### `Button.url(text, url)`

Creates a URL button.

**Parameters:**

- `text` (string) - Button text
- `url` (string) - Target URL

## 🎯 Examples

### Basic Echo Bot

```javascript
import { connect } from "telegram-connect";
import fetch from "node-fetch";

global.fetch = fetch;

const bot = connect({ token: "YOUR_TOKEN" });
bot.start({ loggerMessage: true });

bot.on("message", (ctx) => {
  if (!ctx.text.startsWith("/")) {
    ctx.sendMessage(`You said: ${ctx.text}`);
  }
});
```

### Bot with Multiple Commands

```javascript
import { connect, Button } from "telegram-connect";
import fetch from "node-fetch";

global.fetch = fetch;

const bot = connect({ token: "YOUR_TOKEN" });
bot.start({ loggerMessage: true });

bot.commands.start((ctx) => {
  ctx.replyWithButtons(
    "Choose an option:",
    ctx.inlineKeyboard([
      [Button.url("📱 Download App", "https://example.com/download")],
      [Button.url("📞 Contact Us", "https://example.com/contact")],
    ]),
  );
});

bot.commands.help((ctx) => {
  ctx.sendMessage(`
Available commands:
/start - Start the bot
/help - Show this help message
  `);
});

bot.commands.send(async (conn) => {
  await conn.sendPhoto(
    { url: "https://files.catbox.moe/5idb5o.png" },
    {
      caption: "here",
      mimetype: "image/png",
    },
  );
});
```

### Welcome New Members

```javascript
import { connect, Button } from "telegram-connect";
import fetch from "node-fetch";

global.fetch = fetch;

const bot = connect({ token: "YOUR_TOKEN" });
bot.start({ loggerMessage: true });

// Welcome new members with personalized message
bot.on("join", (conn) => {
  const firstName = conn.newMember.first_name;
  const username = conn.newMember.username
    ? `@${conn.newMember.username}`
    : firstName;

  conn.sendMessage(
    `🎉 Welcome to our group, ${firstName}!\n\n` +
      `We're glad to have you here. Feel free to introduce yourself and ask any questions.`,
  );
});

// Advanced welcome with buttons
bot.on("join", (conn) => {
  const mama = conn.newMember.first_name;

  conn.replyWithButtons(
    `Welcome ${mama}! 🎊\n\nGet started with these helpful links:`,
    conn.inlineKeyboard([
      [Button.url("📋 Group Rules", "https://example.com/rules")],
      [Button.url("❓ FAQ", "https://example.com/faq")],
      [Button.url("💬 Support", "https://example.com/support")],
    ]),
  );
});

// Welcome message with member count
bot.on("join", (conn) => {
  const memberName = conn.newMember.first_name;
  // Note: You might need to implement getMemberCount() based on your bot's capabilities

  conn.sendMessage(
    `🎉 ${memberName} just joined our community!\n` +
      `Welcome aboard! You're now part of our growing family.`,
  );
});
```

### Advanced Keyboard Layout

```javascript
bot.commands.menu((ctx) => {
  ctx.replyWithButtons(
    "Main Menu:",
    ctx.inlineKeyboard([
      [
        Button.url("🏠 Home", "https://example.com"),
        Button.url("📖 Docs", "https://docs.example.com"),
      ],
      [Button.url("💬 Support", "https://support.example.com")],
      [Button.url("🌟 GitHub", "https://github.com/username/repo")],
    ]),
  );
});
```

### Custom Prefix Usage

```javascript
// Handle messages with custom prefixes
bot.on("message", (ctx) => {
  const text = ctx.text.toLowerCase();

  if (text.startsWith("!hello")) {
    ctx.sendMessage("Hello there! 👋");
  } else if (text.startsWith("!time")) {
    ctx.sendMessage(`Current time: ${new Date().toLocaleString()}`);
  }
});
```

## 🔧 Environment Setup

Create a `.env` file in your project root:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

Then use it in your code:

```javascript
import dotenv from "dotenv";
dotenv.config();

const bot = connect({
  token: process.env.TELEGRAM_BOT_TOKEN,
});
```

## Common Mistakes to Avoid

> ❌ **Wrong Order** - This will cause errors:
>
> ```javascript
> const bot = connect({ token: 'YOUR_TOKEN' })
>
> // DON'T do this before bot.start()
> bot.commands.start((ctx) => { ... }) // ❌ Error!
> bot.on('message', (ctx) => { ... })  // ❌ Error!
>
> bot.start({ loggerMessage: true })
> ```

> ✅ **Correct Order** - Always start the bot first:
>
> ```javascript
> const bot = connect({ token: 'YOUR_TOKEN' })
>
> // Start the bot first
> bot.start({ loggerMessage: true })
>
> // Now you can safely use bot methods
> bot.commands.start((ctx) => { ... }) // ✅ Works!
> bot.on('message', (ctx) => { ... })  // ✅ Works!
> ```

## 📋 Requirements

- Node.js 14.0.0 or higher
- A Telegram Bot Token (get one from [@BotFather](https://t.me/botfather))

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 [Documentation](https://github.com/yourusername/telegram-connect/wiki)
- 🐛 [Issues](https://github.com/yourusername/telegram-connect/issues)
- 💬 [Discussions](https://github.com/yourusername/telegram-connect/discussions)

## 🙏 Acknowledgments

- [Telegram Bot API](https://core.telegram.org/bots/api) for the amazing platform
- All contributors who help improve this project

---

Made with ❤️ by [CodeProgramming](https://github.com/code-programmingg)
