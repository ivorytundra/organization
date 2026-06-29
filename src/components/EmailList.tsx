"use client";

import type { EmailMessage } from "@/lib/types";
import { formatRelative } from "@/lib/format";

export function EmailList({ emails }: { emails: EmailMessage[] }) {
  if (emails.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
        <p className="font-medium text-slate-700 dark:text-slate-300">Inbox zero 🎉</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          No important or unread mail right now.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {emails.map((m) => (
        <li key={m.id}>
          <a
            href={m.link}
            target="_blank"
            rel="noreferrer"
            className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span
                className={`truncate text-sm ${
                  m.unread
                    ? "font-semibold text-slate-900 dark:text-slate-100"
                    : "font-medium text-slate-600 dark:text-slate-300"
                }`}
              >
                {m.fromName}
              </span>
              <span className="shrink-0 text-xs text-slate-400">
                {formatRelative(m.date)}
              </span>
            </div>

            <p
              className={`mt-0.5 truncate text-sm ${
                m.unread
                  ? "text-slate-800 dark:text-slate-200"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {m.subject}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-slate-400 dark:text-slate-500">
              {m.snippet}
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {m.important && <Tag color="rose">Important</Tag>}
              {m.starred && <Tag color="amber">Starred</Tag>}
              {m.unread && <Tag color="blue">Unread</Tag>}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

function Tag({
  children,
  color,
}: {
  children: React.ReactNode;
  color: "rose" | "amber" | "blue";
}) {
  const styles: Record<string, string> = {
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[color]}`}
    >
      {children}
    </span>
  );
}
