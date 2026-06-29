import { getGoogleClients } from "./google";
import type { EmailMessage } from "./types";

/**
 * "Important" is deliberately opinionated: we surface mail that Gmail itself
 * flags as important or that you starred, plus anything still unread in the
 * primary inbox from the last couple of days. We drop the noisy Promotions and
 * Social categories so the digest stays signal, not newsletters.
 */
const IMPORTANT_QUERY = [
  "in:inbox",
  "newer_than:2d",
  "-category:promotions",
  "-category:social",
  "(is:important OR is:starred OR is:unread)",
].join(" ");

const MAX_EMAILS = 12;

export async function fetchImportantEmails(
  accessToken: string,
): Promise<EmailMessage[]> {
  const { gmail } = getGoogleClients(accessToken);

  const list = await gmail.users.messages.list({
    userId: "me",
    q: IMPORTANT_QUERY,
    maxResults: MAX_EMAILS,
  });

  const ids = (list.data.messages ?? []).map((m) => m.id).filter(Boolean) as string[];
  if (ids.length === 0) return [];

  // Fetch metadata for each message in parallel. We only need headers + labels,
  // so `format: "metadata"` keeps the payload small.
  const messages = await Promise.all(
    ids.map((id) =>
      gmail.users.messages.get({
        userId: "me",
        id,
        format: "metadata",
        metadataHeaders: ["Subject", "From", "Date"],
      }),
    ),
  );

  const emails = messages.map((m): EmailMessage => {
    const data = m.data;
    const headers = data.payload?.headers ?? [];
    const header = (name: string) =>
      headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";

    const { name, email } = parseFrom(header("From"));
    const labels = data.labelIds ?? [];
    const internalMs = data.internalDate ? Number(data.internalDate) : Date.now();

    return {
      id: data.id ?? "",
      threadId: data.threadId ?? "",
      subject: header("Subject").trim() || "(no subject)",
      fromName: name,
      fromEmail: email,
      snippet: decodeSnippet(data.snippet ?? ""),
      date: new Date(internalMs).toISOString(),
      unread: labels.includes("UNREAD"),
      important: labels.includes("IMPORTANT"),
      starred: labels.includes("STARRED"),
      link: `https://mail.google.com/mail/u/0/#all/${data.id}`,
    };
  });

  // Rank: important+unread first, then starred, then plain unread, newest within.
  return emails.sort((a, b) => score(b) - score(a) || b.date.localeCompare(a.date));
}

function score(e: EmailMessage): number {
  return (
    (e.important ? 4 : 0) +
    (e.starred ? 2 : 0) +
    (e.unread ? 1 : 0)
  );
}

/** Parse a "Display Name <addr@host>" header into its parts. */
function parseFrom(raw: string): { name: string; email: string } {
  const match = raw.match(/^\s*"?([^"<]*)"?\s*<([^>]+)>\s*$/);
  if (match) {
    return { name: match[1].trim() || match[2].trim(), email: match[2].trim() };
  }
  return { name: raw.trim(), email: raw.trim() };
}

// Gmail snippets arrive HTML-escaped (e.g. &amp;, &#39;); undo the common ones.
function decodeSnippet(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}
