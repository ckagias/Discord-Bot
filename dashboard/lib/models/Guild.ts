import { model, models, Schema } from "mongoose";

// Field-for-field identical to the bot's models/GuildSchema.js — keep in sync.
export interface GuildDoc {
  guildId: string;
  levelingEnabled: boolean;
  logChannelId: string | null;
  welcomeChannelId: string | null;
  welcomeMessage: string | null;
  farewellChannelId: string | null;
  farewellMessage: string | null;
  muteRoleId: string | null;
  ticketCategoryId: string | null;
  ticketSupportRoleId: string | null;
  ticketCount: number;
}

const guildSchema = new Schema<GuildDoc>({
  guildId: { type: String, required: true, unique: true },
  levelingEnabled: { type: Boolean, default: false },
  logChannelId: { type: String, default: null },
  welcomeChannelId: { type: String, default: null },
  welcomeMessage: { type: String, default: null },
  farewellChannelId: { type: String, default: null },
  farewellMessage: { type: String, default: null },
  muteRoleId: { type: String, default: null },
  ticketCategoryId: { type: String, default: null },
  ticketSupportRoleId: { type: String, default: null },
  ticketCount: { type: Number, default: 0 },
});

export default models.Guild || model<GuildDoc>("Guild", guildSchema);