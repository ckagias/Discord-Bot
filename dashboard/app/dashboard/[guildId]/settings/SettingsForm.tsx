"use client";

import { useState, useTransition } from "react";
import type { DiscordChannel, DiscordRole } from "@/lib/discord";
import type { GuildDoc } from "@/lib/models/Guild";
import { updateGuildSettings } from "./actions";

const STYLES = {
  form: "flex flex-col gap-6 max-w-xl",
  field: "flex flex-col gap-1.5",
  label: "text-sm font-medium text-black dark:text-zinc-50",
  select:
    "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50",
  input:
    "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50",
  checkboxRow: "flex items-center gap-2",
  checkbox: "h-4 w-4",
  footer: "flex items-center gap-3",
  submitButton:
    "self-start rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-300",
  savedText: "text-sm text-green-600 dark:text-green-400",
  errorText: "text-sm text-red-600 dark:text-red-400",
};

const TEXT_CHANNEL_TYPE = 0;

interface Props {
  guildId: string;
  guild: GuildDoc;
  channels: DiscordChannel[];
  roles: DiscordRole[];
}

export default function SettingsForm({ guildId, guild, channels, roles }: Props) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const textChannels = channels.filter((c) => c.type === TEXT_CHANNEL_TYPE);

  function handleSubmit(formData: FormData) {
    setStatus("idle");
    startTransition(async () => {
      try {
        await updateGuildSettings(guildId, formData);
        setStatus("saved");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    });
  }

  return (
    <form action={handleSubmit} className={STYLES.form}>
      <div className={STYLES.checkboxRow}>
        <input
          type="checkbox"
          id="levelingEnabled"
          name="levelingEnabled"
          defaultChecked={guild.levelingEnabled}
          className={STYLES.checkbox}
        />
        <label htmlFor="levelingEnabled" className={STYLES.label}>
          Enable leveling
        </label>
      </div>

      <ChannelField
        label="Log channel"
        name="logChannelId"
        defaultValue={guild.logChannelId}
        channels={textChannels}
      />
      <ChannelField
        label="Welcome channel"
        name="welcomeChannelId"
        defaultValue={guild.welcomeChannelId}
        channels={textChannels}
      />
      <TextField
        label="Welcome message"
        name="welcomeMessage"
        defaultValue={guild.welcomeMessage}
      />
      <ChannelField
        label="Farewell channel"
        name="farewellChannelId"
        defaultValue={guild.farewellChannelId}
        channels={textChannels}
      />
      <TextField
        label="Farewell message"
        name="farewellMessage"
        defaultValue={guild.farewellMessage}
      />
      <RoleField
        label="Mute role"
        name="muteRoleId"
        defaultValue={guild.muteRoleId}
        roles={roles}
      />
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

      <div className={STYLES.footer}>
        <button type="submit" disabled={isPending} className={STYLES.submitButton}>
          {isPending ? "Saving..." : "Save changes"}
        </button>
        {status === "saved" && <span className={STYLES.savedText}>Saved</span>}
        {status === "error" && (
          <span className={STYLES.errorText}>Failed to save — try again</span>
        )}
      </div>
    </form>
  );
}

function ChannelField({
  label,
  name,
  defaultValue,
  channels,
}: {
  label: string;
  name: string;
  defaultValue: string | null;
  channels: DiscordChannel[];
}) {
  return (
    <div className={STYLES.field}>
      <label className={STYLES.label}>{label}</label>
      <select name={name} defaultValue={defaultValue ?? ""} className={STYLES.select}>
        <option value="">None</option>
        {channels.map((c) => (
          <option key={c.id} value={c.id}>
            #{c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function RoleField({
  label,
  name,
  defaultValue,
  roles,
}: {
  label: string;
  name: string;
  defaultValue: string | null;
  roles: DiscordRole[];
}) {
  return (
    <div className={STYLES.field}>
      <label className={STYLES.label}>{label}</label>
      <select name={name} defaultValue={defaultValue ?? ""} className={STYLES.select}>
        <option value="">None</option>
        {roles.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string | null;
}) {
  return (
    <div className={STYLES.field}>
      <label className={STYLES.label}>{label}</label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue ?? ""}
        className={STYLES.input}
      />
    </div>
  );
}