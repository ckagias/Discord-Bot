"use server";

import { revalidatePath } from "next/cache";
import { requireGuildAccess } from "@/lib/authorize";
import { connectDB } from "@/lib/db";
import Guild from "@/lib/models/Guild";

function emptyToNull(value: FormDataEntryValue | null): string | null {
  const str = (value ?? "").toString().trim();
  return str === "" ? null : str;
}

export async function updateGuildSettings(guildId: string, formData: FormData) {
  await requireGuildAccess(guildId);
  await connectDB();

  const update = {
    levelingEnabled: formData.get("levelingEnabled") === "on",
    logChannelId: emptyToNull(formData.get("logChannelId")),
    welcomeChannelId: emptyToNull(formData.get("welcomeChannelId")),
    welcomeMessage: emptyToNull(formData.get("welcomeMessage")),
    farewellChannelId: emptyToNull(formData.get("farewellChannelId")),
    farewellMessage: emptyToNull(formData.get("farewellMessage")),
    muteRoleId: emptyToNull(formData.get("muteRoleId")),
    ticketCategoryId: emptyToNull(formData.get("ticketCategoryId")),
    ticketSupportRoleId: emptyToNull(formData.get("ticketSupportRoleId")),
  };

  await Guild.findOneAndUpdate({ guildId }, update, { upsert: true });

  revalidatePath(`/dashboard/${guildId}/settings`);
}