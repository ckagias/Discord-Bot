import { model, models, Schema } from "mongoose";

export interface LevelDoc {
  userId: string;
  guildId: string;
  xp: number;
  level: number;
  lastXpAt: Date | null;
}

const levelSchema = new Schema<LevelDoc>({
  userId:   { type: String, required: true },
  guildId:  { type: String, required: true },
  xp:       { type: Number, default: 0 },
  level:    { type: Number, default: 0 },
  lastXpAt: { type: Date, default: null },
});

levelSchema.index({ userId: 1, guildId: 1 }, { unique: true });
levelSchema.index({ guildId: 1, level: -1, xp: -1 });

export default models.Level || model<LevelDoc>("Level", levelSchema);
