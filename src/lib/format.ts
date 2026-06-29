// Small client-safe formatting helpers. These run in the browser so all times
// render in the viewer's local timezone.

export function formatTime(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatTimeRange(
  start: string | null,
  end: string | null,
  allDay: boolean,
): string {
  if (allDay) return "All day";
  if (!start) return "";
  const s = formatTime(start);
  return end ? `${s} – ${formatTime(end)}` : s;
}

export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMin = Math.round((then - Date.now()) / 60_000);
  const abs = Math.abs(diffMin);
  const fmt = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (abs < 60) return fmt.format(Math.round(diffMin), "minute");
  if (abs < 60 * 24) return fmt.format(Math.round(diffMin / 60), "hour");
  return fmt.format(Math.round(diffMin / (60 * 24)), "day");
}

export function todayLabel(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
