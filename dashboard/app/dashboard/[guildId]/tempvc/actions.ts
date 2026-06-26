"use server";

import { revalidatePath } from "next/cache";
import { requireGuildAccess } from "@/lib/authorize";
import { connectDB } from "@/lib/db";
import { emptyToNull } from "@/lib/forms";
import Guild from "@/lib/models/Guild";

export async function updateTempVcSettings(guildId: string, formData: FormData) {
  await requireGuildAccess(guildId);
  await connectDB();

  await Guild.findOneAndUpdate(
    { guildId },
    { tempVcCategoryId: emptyToNull(formData.get("tempVcCategoryId")) },
    { upsert: true },
  );

  revalidatePath(`/dashboard/${guildId}/tempvc`);
}
