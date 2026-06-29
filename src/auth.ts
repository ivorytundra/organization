import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Read-only access is all this app ever needs.
const SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
].join(" ");

/**
 * Exchange a refresh token for a fresh access token when the current one has
 * expired. Returns a new token object; on failure flags `error` so the UI can
 * prompt the user to sign in again.
 */
async function refreshAccessToken(token: JWTWithTokens): Promise<JWTWithTokens> {
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID!,
        client_secret: process.env.AUTH_GOOGLE_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      }),
    });

    const refreshed = await res.json();
    if (!res.ok) throw refreshed;

    return {
      ...token,
      accessToken: refreshed.access_token,
      // Google may not return a new refresh token; keep the existing one.
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + (refreshed.expires_in as number),
      error: undefined,
    };
  } catch (err) {
    console.error("Failed to refresh access token", err);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

interface JWTWithTokens {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: string;
  [key: string]: unknown;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Trust the deployment's host header. Vercel sets this automatically, but
  // making it explicit avoids "UntrustedHost" errors on other hosts.
  trustHost: true,
  providers: [
    Google({
      authorization: {
        params: {
          scope: SCOPES,
          // Needed to receive a refresh token so the session can outlive the
          // ~1 hour access-token lifetime.
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      const t = token as JWTWithTokens;

      // Initial sign-in: persist the tokens from the provider.
      if (account) {
        t.accessToken = account.access_token as string | undefined;
        t.refreshToken = account.refresh_token as string | undefined;
        t.expiresAt = account.expires_at as number | undefined;
        return t;
      }

      // Token still valid (with a 60s safety margin).
      if (t.expiresAt && Date.now() < t.expiresAt * 1000 - 60_000) {
        return t;
      }

      // Expired — try to refresh.
      if (t.refreshToken) {
        return refreshAccessToken(t);
      }

      return t;
    },
    async session({ session, token }) {
      const t = token as JWTWithTokens;
      // Expose what the UI/data layer needs. Typed loosely; consumers read these
      // via the same unknown-cast in `getDigest`.
      const s = session as unknown as Record<string, unknown>;
      s.accessToken = t.accessToken;
      s.error = t.error;
      return session;
    },
  },
});
