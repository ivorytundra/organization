// Serializable shapes passed from server data-fetching to client components.
// All timestamps are ISO 8601 strings so they can cross the server/client
// boundary and be formatted in the viewer's local timezone.

export interface CalendarEvent {
  id: string;
  title: string;
  /** ISO start time. Null for all-day events (see `allDay`). */
  start: string | null;
  /** ISO end time. Null for all-day events. */
  end: string | null;
  allDay: boolean;
  location?: string;
  description?: string;
  /** Google Meet / Hangout / conferencing link if present. */
  meetingLink?: string;
  /** Web link to the event in Google Calendar. */
  htmlLink?: string;
  attendeeCount: number;
  /** The signed-in user's response: accepted / tentative / declined / needsAction. */
  responseStatus?: string;
  /** Calendar this event belongs to (e.g. "Work", "Personal"). */
  calendar?: string;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  snippet: string;
  /** ISO timestamp the message was received. */
  date: string;
  unread: boolean;
  important: boolean;
  starred: boolean;
  /** Web link to the message in Gmail. */
  link: string;
}

export interface Digest {
  events: CalendarEvent[];
  emails: EmailMessage[];
  /** True when the data is sample/demo data rather than the user's real account. */
  demo: boolean;
  /** Populated when something went wrong fetching real data. */
  error?: string;
}
