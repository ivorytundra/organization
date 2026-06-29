import { auth } from "@/auth";
import { fetchTodaysEvents } from "./calendar";
import { fetchImportantEmails } from "./gmail";
import { mockEmails, mockEvents } from "./mock";
import type { Digest } from "./types";

/**
 * Assemble the day's digest. If the user is signed in we fetch their real
 * Calendar + Gmail data; otherwise (or on error) we fall back to sample data
 * and flag it as a demo so the UI can show a banner.
 */
export async function getDigest(): Promise<Digest> {
  const session = await auth();
  const s = session as unknown as Record<string, unknown> | null;
  const accessToken = s?.accessToken as string | undefined;
  const sessionError = s?.error as string | undefined;

  if (!accessToken || sessionError) {
    return { events: mockEvents, emails: mockEmails, demo: true };
  }

  try {
    const [events, emails] = await Promise.all([
      fetchTodaysEvents(accessToken),
      fetchImportantEmails(accessToken),
    ]);
    return { events, emails, demo: false };
  } catch (err) {
    console.error("Failed to build digest from Google APIs", err);
    return {
      events: mockEvents,
      emails: mockEmails,
      demo: true,
      error:
        "Couldn't reach your Google account just now — showing sample data. Try signing in again.",
    };
  }
}
