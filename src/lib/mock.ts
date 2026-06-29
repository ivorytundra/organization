import type { CalendarEvent, EmailMessage } from "./types";

// Sample data used for the demo preview when the user has not signed in (or
// when running without Google credentials configured). Times are generated
// relative to "now" so the dashboard always looks like a real day.

function at(hour: number, minute = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function minutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

export const mockEvents: CalendarEvent[] = [
  {
    id: "m1",
    title: "Standup",
    start: at(9, 30),
    end: at(9, 45),
    allDay: false,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    attendeeCount: 6,
    responseStatus: "accepted",
  },
  {
    id: "m2",
    title: "1:1 with Jordan",
    start: at(11, 0),
    end: at(11, 30),
    allDay: false,
    location: "Room 4B",
    attendeeCount: 2,
    responseStatus: "accepted",
  },
  {
    id: "m3",
    title: "Design review — onboarding flow",
    start: at(14, 0),
    end: at(15, 0),
    allDay: false,
    meetingLink: "https://meet.google.com/xyz-1234-abc",
    attendeeCount: 9,
    responseStatus: "tentative",
  },
  {
    id: "m4",
    title: "Dentist",
    start: at(17, 30),
    end: at(18, 15),
    allDay: false,
    location: "123 Main St",
    attendeeCount: 0,
  },
];

export const mockEmails: EmailMessage[] = [
  {
    id: "e1",
    threadId: "e1",
    subject: "Re: Q3 roadmap — need your sign-off today",
    fromName: "Priya Nair",
    fromEmail: "priya@example.com",
    snippet:
      "Thanks for the draft. Could you confirm the launch date so I can lock the plan before our 2pm review?",
    date: minutesAgo(25),
    unread: true,
    important: true,
    starred: false,
    link: "#",
  },
  {
    id: "e2",
    threadId: "e2",
    subject: "Invoice #4821 is due tomorrow",
    fromName: "Billing",
    fromEmail: "billing@vendor.com",
    snippet: "A friendly reminder that invoice #4821 for $2,400 is due on...",
    date: minutesAgo(90),
    unread: true,
    important: true,
    starred: false,
    link: "#",
  },
  {
    id: "e3",
    threadId: "e3",
    subject: "Notes from yesterday's customer call",
    fromName: "Marcus Lee",
    fromEmail: "marcus@example.com",
    snippet:
      "Sharing the recap and action items. The big one: they want SSO before they'll expand the contract.",
    date: minutesAgo(150),
    unread: false,
    important: false,
    starred: true,
    link: "#",
  },
  {
    id: "e4",
    threadId: "e4",
    subject: "Your flight to SFO — check-in is open",
    fromName: "AirTravel",
    fromEmail: "no-reply@airtravel.com",
    snippet: "Check in now for flight AT 482 departing tomorrow at 7:05 AM.",
    date: minutesAgo(220),
    unread: true,
    important: false,
    starred: false,
    link: "#",
  },
];
