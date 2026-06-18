import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchBotGuildIds, fetchUserGuilds, hasManageGuild } from "@/lib/discord";
import { getSession } from "@/lib/session";

const STYLES = {
  page: "flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black",
  header: "flex items-center justify-between px-8 py-6 border-b border-zinc-200 dark:border-zinc-800",
  title: "text-xl font-semibold text-black dark:text-zinc-50",
  logoutButton:
    "text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50",
  main: "flex-1 px-8 py-10 max-w-3xl w-full mx-auto",
  sectionTitle: "text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4",
  grid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  guildCard:
    "flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700",
  guildName: "text-sm font-medium text-black dark:text-zinc-50",
  empty: "text-sm text-zinc-500 dark:text-zinc-400",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session.userId || !session.accessToken) {
    redirect("/");
  }

  const [userGuilds, botGuildIds] = await Promise.all([
    fetchUserGuilds(session.accessToken),
    fetchBotGuildIds(),
  ]);

  const manageable = userGuilds.filter(
    (g) => hasManageGuild(g) && botGuildIds.has(g.id)
  );

  return (
    <div className={STYLES.page}>
      <header className={STYLES.header}>
        <h1 className={STYLES.title}>Your Servers</h1>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className={STYLES.logoutButton}>
            Log out
          </button>
        </form>
      </header>
      <main className={STYLES.main}>
        <p className={STYLES.sectionTitle}>
          Servers where you can manage the bot
        </p>
        {manageable.length === 0 ? (
          <p className={STYLES.empty}>
            No manageable servers found. Make sure the bot is in a server you
            have the Manage Server permission on.
          </p>
        ) : (
          <div className={STYLES.grid}>
            {manageable.map((g) => (
              <Link
                key={g.id}
                href={`/dashboard/${g.id}/settings`}
                className={STYLES.guildCard}
              >
                <span className={STYLES.guildName}>{g.name}</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}