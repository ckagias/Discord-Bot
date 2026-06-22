import { connectDB } from "@/lib/db";
import { fetchGuildChannels } from "@/lib/discord";
import Guild, { GuildDoc } from "@/lib/models/Guild";
import SettingsCard from "@/components/SettingsCard";
import SectionForm from "@/components/SectionForm";
import { ChannelField, ToggleField } from "@/components/Field";
import { updateGeneralSettings } from "./actions";

const STYLES = {
  heading: "mb-6 text-2xl font-semibold text-black dark:text-zinc-50",
};

const TEXT_CHANNEL_TYPE = 0;

export default async function GeneralSettingsPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  await connectDB();

  const [guildDoc, channels] = await Promise.all([
    Guild.findOne({ guildId }).lean<GuildDoc>(),
    fetchGuildChannels(guildId),
  ]);

  const guild: Pick<GuildDoc, "levelingEnabled" | "logChannelId"> = guildDoc ?? {
    levelingEnabled: false,
    logChannelId: null,
  };
  const textChannels = channels.filter((c) => c.type === TEXT_CHANNEL_TYPE);

  return (
    <>
      <h1 className={STYLES.heading}>General</h1>
      <SectionForm action={updateGeneralSettings.bind(null, guildId)}>
        <SettingsCard title="Leveling" description="Award XP and levels for chat activity.">
          <ToggleField
            label="Enable leveling"
            name="levelingEnabled"
            defaultChecked={guild.levelingEnabled}
          />
        </SettingsCard>
        <SettingsCard title="Logging" description="Where moderation and member events are posted.">
          <ChannelField
            label="Log channel"
            name="logChannelId"
            defaultValue={guild.logChannelId}
            channels={textChannels}
          />
        </SettingsCard>
      </SectionForm>
    </>
  );
}
