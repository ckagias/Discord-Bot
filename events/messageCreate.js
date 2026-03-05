// 'LevelSchema' is the Mongoose model that stores each user's XP and level per server
const LevelSchema = require('../models/LevelSchema');
// 'GuildSchema' is the Mongoose model that stores per-server settings, like whether leveling is enabled
const GuildSchema = require('../models/GuildSchema');

// In-memory cooldown store: Map<guildId, Set<userId>>
// When a user earns XP they're added to the set.
// After 1 minute they're removed, allowing them to earn XP again.
// This resets if the bot restarts, which is intentional — it's lightweight on purpose.
const cooldowns = new Map();

// This event fires every time a message is sent in any server the bot is in
module.exports = {
    // The name must match the Discord.js event name exactly so the event handler can register it
    name: 'messageCreate',

    async execute(message) {
        // --- Guard clauses: ignore bots and DMs ---
        // Bots are ignored to prevent infinite loops or XP farming via automated messages
        if (message.author.bot) return;
        // DMs don't have a guild, so leveling doesn't apply there
        if (!message.guild) return;

        // Destructure the properties we'll use most often to keep the code clean
        const { author, guild, channel } = message;

        // --- 1. Check if leveling is enabled for this server ---
        // findOneAndUpdate with upsert:true creates the document if it doesn't exist yet,
        // saving us a separate "create on first use" step.
        const guildData = await GuildSchema.findOneAndUpdate(
            { guildId: guild.id },
            { $setOnInsert: { guildId: guild.id } }, // only set guildId when inserting
            { upsert: true, returnDocument: true }
        );

        // If the server admin hasn't turned on leveling, stop here — no XP is awarded
        if (!guildData.levelingEnabled) return;

        // --- 2. Cooldown check ---
        // Each server gets its own Set of user IDs that are currently on cooldown
        // If this server doesn't have a Set yet, create one now
        if (!cooldowns.has(guild.id)) cooldowns.set(guild.id, new Set());
        const guildCooldowns = cooldowns.get(guild.id);

        // If the user is already in the cooldown Set, they sent a message too recently — skip them
        if (guildCooldowns.has(author.id)) return;

        // Add the user to the cooldown Set so they can't earn XP again for 60 seconds
        guildCooldowns.add(author.id);
        // After 60 seconds, remove them from the Set so they can earn XP again
        setTimeout(() => guildCooldowns.delete(author.id), 60_000);

        // --- 3. Award random XP (15–25) ---
        // Math.random() * 11 gives a float from 0 to 10.999..., Math.floor brings it to 0–10, +15 shifts the range to 15–25
        const xpGained = Math.floor(Math.random() * 11) + 15;

        // Look up the user's existing level data for this server, or create a fresh record if none exists
        // 'new: true' makes Mongoose return the updated document instead of the old one
        let userData = await LevelSchema.findOneAndUpdate(
            { userId: author.id, guildId: guild.id },
            { $setOnInsert: { userId: author.id, guildId: guild.id } },
            { upsert: true, returnDocument: true }
        );

        // Add the XP they just earned to their running total
        userData.xp += xpGained;

        // --- 4. Level-up check ---
        // Formula: a user needs 100 * (currentLevel + 1)^2 XP to reach the next level.
        // Level 0 → 1 requires 100 XP, Level 1 → 2 requires 400 XP, etc.
        // This makes higher levels progressively harder to reach.
        const xpNeeded = 100 * Math.pow(userData.level + 1, 2);

        // Check if the user has accumulated enough XP to level up
        if (userData.xp >= xpNeeded) {
            // Subtract the threshold instead of resetting to 0 so leftover XP carries forward
            userData.xp -= xpNeeded;
            // Increment their level by 1
            userData.level += 1;

            // Notify the user in the same channel where they leveled up
            await channel.send(
                `🎉 Congratulations ${author}! You leveled up to **Level ${userData.level}**!`
            );
        }

        // --- 5. Save updated data ---
        // Persist the updated XP and level back to the database
        await userData.save();
    },
};