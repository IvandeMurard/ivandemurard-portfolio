import { SiteLayout } from "@/components/layout/SiteLayout";
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Github, Linkedin, type LucideIcon } from "lucide-react";
import { SOCIAL_LINKS } from "@/content/site";
import { useHaptic } from "@/hooks/useHaptic";
import { useTrackClick, type ClickKind } from "@/hooks/useTrackClick";

const CHANNELS: Array<{
  label: string;
  desc: string;
  cta: string;
  href: string;
  icon?: string;
  Logo?: LucideIcon;
  external: boolean;
  accent: string;
  ring: string;
  kind: ClickKind;
}> = [
  {
    label: "Email",
    desc: "For thoughtful, in-depth conversations.",
    cta: "Write a message",
    href: SOCIAL_LINKS.email,
    icon: "mail",
    external: false,
    accent: "from-secondary/15 via-secondary/5 to-transparent",
    ring: "ring-secondary/25",
    kind: "contact",
  },
  {
    label: "Schedule",
    desc: "Book a 30-minute discovery call.",
    cta: "Book a slot",
    href: SOCIAL_LINKS.schedule,
    icon: "calendar_month",
    external: true,
    accent: "from-primary-fixed-dim/30 via-primary-fixed/15 to-transparent",
    ring: "ring-primary/25",
    kind: "contact",
  },
  {
    label: "LinkedIn",
    desc: "Follow my professional journey.",
    cta: "Visit profile",
    href: SOCIAL_LINKS.linkedin,
    Logo: Linkedin,
    external: true,
    accent: "from-tertiary/15 via-tertiary/5 to-transparent",
    ring: "ring-tertiary/25",
    kind: "social",
  },
  {
    label: "GitHub",
    desc: "Explore the open-source work.",
    cta: "Browse repos",
    href: SOCIAL_LINKS.github,
    Logo: Github,
    external: true,
    accent: "from-secondary-fixed-dim/20 via-secondary/5 to-transparent",
    ring: "ring-secondary/25",
    kind: "social",
  },
];

const Contact = () => {
  const haptic = useHaptic();
  const track = useTrackClick();
  return (
  <SiteLayout title="Contact">
    <Seo
      title="Contact Ivan de Murard"
      description="Get in touch with Ivan de Murard. Email, schedule a call, or connect on LinkedIn and GitHub."
      path="/contact"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        url: "https://ivandemurard.com/contact",
        name: "Contact",
      }}
    />
    <div className="pt-36 md:pt-44 pb-24">
      <section className="px-6 md:px-12 max-w-4xl mx-auto">
        <span className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary mb-8 block">Contact</span>
        <h1 className="font-headline font-normal text-primary text-[clamp(40px,5vw,72px)] leading-[1.04] tracking-[-0.02em]">
          I ship prototypes fast.
        </h1>
        <p className="mt-5 font-headline italic accent-ink text-[clamp(24px,2.4vw,34px)] leading-snug">
          Aligning tech, operations and business into services people actually use is where I come in.
        </p>
        <p className="mt-8 text-lg md:text-xl text-on-surface leading-relaxed">
          Open to AI Product Manager and Product Builder roles.
        </p>
      </section>

      <section className="px-6 md:px-12 max-w-4xl mx-auto mt-14 md:mt-16">
        <ul className="border-t border-outline-variant">
          {CHANNELS.map((c) => (
            <li key={c.label} className="border-b border-outline-variant">
              <a
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener noreferrer" : undefined}
                onClick={() => { haptic("tap"); track({ label: c.label, href: c.href, kind: c.kind }); }}
                aria-label={`${c.label}: ${c.desc}${c.external ? " (opens in a new tab)" : ""}`}
                className="group grid grid-cols-[28px_1fr_auto] md:grid-cols-[28px_200px_1fr_auto] items-center gap-x-5 py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                {c.Logo ? (
                  <c.Logo size={20} strokeWidth={1.5} className="text-secondary" aria-hidden="true" />
                ) : (
                  <Icon name={c.icon ?? ""} className="text-secondary text-xl" />
                )}
                <span className="font-headline italic text-2xl md:text-3xl text-primary group-hover:text-secondary transition-colors">{c.label}</span>
                <span className="hidden md:block text-on-surface-variant leading-relaxed">{c.desc}</span>
                <Icon name={c.external ? "arrow_outward" : "arrow_forward"} className="text-secondary text-base group-hover:translate-x-1 transition-transform" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-on-surface-variant leading-relaxed">
          Looking for a structured timeline of roles and skills?{" "}
          <Link to="/cv" className="text-secondary border-b border-secondary/40 pb-0.5 hover:border-secondary transition-colors">Read the CV</Link>
        </p>
      </section>

      <section className="mt-16 md:mt-20 px-6 md:px-12 max-w-4xl mx-auto">
        <p className="font-headline italic text-2xl md:text-3xl text-primary leading-relaxed border-l border-secondary/60 pl-6">
          "Every journey begins with a single conversation."
        </p>
      </section>
    </div>
  </SiteLayout>
  );
};

export default Contact;
