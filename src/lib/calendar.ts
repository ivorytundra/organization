import { getGoogleClients } from "./google";
import type { CalendarEvent } from "./types";

/**
 * Fetch every event on the user's primary calendar for "today" in their local
 * timezone, expanding recurring events into single instances and sorting by
 * start time.
 */
export async function fetchTodaysEvents(
  accessToken: string,
): Promise<CalendarEvent[]> {
  const { calendar } = getGoogleClients(accessToken);

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 50,
  });

  const items = res.data.items ?? [];

  return items
    .filter((e) => e.status !== "cancelled")
    .map((e): CalendarEvent => {
      const allDay = Boolean(e.start?.date && !e.start?.dateTime);
      const self = (e.attendees ?? []).find((a) => a.self);
      return {
        id: e.id ?? cryptoId(),
        title: e.summary?.trim() || "(no title)",
        start: e.start?.dateTime ?? e.start?.date ?? null,
        end: e.end?.dateTime ?? e.end?.date ?? null,
        allDay,
        location: e.location ?? undefined,
        description: e.description ?? undefined,
        meetingLink: e.hangoutLink ?? extractConferenceLink(e) ?? undefined,
        htmlLink: e.htmlLink ?? undefined,
        attendeeCount: e.attendees?.length ?? 0,
        responseStatus: self?.responseStatus ?? undefined,
      };
    });
}

function extractConferenceLink(e: {
  conferenceData?: { entryPoints?: Array<{ uri?: string | null }> | null } | null;
}): string | undefined {
  const entry = e.conferenceData?.entryPoints?.find((p) => p.uri);
  return entry?.uri ?? undefined;
}

// Fallback id for the rare event without one; keeps React keys stable enough.
function cryptoId(): string {
  return `evt-${Math.random().toString(36).slice(2, 10)}`;
}
