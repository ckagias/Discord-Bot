# Discord Bot Dashboard

Next.js 16 web dashboard for managing the Discord bot. Shares the bot's MongoDB instance for real-time reads and writes.

## Features

| Section | What you can manage |
|---|---|
| General | Bot prefix, log channel |
| Welcome & Farewell | Join/leave messages and channels |
| Moderation | Mod log channel, mute role |
| Auto-Mod | Spam/caps/link filters |
| Anti-Raid | Join-rate lockdown thresholds |
| Warn Thresholds | Auto-action at X warnings |
| Warnings | View and delete member warnings |
| Leveling | XP channel, level-up roles |
| Starboard | Channel and star threshold |
| Reaction Roles | Emoji → role mappings |
| Triggers | Keyword → bot reply mappings |
| Case Log | View and delete mod cases |
| Economy | Coin leaderboard (top 20) |
| Shop | Add, edit, remove shop items (role grants & profile badges) |
| Tickets | Ticket category and support role |
| Temp Voice Channels | Auto-VC channel and category |
| Giveaways | View and end active giveaways |

## Auth

Discord OAuth2 (`identify guilds` scopes). Only users with **Manage Server** permission on a guild can access that guild's dashboard. Sessions use `iron-session` (encrypted cookie). Stale/expired sessions are automatically redirected to re-authenticate.

## Environment variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (shared with bot) |
| `ClientID` | Discord application client ID |
| `CLIENT_SECRET` | Discord application client secret |
| `DASHBOARD_URL` | Public base URL, e.g. `http://localhost:3000` |
| `SESSION_SECRET` | ≥32-character secret for iron-session |
| `Token` | Bot token (used server-side to fetch guild roles/channels) |

## Development

```bash
npm install
npm run dev
```

## Production

Built and run via Docker — use `./restart.sh --dashboard` from the project root.
