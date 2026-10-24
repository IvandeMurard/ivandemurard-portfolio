import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEASUREMENT_FROM, rateLabel, type RoseMetrics } from "@/components/rose/roseMetrics";

type RoseEvent = {
  id: string;
  created_at: string;
  path: string;
  section_id: string | null;
  kind: string;
  label_or_question: string | null;
  used_chip: boolean;
};

const countBy = <T,>(rows: T[], key: (r: T) => string) => {
  const m = new Map<string, number>();
  rows.forEach((r) => m.set(key(r), (m.get(key(r)) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

const Table = ({ title, rows }: { title: string; rows: [string, number][] }) => (
  <section className="mb-10">
    <h2 className="font-mono uppercase tracking-[0.12em] text-[11px] text-secondary mb-3">{title}</h2>
    {rows.length === 0 ? <p className="text-sm text-on-surface-variant">No data yet.</p> : (
      <ul className="divide-y divide-outline-variant border-y border-outline-variant">
        {rows.map(([k, n]) => (
          <li key={k} className="flex justify-between py-2 text-sm"><span className="text-on-surface">{k}</span><span className="tabular-nums text-on-surface-variant">{n}</span></li>
        ))}
      </ul>
    )}
  </section>
);

const AdminRose = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [events, setEvents] = useState<RoseEvent[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [days, setDays] = useState(30);
  const [metrics, setMetrics] = useState<RoseMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    document.title = "Rose · Private";
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => { sub.subscription.unsubscribe(); meta.remove(); };
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    (async () => {
      const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
      setIsAdmin(!!role);
      if (!role) return;
    })();
  }, [session]);

  useEffect(() => {
    if (!isAdmin) { setMetrics(null); setEvents([]); return; }
    let active = true;
    setLoading(true);
    setMsg("");
    supabase.rpc("get_rose_metrics", { days_window: days }).then(({ data, error }) => {
      if (!active) return;
      setLoading(false);
      if (error) { setMsg("Metrics could not be loaded. Please retry."); setMetrics(null); return; }
      setMetrics(data as unknown as RoseMetrics);
    });
    return () => { active = false; };
  }, [isAdmin, days]);

  useEffect(() => {
    setEvents([]);
    if (!isAdmin || !showQuestions) return;
    let active = true;
    const since = new Date(Math.max(Date.now() - days * 86400000, Date.parse(MEASUREMENT_FROM))).toISOString();
    supabase.from("rose_events").select("id,created_at,path,section_id,kind,label_or_question,used_chip")
      .in("kind", ["question", "followup"]).gte("created_at", since)
      .order("created_at", { ascending: false }).limit(100).then(({ data, error }) => {
        if (!active) return;
        if (error) setMsg("Recent questions could not be loaded.");
        else setEvents((data as RoseEvent[]) ?? []);
      });
    return () => { active = false; };
  }, [isAdmin, showQuestions, days]);

  const stats = useMemo(() => {
    const questions = events.filter((e) => e.kind === "question" || e.kind === "followup" || e.kind === "chip");
    return {
      perPage: countBy(questions, (e) => e.path),
      perChip: countBy(events.filter((e) => e.kind === "chip"), (e) => `${e.label_or_question ?? "?"} · ${e.path}`),
      proposed: events.filter((e) => e.kind === "booking_proposed").length,
      clicked: events.filter((e) => e.kind === "booking_clicked").length,
      opened: events.filter((e) => e.kind === "opened").length,
      recent: events.filter((e) => e.kind === "question" || e.kind === "followup").slice(0, 100),
    };
  }, [events]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
  };

  if (!ready) return null;

  return (
    <main className="min-h-screen bg-surface text-on-surface px-6 md:px-12 py-16 max-w-5xl mx-auto">
      <h1 className="font-headline text-3xl text-primary mb-8">Rose · private view</h1>
      {!session ? (
        <form onSubmit={signIn} className="max-w-sm space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" aria-label="Email" className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" aria-label="Password" className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm" />
          <Button type="submit">Sign in</Button>
          {msg ? <p className="text-sm text-destructive">{msg}</p> : null}
        </form>
      ) : isAdmin === false ? (
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">This account has no access.</p>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
      ) : isAdmin ? (
        <>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-on-surface-variant">Rose product measures</p>
            <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
              <SelectTrigger aria-label="Measurement window" className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>{[7, 30, 90].map((d) => <SelectItem key={d} value={String(d)}>{d} days</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <p className="mb-6 text-sm text-on-surface-variant">Complete aggregates since 24 October 2026, 14:55 UTC, within the selected window. Earlier records may include tests and are excluded. Preview and local events are not collected. Sessions are browser tabs, not unique people.</p>
          {loading ? <p role="status" className="mb-6 text-sm">Loading measures...</p> : null}
          {msg ? <p role="alert" className="mb-6 text-sm text-destructive">{msg}</p> : null}
          {metrics && !loading ? <>
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["Activation", metrics.activated, metrics.opened, "Opened sessions with a visitor turn / opened sessions"],
                ["Continuation", metrics.continued, metrics.question_sessions, "Sessions with at least two visitor turns / question sessions. Not proof of usefulness."],
                ["Evidence navigation", metrics.reference_sessions, metrics.answered_sessions, "Answered sessions with an internal reference click / answered sessions. Clicks, not confirmed reading."],
                ["Contact intent", metrics.contact_sessions, metrics.question_sessions, "Question sessions with a booking link click / question sessions. Not confirmed meetings."],
                ["Booking proposals", metrics.proposed_sessions, metrics.question_sessions, "Question sessions with a proposal / question sessions. Relevance requires qualitative review."],
                ["Booking card clicks", metrics.card_clicked_sessions, metrics.card_proposed_sessions, "Sessions with a card click and proposal / proposal sessions. Direct booking chips excluded."],
                ["Request failures", metrics.failed, metrics.submitted, "Failed or interrupted requests / started requests. Includes Clear during streaming."],
              ].map(([label, numerator, denominator, definition]) => <div key={String(label)} className="rounded-md border border-outline-variant p-4">
                <h2 className="font-mono text-xs uppercase text-secondary">{label}</h2>
                <p className="my-2 font-headline text-2xl text-primary tabular-nums">{String(numerator)} / {String(denominator)}</p>
                <p className="text-sm text-on-surface">{rateLabel(Number(numerator), Number(denominator))}</p>
                <details className="mt-3 text-xs text-on-surface-variant"><summary className="cursor-pointer">Definition</summary><p className="mt-2">{definition}</p></details>
              </div>)}
            </div>
            <p className="mb-8 text-sm text-on-surface-variant">Requests: {metrics.submitted} started, {metrics.completed} completed, {metrics.failed} failed or interrupted. Internal reference clicks: {metrics.reference_clicks}. Missing outcomes can indicate abandoned tabs or lost telemetry, not success. Percentages are withheld below 20 observations, a display rule, not statistical confidence.</p>
          </> : null}
          <div className="grid md:grid-cols-2 gap-10">
            <Table title="Visitor turns per page" rows={(metrics?.per_page ?? []).map((r) => [r.label, r.count])} />
            <Table title="Internal reference destinations" rows={(metrics?.destinations ?? []).map((r) => [r.label, r.count])} />
          </div>
          <section className="mb-10 border-y border-outline-variant py-5">
            <h2 className="font-mono text-xs uppercase text-secondary mb-3">Not measured</h2>
            <p className="text-sm text-on-surface-variant">Confirmed meetings (Cal.com), professional outcomes, visitor satisfaction, factual correctness, booking relevance and reading completion. General site traffic is outside this dashboard. Continuity and answer quality are assessed with synthetic scenarios. Trends await a sufficient clean baseline.</p>
          </section>
          <Button variant="outline" onClick={() => setShowQuestions((v) => !v)}>{showQuestions ? "Hide recent questions" : "Show recent questions"}</Button>
          {showQuestions ? <section className="mt-5">
            <h2 className="font-mono uppercase tracking-[0.12em] text-[11px] text-secondary mb-3">Recent questions</h2>
            <ul className="divide-y divide-outline-variant border-y border-outline-variant">
              {stats.recent.map((e) => (
                <li key={e.id} className="py-3 text-sm">
                  <p className="text-on-surface">{e.label_or_question}</p>
                  <p className="mt-1 font-mono text-[11px] text-on-surface-variant">
                    {new Date(e.created_at).toLocaleString("en-GB")} · {e.path}{e.section_id ? `#${e.section_id}` : ""} · {e.kind}{e.used_chip ? " · chip" : ""}
                  </p>
                </li>
              ))}
            </ul>
          </section> : null}
          <Button variant="outline" className="mt-10" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </>
      ) : null}
    </main>
  );
};

export default AdminRose;
