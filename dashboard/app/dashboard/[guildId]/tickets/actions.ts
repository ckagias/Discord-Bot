"use server";

import { revalidatePath } from "next/cache";
import { requireGuildAccess } from "@/lib/authorize";
import { connectDB } from "@/lib/db";
import { emptyToNull } from "@/lib/forms";
import Guild from "@/lib/models/Guild";

export async function updateTicketSettings(guildId: string, formData: FormData) {
  await requireGuildAccess(guildId);
  await connectDB();

  const update = {
    ticketCategoryId: emptyToNull(formData.get("ticketCategoryId")),
    ticketSupportRoleId: emptyToNull(formData.get("ticketSupportRoleId")),
  };

  await Guild.findOneAndUpdate({ guildId }, update, { upsert: true });

  revalidatePath(`/dashboard/${guildId}/tickets`);
}
