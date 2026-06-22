import { connectDB } from "@/lib/db";
import { fetchGuildRoles } from "@/lib/discord";
import Guild, { GuildDoc } from "@/lib/models/Guild";
import SettingsCard from "@/components/SettingsCard";
import SectionForm from "@/components/SectionForm";
import { RoleField } from "@/components/Field";
import { updateModerationSettings } from "./actions";

const STYLES = {
  heading: "mb-6 text-2xl font-semibold text-black dark:text-zinc-50",
};

export default async function ModerationSettingsPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  await connectDB();

  const [guildDoc, roles] = await Promise.all([
    Guild.findOne({ guildId }).lean<GuildDoc>(),
    fetchGuildRoles(guildId),
  ]);

  const guild: Pick<GuildDoc, "muteRoleId"> = guildDoc ?? { muteRoleId: null };

  return (
    <>
      <h1 className={STYLES.heading}>Moderation</h1>
      <SectionForm action={updateModerationSettings.bind(null, guildId)}>
        <SettingsCard
          title="Mute role"
          description="Role applied to members muted by moderation commands."
        >
          <RoleField
            label="Mute role"
            name="muteRoleId"
            defaultValue={guild.muteRoleId}
            roles={roles}
          />
        </SettingsCard>
      </SectionForm>
    </>
  );
}
