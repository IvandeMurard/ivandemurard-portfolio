import { SiteLayout } from "@/components/layout/SiteLayout";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { SOCIAL_LINKS } from "@/content/site";
import { useHaptic } from "@/hooks/useHaptic";
import { useTrackClick, type ClickKind } from "@/hooks/useTrackClick";

const CHANNELS: Array<{
  label: string;
  desc: string;
  cta: string;
  href: string;
  icon: string;
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
    icon: "share",
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
    icon: "code",
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
    <div className="pt-40 md:pt-48 pb-32">
      <section className="px-6 md:px-12 max-w-4xl mx-auto text-center mb-20 md:mb-24 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 hilma-circle pointer-events-none" />
        <span className="font-label uppercase tracking-[0.3em] text-[12px] text-secondary mb-8 block opacity-80 relative z-10">
          Get in touch
        </span>
        <h1 className="font-headline text-5xl md:text-8xl text-primary leading-[1.1] italic relative z-10">
          Shall <br />
          we meet again?
        </h1>
        <p className="mt-12 text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-light relative z-10">
          Let's discuss how to create business value and meaningful human experiences for your operations or users.
        </p>
      </section>

      <section className="px-6 md:px-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.external ? "_blank" : undefined}
              rel={c.external ? "noopener noreferrer" : undefined}
              onClick={() => {
                haptic("tap");
                track({ label: c.label, href: c.href, kind: c.kind });
              }}
              aria-label={`${c.label}: ${c.desc}${c.external ? " (opens in a new tab)" : ""}`}
              className={`group relative overflow-hidden bg-surface-container-lowest p-8 md:p-12 rounded-xl border border-outline-variant/15 hover:border-outline-variant/50 md:hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col gap-6 ring-1 ${c.ring} focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-background`}
            >
              <div
                aria-hidden="true"
                className={`absolute inset-0 bg-gradient-to-br ${c.accent} opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />
              <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-xl bg-surface-container border border-outline-variant/30 group-hover:border-secondary/40 group-hover:scale-105 transition-all duration-500">
                <Icon name={c.icon} className="text-secondary text-2xl" />
              </div>
              <div className="relative z-10">
                <h3 className="font-headline italic text-3xl md:text-4xl text-primary mb-3">{c.label}</h3>
                <p className="text-on-surface-variant font-light leading-relaxed">{c.desc}</p>
              </div>
              <span className="relative z-10 inline-flex items-center gap-2 font-label uppercase tracking-[0.2em] text-[11px] text-secondary mt-auto">
                {c.cta}
                <Icon
                  name={c.external ? "arrow_outward" : "arrow_forward"}
                  className="text-sm group-hover:translate-x-1 transition-transform"
                />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-32 md:mt-48 px-6 md:px-12 max-w-3xl mx-auto text-center">
        <div className="w-px h-24 bg-primary/20 mx-auto mb-12" />
        <p className="font-headline italic text-2xl md:text-3xl text-primary leading-relaxed">
          "Every journey begins with a single conversation."
        </p>
      </section>
    </div>
  </SiteLayout>
  );
};

export default Contact;
