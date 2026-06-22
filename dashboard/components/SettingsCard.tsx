const STYLES = {
  card: "rounded-2xl border border-zinc-200 bg-white px-6 py-6 dark:border-zinc-800 dark:bg-zinc-900",
  title: "text-base font-semibold text-black dark:text-zinc-50",
  description: "mt-1 text-sm text-zinc-500 dark:text-zinc-400",
  body: "mt-6 flex flex-col gap-6",
};

interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SettingsCard({ title, description, children }: Props) {
  return (
    <div className={STYLES.card}>
      <h2 className={STYLES.title}>{title}</h2>
      {description && <p className={STYLES.description}>{description}</p>}
      <div className={STYLES.body}>{children}</div>
    </div>
  );
}
