import { model, models, Schema } from "mongoose";

// Field-for-field identical to the bot's models/ShopSchema.js — keep in sync.
export interface ShopDoc {
  guildId: string;
  itemId: string;
  name: string;
  description: string;
  price: number;
  type: "role" | "badge";
  roleId: string | null;
  emoji: string | null;
  enabled: boolean;
}

const shopSchema = new Schema<ShopDoc>({
  guildId:     { type: String, required: true },
  itemId:      { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  description: { type: String, default: "" },
  price:       { type: Number, required: true },
  type:        { type: String, enum: ["role", "badge"], required: true },
  roleId:      { type: String, default: null },
  emoji:       { type: String, default: null },
  enabled:     { type: Boolean, default: true },
});

shopSchema.index({ guildId: 1 });

export default models.Shop || model<ShopDoc>("Shop", shopSchema);
