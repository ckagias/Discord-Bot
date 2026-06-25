"use server";

import { requireGuildAccess } from "@/lib/authorize";
import { connectDB } from "@/lib/db";
import Warn from "@/lib/models/Warn";
import { revalidatePath } from "next/cache";

export async function deleteWarn(guildId: string, warnId: string) {
  await requireGuildAccess(guildId);
  await connectDB();
  await Warn.findOneAndDelete({ _id: warnId, guildId });
  revalidatePath(`/dashboard/${guildId}/warnings`);
}
