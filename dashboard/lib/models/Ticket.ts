import { model, models, Schema } from "mongoose";

export interface TicketDoc {
  guildId: string;
  channelId: string;
  userId: string;
  ticketNumber: number;
  status: "open" | "closed";
  createdAt: Date;
}

const ticketSchema = new Schema<TicketDoc>({
  guildId:      { type: String, required: true },
  channelId:    { type: String, required: true, unique: true },
  userId:       { type: String, required: true },
  ticketNumber: { type: Number, required: true },
  status:       { type: String, enum: ["open", "closed"], default: "open" },
  createdAt:    { type: Date, default: Date.now },
});

ticketSchema.index({ guildId: 1, ticketNumber: 1 });

export default models.Ticket || model<TicketDoc>("Ticket", ticketSchema);
