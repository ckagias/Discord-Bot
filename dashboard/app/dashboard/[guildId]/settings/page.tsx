import { notFound } from "next/navigation";
import { ForbiddenError, requireGuildAccess } from "@/lib/authorize";
import { connectDB } from "@/lib/db";
import { fetchGuildChannels, fetchGuildRoles } from "@/lib/discord";
import Guild, { GuildDoc } from "@/lib/models/Guild";
import SettingsForm from "./SettingsForm";

const STYLES = {
  page: "flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black",
  header: "flex items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800",
  title: "text-xl font-semibold text-black dark:text-zinc-50",
  main: "flex-1 px-8 py-10 max-w-3xl w-full mx-auto",
};

export default async function GuildSettingsPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;

  try {
    await requireGuildAccess(guildId);
  } catch (err) {
    if (err instanceof ForbiddenError) {
      notFound();
    }
    console.error(`[settings page] access check failed for guild ${guildId}:`, err);
    throw err;
  }

  await connectDB();

  const [guildDoc, channels, roles] = await Promise.all([
    Guild.findOne({ guildId }).lean<GuildDoc>(),
    fetchGuildChannels(guildId),
    fetchGuildRoles(guildId),
  ]);

  const guild: GuildDoc = guildDoc ?? {
    guildId,
    levelingEnabled: false,
    logChannelId: null,
    welcomeChannelId: null,
    welcomeMessage: null,
    farewellChannelId: null,
    farewellMessage: null,
    muteRoleId: null,
    ticketCategoryId: null,
    ticketSupportRoleId: null,
    ticketCount: 0,
  };

  return (
    <div className={STYLES.page}>
      <header className={STYLES.header}>
        <h1 className={STYLES.title}>Server Settings</h1>
      </header>
      <main className={STYLES.main}>
        <SettingsForm guildId={guildId} guild={guild} channels={channels} roles={roles} />
      </main>
    </div>
  );
}