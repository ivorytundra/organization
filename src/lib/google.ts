import { google } from "googleapis";

/**
 * Build authenticated Google API clients from a user access token.
 *
 * The access token comes from the Auth.js session (see `src/auth.ts`), which
 * also handles refreshing it when it expires. We only ever read data, so the
 * OAuth scopes requested are the read-only Gmail and Calendar scopes.
 */
export function getGoogleClients(accessToken: string) {
  const authClient = new google.auth.OAuth2();
  authClient.setCredentials({ access_token: accessToken });

  return {
    calendar: google.calendar({ version: "v3", auth: authClient }),
    gmail: google.gmail({ version: "v1", auth: authClient }),
  };
}
