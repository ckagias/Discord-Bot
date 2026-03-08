# 🤖 Discord Bot

A Discord bot template built with **[discord.js](https://discord.js.org/)**, featuring slash commands organized by category.

---

## 📁 Project Structure

```
Discord-Bot/
├── data/                # Shared static data used by commands
│   └── responses.js     # Truth, dare & 8ball response arrays
├── events/              # Handles bot startup and slash command execution
│   ├──clientReady.js
│   └── interactionCreate.js
│   └── messageCreate.js
├── handlers/            # Automatically loads events and slash commands
│   ├── eventHandler.js
│   └── slashCommandHandler.js
├── models/              # Database schemas for persistent data storage
│   ├── GuildSchema.js
│   └── LevelSchema.js
├── slashCommands/       # All slash commands organized by category
│   ├── fun/             # 8ball, dare, truth, gayrate, poll
│   ├── info/            # avatar, server-avatar, server-info, membercount, ping, uptime, help, commands, github
│   ├── leveling/        # leaderboard, level, toggleleveling
│   ├── minigames/       # gamble
│   ├── settings/        # database, membercount
│   └── utility/         # purge, shorten
├── src/
│   ├── index.js         # Bot entry point
│   └── cmd.js           # Slash command registration script
├── .env                 # Your secret tokens (never share this!)
├── package.json
└── package-lock.json
```

---

## 🧩 Commands

### 🎉 Fun

| Command    | Description                                            |
| ---------- | ------------------------------------------------------ |
| `/8ball`   | Ask a question and get a random answer                 |
| `/dare`    | Get a random dare                                      |
| `/truth`   | Get a random truth question                            |
| `/gayrate` | Rate how gay a user is                                 |
| `/poll`    | Create a poll with up to 4 options and reaction voting |

### ℹ️ Info

| Command          | Description                                       |
| ---------------- | ------------------------------------------------- |
| `/avatar`        | Show a user's global avatar                       |
| `/server-avatar` | Show a user's server avatar                       |
| `/server-info`   | Display detailed server information               |
| `/ping`          | Show the bot's latency and API ping               |
| `/uptime`        | Show how long the bot has been online             |
| `/help`          | Show bot info and system stats                    |
| `/commands`      | List all available commands by category           |
| `/weather`       | Show the current weather for a city               |
| `/github`        | Show GitHub profile & repository stats for a user |

### ⏫ Leveling

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `/leaderboard`    | Display server's leaderboard |
| `/level`          | Display user's level         |
| `/toggleleveling` | Toggles the leveling system  |

### 🎮 Minigames

| Command   | Description                         |
| --------- | ----------------------------------- |
| `/gamble` | Bet your credits on a high-low roll |

### ⚙️ Settings

| Command        | Description                    |
| -------------- | ------------------------------ |
| `/database`    | Show the bot's database        |
| `/membercount` | Show the server's member count |

### 🔧 Utility

| Command    | Description                                            |
| ---------- | ------------------------------------------------------ |
| `/purge`   | Delete a number of messages (requires Manage Messages) |
| `/shorten` | Shorten a URL using is.gd                              |

---

## ⚙️ Installation

1. **Clone or download** the repository

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create an `.env` file** with the following values:

   ```
   Token=your_discord_bot_token
   ClientID=your_discord_application_id
   WEATHER_API_KEY=your_openweathermap_api_key
   MONGODB_URL=your_mongodb_url
   GITHUB_TOKEN = your_github_token

   ```

   - Get your bot token and client ID here: https://discord.com/developers/applications/
   - Get your weather API key here: https://home.openweathermap.org/api_keys
   - Get your MongoDB URL here: https://cloud.mongodb.com/
   - Get your GitHub token here: https://github.com/settings/tokens

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
- [mongoose](https://mongoosejs.com/) - MongoDB object modeling tool (used for managing the database)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
