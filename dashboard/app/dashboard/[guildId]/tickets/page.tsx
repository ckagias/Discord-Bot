import { connectDB } from "@/lib/db";
import { fetchGuildChannels, fetchGuildRoles } from "@/lib/discord";
import Guild, { GuildDoc } from "@/lib/models/Guild";
import SettingsCard from "@/components/SettingsCard";
import SectionForm from "@/components/SectionForm";
import { ChannelField, RoleField } from "@/components/Field";
import { updateTicketSettings } from "./actions";

const STYLES = {
  heading: "mb-6 text-2xl font-semibold text-black dark:text-zinc-50",
};

export default async function TicketSettingsPage({
  params,
}: {
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;
  await connectDB();

  const [guildDoc, channels, roles] = await Promise.all([
    Guild.findOne({ guildId }).lean<GuildDoc>(),
    fetchGuildChannels(guildId),
    fetchGuildRoles(guildId),
  ]);

  const guild: Pick<GuildDoc, "ticketCategoryId" | "ticketSupportRoleId"> = guildDoc ?? {
    ticketCategoryId: null,
    ticketSupportRoleId: null,
  };

  return (
    <>
      <h1 className={STYLES.heading}>Tickets</h1>
      <SectionForm action={updateTicketSettings.bind(null, guildId)}>
        <SettingsCard
          title="Ticket setup"
          description="Where new ticket channels are created and who can see them."
        >
          <ChannelField
            label="Ticket category"
            name="ticketCategoryId"
            defaultValue={guild.ticketCategoryId}
            channels={channels}
          />
          <RoleField
            label="Ticket support role"
            name="ticketSupportRoleId"
            defaultValue={guild.ticketSupportRoleId}
            roles={roles}
          />
        </SettingsCard>
      </SectionForm>
    </>
  );
}
