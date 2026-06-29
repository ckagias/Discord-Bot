"use client";

import { useEffect, useState, useTransition } from "react";
import SettingsCard from "@/components/SettingsCard";
import { updateShop } from "./actions";
import type { ShopDoc } from "@/lib/models/Shop";
import type { DiscordRole } from "@/lib/discord";

interface Row extends Omit<ShopDoc, "guildId"> {
  key: number;
}

const STYLES = {
  form: "flex flex-col gap-6 max-w-2xl",
  footer: "flex items-center gap-3",
  submitButton:
    "cursor-pointer self-start rounded-full bg-[#5865F2] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4752c4] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600",
  savedText: "text-sm text-green-600 dark:text-green-400",
  errorText: "text-sm text-red-600 dark:text-red-400",
  row: "flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800",
  rowHeader: "flex items-center justify-between gap-3",
  rowTitle: "text-sm font-semibold text-black dark:text-zinc-50",
  rowFields: "grid grid-cols-1 gap-3 sm:grid-cols-2",
  rowFieldFull: "flex flex-col gap-1.5 sm:col-span-2",
  rowField: "flex flex-col gap-1.5",
  label: "text-sm font-medium text-black dark:text-zinc-50",
  input:
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-[#5865F2] dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50",
  numberInput:
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-[#5865F2] dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
  select:
    "cursor-pointer w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none transition-colors focus:border-[#5865F2] dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50",
  checkboxRow: "flex items-center gap-2",
  checkbox: "h-4 w-4 cursor-pointer accent-[#5865F2]",
  checkboxLabel: "text-sm text-black dark:text-zinc-50",
  removeButton:
    "cursor-pointer shrink-0 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 transition-colors hover:border-red-300 hover:text-red-500 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-red-800 dark:hover:text-red-400",
  addButton:
    "cursor-pointer self-start rounded-lg border border-dashed border-zinc-300 px-4 py-2 text-sm text-zinc-500 transition-colors hover:border-[#5865F2] hover:text-[#5865F2] dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-[#5865F2] dark:hover:text-[#5865F2]",
  empty: "text-sm text-zinc-500 dark:text-zinc-400",
};

function blankRow(key: number, firstRoleId: string): Row {
  return {
    key,
    itemId: "",
    name: "",
    description: "",
    price: 100,
    type: "role",
    roleId: firstRoleId,
    emoji: "",
    enabled: true,
  };
}

export default function ShopForm({
  guildId,
  initial,
  roles,
}: {
  guildId: string;
  initial: Omit<ShopDoc, "guildId">[];
  roles: DiscordRole[];
}) {
  const [rows, setRows] = useState<Row[]>(() =>
    initial.map((item, i) => ({ ...item, key: i }))
  );
  const [nextKey, setNextKey] = useState(initial.length);
  const [dirty, setDirty] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function mark() {
    setDirty(true);
    setStatus("idle");
  }

  function addRow() {
    setRows((prev) => [...prev, blankRow(nextKey, roles[0]?.id ?? "")]);
    setNextKey((k) => k + 1);
    mark();
  }

  function removeRow(key: number) {
    setRows((prev) => prev.filter((r) => r.key !== key));
    mark();
  }

  function updateRow(key: number, patch: Partial<Omit<Row, "key">>) {
    setRows((prev) =>
      prev.map((r) => (r.key !== key ? r : { ...r, ...patch }))
    );
    mark();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    const payload = rows.map(({ key: _key, ...item }) => ({
      ...item,
      // Send empty itemId as undefined so actions.ts treats it as new
      itemId: item.itemId || undefined,
    }));
    const fd = new FormData();
    fd.set("shop", JSON.stringify(payload));

    startTransition(async () => {
      try {
        await updateShop(guildId, fd);
        setStatus("saved");
        setDirty(false);
      } catch (err) {
        console.error(err);
        setErrorMsg(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={STYLES.form}>
      <SettingsCard
        title="Shop Items"
        description="Add, edit, or remove items players can buy with coins. Role items grant a Discord role on purchase; badge items add an emoji to the buyer's /profile."
      >
        {rows.length === 0 ? (
          <p className={STYLES.empty}>No items in the shop yet. Add one below.</p>
        ) : (
          rows.map((row) => (
            <div key={row.key} className={STYLES.row}>
              <div className={STYLES.rowHeader}>
                <span className={STYLES.rowTitle}>
                  {row.name || <span className="italic text-zinc-400">Untitled item</span>}
                </span>
                <button
                  type="button"
                  onClick={() => removeRow(row.key)}
                  className={STYLES.removeButton}
                >
                  Remove
                </button>
              </div>

              <div className={STYLES.rowFields}>
                <div className={STYLES.rowFieldFull}>
                  <label className={STYLES.label}>Name</label>
                  <input
                    type="text"
                    value={row.name}
                    placeholder="e.g. VIP Role"
                    onChange={(e) => updateRow(row.key, { name: e.target.value })}
                    className={STYLES.input}
                  />
                </div>

                <div className={STYLES.rowField}>
                  <label className={STYLES.label}>Type</label>
                  <select
                    value={row.type}
                    onChange={(e) =>
                      updateRow(row.key, {
                        type: e.target.value as "role" | "badge",
                        roleId: e.target.value === "role" ? (roles[0]?.id ?? "") : row.roleId,
                        emoji: e.target.value === "badge" ? row.emoji : "",
                      })
                    }
                    className={STYLES.select}
                  >
                    <option value="role">Role — grants a Discord role</option>
                    <option value="badge">Badge — emoji on /profile</option>
                  </select>
                </div>

                <div className={STYLES.rowField}>
                  <label className={STYLES.label}>Price (coins)</label>
                  <input
                    type="number"
                    min={1}
                    value={row.price}
                    onChange={(e) =>
                      updateRow(row.key, { price: parseInt(e.target.value, 10) || 1 })
                    }
                    className={STYLES.numberInput}
                  />
                </div>

                {row.type === "role" ? (
                  <div className={STYLES.rowFieldFull}>
                    <label className={STYLES.label}>Role</label>
                    {roles.length === 0 ? (
                      <p className={STYLES.empty}>No assignable roles found in this server.</p>
                    ) : (
                      <select
                        value={row.roleId ?? ""}
                        onChange={(e) => updateRow(row.key, { roleId: e.target.value })}
                        className={STYLES.select}
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <div className={STYLES.rowFieldFull}>
                    <label className={STYLES.label}>Emoji</label>
                    <input
                      type="text"
                      value={row.emoji ?? ""}
                      placeholder="e.g. ⭐ or <:name:id>"
                      onChange={(e) => updateRow(row.key, { emoji: e.target.value })}
                      className={STYLES.input}
                    />
                  </div>
                )}

                <div className={STYLES.rowFieldFull}>
                  <label className={STYLES.label}>Description</label>
                  <input
                    type="text"
                    value={row.description}
                    placeholder="Short description shown in the shop (optional)"
                    onChange={(e) => updateRow(row.key, { description: e.target.value })}
                    className={STYLES.input}
                  />
                </div>

                <div className={STYLES.rowFieldFull}>
                  <label className={STYLES.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={row.enabled}
                      onChange={(e) => updateRow(row.key, { enabled: e.target.checked })}
                      className={STYLES.checkbox}
                    />
                    <span className={STYLES.checkboxLabel}>Visible in shop</span>
                  </label>
                </div>
              </div>
            </div>
          ))
        )}

        <button type="button" onClick={addRow} className={STYLES.addButton}>
          + Add item
        </button>
      </SettingsCard>

      <div className={STYLES.footer}>
        <button
          type="submit"
          disabled={isPending || !dirty}
          className={STYLES.submitButton}
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
        {status === "saved" && <span className={STYLES.savedText}>Saved</span>}
        {status === "error" && (
          <span className={STYLES.errorText}>
            {errorMsg || "Failed to save — try again"}
          </span>
        )}
      </div>
    </form>
  );
}
