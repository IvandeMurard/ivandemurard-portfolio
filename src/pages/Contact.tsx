import { SiteLayout } from "@/components/layout/SiteLayout";
import { Icon } from "@/components/ui/Icon";
import { SOCIAL_LINKS } from "@/content/site";

const CHANNELS = [
  {
    label: "Email",
    desc: "For thoughtful, in-depth conversations.",
    href: SOCIAL_LINKS.email,
    icon: "mail",
    external: false,
  },
  {
    label: "Schedule",
    desc: "Book a 30-minute discovery call.",
    href: SOCIAL_LINKS.schedule,
    icon: "calendar_month",
    external: true,
  },
  {
    label: "LinkedIn",
    desc: "Follow my professional journey.",
    href: SOCIAL_LINKS.linkedin,
    icon: "share",
    external: true,
  },
  {
    label: "GitHub",
    desc: "Explore the open-source work.",
    href: SOCIAL_LINKS.github,
    icon: "code",
    external: true,
  },
];

const Contact = () => (
  <SiteLayout title="Contact">
    <main className="pt-40 md:pt-48 pb-32">
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
              className="group relative bg-surface-container-lowest p-10 md:p-12 rounded-xl border border-outline-variant/15 hover:border-outline-variant/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col gap-6"
            >
              <Icon
                name={c.icon}
                className="text-secondary text-4xl group-hover:scale-110 transition-transform duration-500"
              />
              <div>
                <h3 className="font-headline italic text-3xl text-primary mb-3">{c.label}</h3>
                <p className="text-on-surface-variant font-light leading-relaxed">{c.desc}</p>
              </div>
              <span className="inline-flex items-center gap-2 font-label uppercase tracking-[0.2em] text-[11px] text-secondary mt-auto">
                Open
                <Icon
                  name={c.external ? "open_in_new" : "arrow_forward"}
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
    </main>
  </SiteLayout>
);

export default Contact;
