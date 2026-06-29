"use client";

import type { CalendarEvent } from "@/lib/types";
import { formatTimeRange } from "@/lib/format";

export function ScheduleList({ events }: { events: CalendarEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="Nothing on the calendar"
        body="You have no events today. Enjoy the open day."
      />
    );
  }

  const now = Date.now();

  return (
    <ul className="space-y-3">
      {events.map((e) => {
        const isPast = e.end ? new Date(e.end).getTime() < now : false;
        const isNow =
          e.start && e.end
            ? new Date(e.start).getTime() <= now && new Date(e.end).getTime() >= now
            : false;

        return (
          <li
            key={e.id}
            className={`group relative rounded-xl border p-4 transition ${
              isNow
                ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500/60 dark:bg-emerald-500/10"
                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            } ${isPast ? "opacity-55" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium text-slate-900 dark:text-slate-100">
                    {e.htmlLink ? (
                      <a
                        href={e.htmlLink}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {e.title}
                      </a>
                    ) : (
                      e.title
                    )}
                  </h3>
                  {isNow && (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Now
                    </span>
                  )}
                  {e.responseStatus === "tentative" && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                      Maybe
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                  {formatTimeRange(e.start, e.end, e.allDay)}
                  {e.location && <span> · {e.location}</span>}
                  {e.attendeeCount > 0 && (
                    <span>
                      {" "}
                      · {e.attendeeCount} {e.attendeeCount === 1 ? "guest" : "guests"}
                    </span>
                  )}
                </p>
              </div>

              {e.meetingLink && (
                <a
                  href={e.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-500"
                >
                  Join
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
      <p className="font-medium text-slate-700 dark:text-slate-300">{title}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{body}</p>
    </div>
  );
}
