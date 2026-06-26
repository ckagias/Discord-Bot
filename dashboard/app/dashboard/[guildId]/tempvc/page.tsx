import { connectDB } from "@/lib/db";
import { fetchGuildChannels } from "@/lib/discord";
import Guild, { GuildDoc } from "@/lib/models/Guild";
import SettingsCard from "@/components/SettingsCard";
import SectionForm from "@/components/SectionForm";
import { ChannelField } from "@/components/Field";
import { updateTempVcSettings } from "./actions";

const STYLES = {
  heading: "mb-6 text-2xl font-semibold text-black dark:text-zinc-50",
  stack: "flex flex-col gap-8",
};

export default async function TempVcPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  await connectDB();

  const [guildDoc, allChannels] = await Promise.all([
    Guild.findOne({ guildId }).lean<GuildDoc>(),
    fetchGuildChannels(guildId),
  ]);

  const guild: Pick<GuildDoc, "tempVcCategoryId"> = guildDoc ?? {
    tempVcCategoryId: null,
  };

  // Discord channel type 4 = GuildCategory
  const categories = allChannels.filter((c) => c.type === 4);

  return (
    <>
      <h1 className={STYLES.heading}>Temp Voice Channels</h1>
      <div className={STYLES.stack}>
        <SectionForm action={updateTempVcSettings.bind(null, guildId)}>
          <SettingsCard
            title="Channel category"
            description="The category where temporary voice channels are created. If unset, channels are placed in the same category as the caller's current voice channel."
          >
            <ChannelField
              label="Temp VC category"
              name="tempVcCategoryId"
              defaultValue={guild.tempVcCategoryId}
              channels={categories}
            />
          </SettingsCard>
        </SectionForm>
      </div>
    </>
  );
}
