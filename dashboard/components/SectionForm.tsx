"use client";

import { useEffect, useState, useTransition } from "react";

const STYLES = {
  form: "flex flex-col gap-6 max-w-xl",
  footer: "flex items-center gap-3",
  submitButton:
    "cursor-pointer self-start rounded-full bg-[#5865F2] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4752c4] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600",
  savedText: "text-sm text-green-600 dark:text-green-400",
  errorText: "text-sm text-red-600 dark:text-red-400",
};

interface Props {
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
}

export default function SectionForm({ action, children }: Props) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function handleSubmit(formData: FormData) {
    setStatus("idle");
    startTransition(async () => {
      try {
        await action(formData);
        setStatus("saved");
        setDirty(false);
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      onChange={() => {
        setDirty(true);
        setStatus("idle");
      }}
      className={STYLES.form}
    >
      {children}
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
          <span className={STYLES.errorText}>Failed to save — try again</span>
        )}
      </div>
    </form>
  );
}
