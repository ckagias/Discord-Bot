"use server";

import { revalidatePath } from "next/cache";
import { requireGuildAccess } from "@/lib/authorize";
import { connectDB } from "@/lib/db";
import { emptyToNull } from "@/lib/forms";
import Guild from "@/lib/models/Guild";

export async function updateStarboardSettings(guildId: string, formData: FormData) {
  await requireGuildAccess(guildId);
  await connectDB();

  const update = {
    starboardEnabled: formData.get("starboardEnabled") === "on",
    starboardChannelId: emptyToNull(formData.get("starboardChannelId")),
    starboardEmoji: emptyToNull(formData.get("starboardEmoji")) ?? "⭐",
    starboardThreshold: Number(formData.get("starboardThreshold")) || 3,
    starboardIgnoreNsfw: formData.get("starboardIgnoreNsfw") === "on",
  };

  await Guild.findOneAndUpdate(
    { guildId },
    { $set: update, $setOnInsert: { guildId } },
    { upsert: true }
  );

  revalidatePath(`/dashboard/${guildId}/starboard`);
}
