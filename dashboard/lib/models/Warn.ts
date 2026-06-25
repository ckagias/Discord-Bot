import { model, models, Schema, Types } from "mongoose";

export interface WarnDoc {
  _id: Types.ObjectId;
  guildId: string;
  userId: string;
  moderatorId: string;
  reason: string;
  createdAt: Date;
}

const warnSchema = new Schema<WarnDoc>({
  guildId:     { type: String, required: true },
  userId:      { type: String, required: true },
  moderatorId: { type: String, required: true },
  reason:      { type: String, required: true },
  createdAt:   { type: Date, default: Date.now },
});

warnSchema.index({ guildId: 1, userId: 1 });

export default models.Warn || model<WarnDoc>("Warn", warnSchema);
