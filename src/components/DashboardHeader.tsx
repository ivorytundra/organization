"use client";

import { useEffect, useState } from "react";
import type { CalendarEvent } from "@/lib/types";
import { greeting, todayLabel, formatTime, formatRelative } from "@/lib/format";

/**
 * Top-of-page greeting + at-a-glance stats + the next upcoming event. Rendered
 * on the client so the date, greeting, and "up next" countdown reflect the
 * viewer's local time, and the countdown stays fresh.
 */
export function DashboardHeader({
  name,
  events,
  emailCount,
}: {
  name?: string;
  events: CalendarEvent[];
  emailCount: number;
}) {
  // Re-render once a minute so the countdown and "now" highlighting stay current.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const now = Date.now();
  const next = events.find((e) => e.start && new Date(e.start).getTime() > now);
  const remaining = events.filter(
    (e) => e.end && new Date(e.end).getTime() > now,
  ).length;

  return (
    <header className="space-y-4">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {todayLabel()}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {greeting()}
          {name ? `, ${name.split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          {summary(remaining, emailCount)}
        </p>
      </div>

      {next && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/40 dark:bg-blue-500/10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
            <ClockIcon />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-300">
              Up next · {next.start ? formatRelative(next.start) : ""}
            </p>
            <p className="truncate font-medium text-slate-900 dark:text-slate-100">
              {next.title}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {next.start ? formatTime(next.start) : ""}
              {next.location ? ` · ${next.location}` : ""}
            </p>
          </div>
          {next.meetingLink && (
            <a
              href={next.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="ml-auto shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500"
            >
              Join
            </a>
          )}
        </div>
      )}
    </header>
  );
}

function summary(events: number, emails: number): string {
  const e = events === 0 ? "nothing left on your calendar" : `${events} event${events === 1 ? "" : "s"} left`;
  const m = emails === 0 ? "no important mail" : `${emails} important email${emails === 1 ? "" : "s"}`;
  return `You have ${e} and ${m} today.`;
}

function ClockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
