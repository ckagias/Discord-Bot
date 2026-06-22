import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ForbiddenError, requireGuildAccess } from "@/lib/authorize";
import { fetchUserGuilds } from "@/lib/discord";
import { getSession } from "@/lib/session";
import GuildNav from "@/components/GuildNav";

const STYLES = {
  page: "flex flex-1 bg-zinc-50 font-sans dark:bg-black",
  sidebar:
    "flex w-64 shrink-0 flex-col gap-6 border-r border-zinc-200 px-4 py-6 dark:border-zinc-800",
  backLink:
    "flex items-center gap-1.5 px-3 text-xs font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50",
  backIcon: "h-3.5 w-3.5",
  guildHeader: "flex items-center gap-3 px-3",
  guildIcon: "h-9 w-9 shrink-0 rounded-full object-cover",
  guildIconFallback:
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#5865F2] text-sm font-semibold text-white",
  guildName: "truncate text-sm font-semibold text-black dark:text-zinc-50",
  spacer: "flex-1",
  logoutButton:
    "cursor-pointer px-3 text-left text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50",
  main: "flex-1 px-10 py-10",
  mainInner: "max-w-2xl",
};

function guildIconUrl(guildId: string, icon: string | null): string | null {
  if (!icon) return null;
  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.png`;
}

export default async function GuildLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ guildId: string }>;
}) {
  const { guildId } = await params;

  try {
    await requireGuildAccess(guildId);
  } catch (err) {
    if (err instanceof ForbiddenError) {
      notFound();
    }
    console.error(`[guild layout] access check failed for guild ${guildId}:`, err);
    throw err;
  }

  const session = await getSession();
  if (!session.accessToken) {
    redirect("/");
  }

  const userGuilds = await fetchUserGuilds(session.accessToken);
  const guild = userGuilds.find((g) => g.id === guildId);
  const iconUrl = guild ? guildIconUrl(guild.id, guild.icon) : null;
  const initial = guild?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className={STYLES.page}>
      <aside className={STYLES.sidebar}>
        <Link href="/dashboard" className={STYLES.backLink}>
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={STYLES.backIcon}
          >
            <path d="M12.5 15 7.5 10l5-5" />
          </svg>
          All servers
        </Link>
        <div className={STYLES.guildHeader}>
          {iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={iconUrl} alt="" className={STYLES.guildIcon} />
          ) : (
            <span className={STYLES.guildIconFallback}>{initial}</span>
          )}
          <span className={STYLES.guildName}>{guild?.name ?? "Server"}</span>
        </div>
        <GuildNav guildId={guildId} />
        <div className={STYLES.spacer} />
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className={STYLES.logoutButton}>
            Log out
          </button>
        </form>
      </aside>
      <main className={STYLES.main}>
        <div className={STYLES.mainInner}>{children}</div>
      </main>
    </div>
  );
}
