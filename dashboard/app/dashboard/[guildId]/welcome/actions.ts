"use server";

import { revalidatePath } from "next/cache";
import { requireGuildAccess } from "@/lib/authorize";
import { connectDB } from "@/lib/db";
import { emptyToNull } from "@/lib/forms";
import Guild from "@/lib/models/Guild";

export async function updateWelcomeSettings(guildId: string, formData: FormData) {
  await requireGuildAccess(guildId);
  await connectDB();

  const update = {
    welcomeChannelId: emptyToNull(formData.get("welcomeChannelId")),
    welcomeMessage: emptyToNull(formData.get("welcomeMessage")),
    farewellChannelId: emptyToNull(formData.get("farewellChannelId")),
    farewellMessage: emptyToNull(formData.get("farewellMessage")),
  };

  await Guild.findOneAndUpdate({ guildId }, update, { upsert: true });

  revalidatePath(`/dashboard/${guildId}/welcome`);
}
