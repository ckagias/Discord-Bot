import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

const STYLES = {
  page: "flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black",
  card: "flex flex-col items-center gap-6 text-center px-8 py-16 max-w-md",
  title: "text-3xl font-semibold tracking-tight text-black dark:text-zinc-50",
  subtitle: "text-base text-zinc-600 dark:text-zinc-400",
  loginButton:
    "flex h-12 items-center justify-center gap-2 rounded-full bg-[#5865F2] px-6 text-base font-medium text-white transition-colors hover:bg-[#4752c4]",
};

export default async function Home() {
  const session = await getSession();
  if (session.userId) {
    redirect("/dashboard");
  }

  return (
    <div className={STYLES.page}>
      <div className={STYLES.card}>
        <h1 className={STYLES.title}>Bot Dashboard</h1>
        <p className={STYLES.subtitle}>
          Manage your self-hosted Discord bot&apos;s settings from the browser.
        </p>
        <a href="/api/auth/login" className={STYLES.loginButton}>
          Login with Discord
        </a>
      </div>
    </div>
  );
}