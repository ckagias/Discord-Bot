import Link from "next/link";
import { connectDB } from "@/lib/db";
import Warn, { WarnDoc } from "@/lib/models/Warn";
import SettingsCard from "@/components/SettingsCard";
import WarnSearch from "./WarnSearch";
import DeleteWarnButton from "./DeleteWarnButton";

const STYLES = {
  heading: "mb-6 text-2xl font-semibold text-black dark:text-zinc-50",
  table: "w-full text-sm",
  thead: "border-b border-zinc-200 dark:border-zinc-800",
  th: "pb-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400",
  thRight:
    "pb-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400",
  thSortable:
    "cursor-pointer select-none pb-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50",
  tr: "border-b border-zinc-100 last:border-0 dark:border-zinc-800/60",
  td: "py-3 text-black dark:text-zinc-100",
  tdMuted: "py-3 text-zinc-500 dark:text-zinc-400",
  tdRight: "py-3 text-right text-black dark:text-zinc-100",
  code: "rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800",
  empty: "text-sm text-zinc-500 dark:text-zinc-400",
};

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function WarningsPage({
  params,
  searchParams,
}: {
  params: Promise<{ guildId: string }>;
  searchParams: Promise<{ userId?: string; order?: string }>;
}) {
  const { guildId } = await params;
  const { userId, order } = await searchParams;
  const sortAsc = order === "asc";
  await connectDB();

  const query: Record<string, unknown> = { guildId };
  if (userId?.trim()) query.userId = userId.trim();

  const warns = await Warn.find(query)
    .sort({ createdAt: sortAsc ? 1 : -1 })
    .limit(50)
    .lean<WarnDoc[]>();

  function toggleOrderHref() {
    const p = new URLSearchParams();
    if (userId?.trim()) p.set("userId", userId.trim());
    p.set("order", sortAsc ? "desc" : "asc");
    return `?${p.toString()}`;
  }

  return (
    <>
      <h1 className={STYLES.heading}>Warnings</h1>
      <SettingsCard
        title="Warnings"
        description="All warnings issued in this server. Filter by user ID to view a member's history."
      >
        <WarnSearch defaultValue={userId ?? ""} order={order ?? "desc"} />
        {warns.length === 0 ? (
          <p className={STYLES.empty}>
            {userId ? `No warnings found for user ID ${userId}.` : "No warnings issued yet."}
          </p>
        ) : (
          <table className={STYLES.table}>
            <thead className={STYLES.thead}>
              <tr>
                <th className={STYLES.th}>User</th>
                <th className={STYLES.th}>Moderator</th>
                <th className={STYLES.th}>Reason</th>
                <th className={STYLES.thSortable}>
                  <Link href={toggleOrderHref()}>
                    Date {sortAsc ? "↑" : "↓"}
                  </Link>
                </th>
                <th className={STYLES.th}></th>
              </tr>
            </thead>
            <tbody>
              {warns.map((w) => (
                <tr key={String(w._id)} className={STYLES.tr}>
                  <td className={STYLES.td}>
                    <code className={STYLES.code}>{w.userId}</code>
                  </td>
                  <td className={STYLES.tdMuted}>
                    <code className={STYLES.code}>{w.moderatorId}</code>
                  </td>
                  <td className={STYLES.td}>{w.reason}</td>
                  <td className={STYLES.tdRight}>{formatDate(w.createdAt)}</td>
                  <td className="py-3 pl-3 text-right">
                    <DeleteWarnButton guildId={guildId} warnId={String(w._id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SettingsCard>
    </>
  );
}
