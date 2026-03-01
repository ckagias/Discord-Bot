# 🤖 Discord Bot

A Discord bot template built with **[discord.js](https://discord.js.org/)**, featuring slash commands organized by category.

---

## 📁 Project Structure

```
Discord-Bot/
├── events/              # Bot events (clientReady, interactionCreate)
├── handlers/            # Automatically loads events and slash commands
│   ├── eventHandler.js
│   └── slashCommandHandler.js
├── slashCommands/       # All slash commands organized by category
│   ├── fun/             # 8ball, dare, truth, gayrate, gamble
│   ├── info/            # avatar, server-avatar, server-info, membercount, ping, uptime, help, commands
│   ├── minigames/       # Mini game commands
│   ├── settings/        # Server/bot settings commands
│   └── utility/         # purge, weather
├── src/
│   ├── index.js         # Bot entry point
│   └── cmd.js           # Slash command registration script
├── texts/               # Text files used by fun commands (8ball.txt, dares.txt, truths.txt)
├── .env                 # Your secret tokens (never share this!)
└── package.json
```

---

## 🧩 Commands

### 🎉 Fun
| Command | Description |
|---------|-------------|
| `/8ball` | Ask a question and get a random answer |
| `/dare` | Get a random dare |
| `/truth` | Get a random truth question |
| `/gayrate` | Rate how gay a user is |

### ℹ️ Info
| Command | Description |
|---------|-------------|
| `/avatar` | Show a user's global avatar |
| `/server-avatar` | Show a user's server avatar |
| `/server-info` | Display detailed server information |
| `/ping` | Show the bot's latency and API ping |
| `/uptime` | Show how long the bot has been online |
| `/help` | Show bot info and system stats |
| `/commands` | List all available commands by category |
| `/weather` | Show the current weather for a city |
| `/help` | Show information about the bot |

### 🎮 Minigames
| Command | Description |
|---------|-------------|
| `/gamble` | Bet your credits on a high-low roll |

### ⚙️ Settings
| Command | Description |
|---------|-------------|
| `/membercount` | Show the server's member count |

### 🔧 Utility
| Command | Description |
|---------|-------------|
| `/purge` | Delete a number of messages (requires Manage Messages) |

---

## ⚙️ Installation

1. **Clone or download** the repository

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your `.env` file** with the following values:
   ```
   Token=your_discord_bot_token
   ClientID=your_discord_application_id
   WEATHER_API_KEY=your_openweathermap_api_key
   ```
   - Get your bot token and client ID here: https://discord.com/developers/applications/
   - Get your weather API key here: https://home.openweathermap.org/api_keys

4. **Register slash commands** with Discord:
   ```bash
   node src/cmd.js
   ```

5. **Start the bot**:
   ```bash
   node src/index.js
   ```

---

## 📦 Dependencies

- [discord.js](https://discord.js.org/) — Main Discord library
- [axios](https://axios-http.com/) — HTTP requests (used for weather API)
- [moment](https://momentjs.com/) — Date/time formatting
- [outdent](https://www.npmjs.com/package/outdent) — Multi-line string formatting
- [dotenv](https://www.npmjs.com/package/dotenv) — Loads environment variables from `.env`

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).