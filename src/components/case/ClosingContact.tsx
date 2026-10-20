import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { SOCIAL_LINKS } from "@/content/site";
import { COMPASS } from "@/content/compass";

type Action = { label: string; href: string; icon: string; internal?: boolean };
type Room = { title: string; body: string; actions: Action[] };

const call: Action = { label: "Book a call", href: SOCIAL_LINKS.schedule, icon: "event" };
const email: Action = { label: "Email", href: SOCIAL_LINKS.email, icon: "mail" };
const aetherix: Action = { label: "Read Aetherix", href: "/aetherix", icon: "arrow_forward", internal: true };

/** Closing contact rooms, one per page. Copy approved in chat on 2026-10-20. */
export const CLOSING_ROOMS: Record<string, Room> = {
  sonor: {
    title: "Lessons from a 0→1 journey",
    body: "Sonor stopped in 2022 without a signed contract. What survived is the discipline of customer truth, open data pipelines, and knowing when to stop. Let's discuss your next zero-to-one product.",
    actions: [call, email, aetherix],
  },
  tacet: {
    title: "Interested in proactive intelligence for hotel operations?",
    body: "Built as a headless environmental twin with an MCP server. Open to conversations on environmental context, operations and hospitality tech.",
    actions: [call, email, { label: "GitHub source", href: "https://github.com/IvandeMurard/tacet-app", icon: "code" }],
  },
  compass: {
    title: "Turn open data into location decisions",
    body: "Compass assembles public registries into traceable context for commercial premises. Building a data product, or weighing an address?",
    actions: [call, { label: "Open the demo", href: COMPASS.demo, icon: "open_in_new" }, email],
  },
  lore: {
    title: "Guardrails for high-stakes domains",
    body: "In aviation maintenance, a confident wrong answer is the failure. Let's talk about refusal contracts, evaluation harnesses and domain-bounded LLMs.",
    actions: [call, { label: "GitHub repo", href: "https://github.com/IvandeMurard/Lore", icon: "code" }, aetherix],
  },
  anima: {
    title: "Designing guest memory that respects privacy",
    body: "Hotels forget too much, or remember too much. Let's discuss memory with confidence decay, consent and bounded contexts.",
    actions: [call, { label: "The architecture note", href: "/architecture", icon: "hub", internal: true }, aetherix],
  },
  architecture: {
    title: "Multi-agent systems that stay auditable",
    body: "Four domain agents around an orchestrator with no memory, talking only through MCP. Let's discuss architecting agentic systems that operations can trust.",
    actions: [call, { label: "Meta-repository", href: "https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture", icon: "code" }, aetherix],
  },
  cv: {
    title: "Discuss a role",
    body: "Open to AI Product Manager and Product Builder roles. Let's talk! Book a call",
    actions: [call, email, { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, icon: "person" }],
  },
  journal: {
    title: "Discuss an evaluation protocol",
    body: "These notes document real systems and real failure modes. Want to challenge an evaluation harness, or compare notes on agent observability?",
    actions: [call, email],
  },
};

export const ClosingContact = ({ room }: { room: keyof typeof CLOSING_ROOMS }) => {
  const r = CLOSING_ROOMS[room];
  return (
    <Reveal as="section" id="contact" aria-labelledby="closing-contact-heading" className="section-inverse px-6 md:px-12 py-24 md:py-32 scroll-mt-24">
      <div className="max-w-3xl mx-auto text-center">
        <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary block mb-4">Contact</span>
        <h2 id="closing-contact-heading" className="font-headline italic text-primary text-3xl md:text-5xl leading-tight mb-6">{r.title}</h2>
        <p className="text-on-surface-variant leading-relaxed">{r.body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {r.actions.map((a, i) => (
            <Button key={a.label} asChild variant={i === 0 ? "default" : "outline"}>
              {a.internal ? (
                <Link to={a.href}><Icon name={a.icon} />{a.label}</Link>
              ) : (
                <a href={a.href} {...(a.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}><Icon name={a.icon} />{a.label}</a>
              )}
            </Button>
          ))}
        </div>
      </div>
    </Reveal>
  );
};
