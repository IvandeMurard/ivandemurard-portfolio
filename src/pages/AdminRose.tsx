import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

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
      const { data } = await supabase.from("rose_events").select("*").order("created_at", { ascending: false }).limit(1000);
      setEvents((data as RoseEvent[]) ?? []);
    })();
  }, [session]);

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
          <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[["Opened", stats.opened], ["Questions", stats.recent.length], ["Booking proposed", stats.proposed], ["Booking clicked", stats.clicked]].map(([k, v]) => (
              <div key={k as string} className="rounded-md border border-outline-variant p-4">
                <p className="font-mono uppercase tracking-[0.12em] text-[10px] text-on-surface-variant">{k}</p>
                <p className="mt-2 font-headline text-3xl text-primary tabular-nums">{v}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <Table title="Questions per page" rows={stats.perPage} />
            <Table title="Chips clicked" rows={stats.perChip} />
          </div>
          <section>
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
          </section>
          <Button variant="outline" className="mt-10" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </>
      ) : null}
    </main>
  );
};

export default AdminRose;
