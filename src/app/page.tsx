import { auth } from "@/auth";
import { getDigest } from "@/lib/digest";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ScheduleList } from "@/components/ScheduleList";
import { EmailList } from "@/components/EmailList";
import { SignInButton, SignOutButton } from "@/components/AuthButtons";

// Always render fresh — the digest is a snapshot of "right now".
export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  const digest = await getDigest();
  const userName = session?.user?.name ?? undefined;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight text-slate-400">
          ☀️ Daily Digest
        </span>
        {session?.user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline dark:text-slate-400">
              {session.user.email}
            </span>
            <SignOutButton />
          </div>
        ) : (
          <SignInButton label="Connect Google" />
        )}
      </div>

      {digest.demo && (
        <DemoBanner error={digest.error} signedIn={Boolean(session?.user)} />
      )}

      <div className="animate-fade-in space-y-8">
        <DashboardHeader
          name={userName}
          events={digest.events}
          emailCount={digest.emails.length}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <SectionTitle>Today&apos;s schedule</SectionTitle>
            <ScheduleList events={digest.events} />
          </section>

          <section>
            <SectionTitle>Important email</SectionTitle>
            <EmailList emails={digest.emails} />
          </section>
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-slate-400">
        Read-only access to your Google Calendar and Gmail. Nothing is stored.
      </footer>
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </h2>
  );
}

function DemoBanner({
  error,
  signedIn,
}: {
  error?: string;
  signedIn: boolean;
}) {
  return (
    <div className="mb-6 flex flex-col items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-amber-500/40 dark:bg-amber-500/10">
      <p className="text-amber-800 dark:text-amber-200">
        {error
          ? error
          : signedIn
            ? "Showing sample data — reconnect your Google account to see your real day."
            : "This is a preview with sample data. Connect your Google account to see your real calendar and inbox."}
      </p>
      <div className="shrink-0">
        <SignInButton label="Connect Google" />
      </div>
    </div>
  );
}
