import { connectDB } from "@/lib/db";
import { fetchGuildRoles } from "@/lib/discord";
import Guild, { GuildDoc } from "@/lib/models/Guild";
import LevelRolesForm from "./LevelRolesForm";

const STYLES = {
  heading: "mb-6 text-2xl font-semibold text-black dark:text-zinc-50",
};

export default async function LevelRolesPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  await connectDB();

  const [guildDoc, allRoles] = await Promise.all([
    Guild.findOne({ guildId }).lean<GuildDoc>(),
    fetchGuildRoles(guildId),
  ]);

  // Exclude @everyone and bot/integration-managed roles.
  const roles = allRoles.filter((r) => r.id !== guildId && !r.managed);

  const initial = guildDoc?.levelRoles ?? [];

  return (
    <>
      <h1 className={STYLES.heading}>Level Roles</h1>
      <LevelRolesForm guildId={guildId} initial={initial} roles={roles} />
    </>
  );
}
