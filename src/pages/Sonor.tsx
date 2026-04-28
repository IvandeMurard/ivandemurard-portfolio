import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Icon } from "@/components/ui/Icon";
import { PROJECTS } from "@/content/site";

const META = [
  { label: "Role", value: "Co-founder & Product Lead" },
  { label: "Duration", value: "2 years (2020–2022)" },
  { label: "Team", value: "4 co-founders + 1 dev" },
  { label: "Client", value: "Local governments" },
  { label: "Industry", value: "GovTech / Smart City" },
  { label: "Context", value: "Incubated at Matrice" },
];

const TIMELINE = [
  { date: "Oct 2020", phase: "Hackathon" },
  { date: "Phase 1", phase: "Discovery" },
  { date: "Phase 2", phase: "Pivot B2G" },
  { date: "Phase 3", phase: "Prototype" },
  { date: "Phase 4", phase: "Go-to-market" },
  { date: "End 2022", phase: "Conclusion" },
];

const STATS = [
  { v: "20+", k: "Stakeholder Interviews" },
  { v: "3+1", k: "Iterative Prototypes" },
  { v: "8+", k: "Metropolises Met" },
  { v: "€20k", k: "Grants Secured" },
];

const QUOTES = [
  {
    q: "Sonor finally provides us with the objective data we need to prioritize interventions and justify urban planning choices to our constituents.",
    n: "Pierre Ferrari",
    r: "Smart City Director, City of Arras",
  },
  {
    q: "Acoustic health is a major public health issue. Tools like this are essential to move from observation to action in dense urban environments.",
    n: "C. de Clermont-Tonnerre",
    r: "Paris City Councillor",
  },
  {
    q: "By bridging open data and citizen engagement, Sonor proposes a modern approach to tackling noise pollution at the territorial level.",
    n: "Lauriane Rossi",
    r: "Deputy, Pres. Nat. Noise Council",
  },
];

const FAQ = [
  {
    q: "Why did you stop the project?",
    a: "The B2G sales cycles proved too long for an early-stage startup without significant bridging capital. While the pilot phase was successful, the timeline to secure recurring municipal contracts misaligned with our runway requirements.",
  },
  {
    q: "How did you fund it?",
    a: "We were supported by early grants (Bourse French Tech), incubation resources from Matrice, and a strategic prototype commission from Banque des Territoires, totaling approximately €20k in non-dilutive funding alongside sweat equity.",
  },
  {
    q: "What were the key technical challenges?",
    a: "Normalizing heterogeneous open-data sources, estimating noise propagation in complex urban canyons without dense IoT sensor networks, and building performant map visualizations that remained responsive with hundreds of thousands of data points.",
  },
];

const Sonor = () => (
  <SiteLayout title="Sonor — The Quiet Art of Urban Intelligence">
    <main className="pt-32">
      {/* Hero */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-24 md:mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-6 block">
              Case Study: Sonor (2020-2022)
            </span>
            <h1 className="text-5xl md:text-8xl font-headline italic text-primary leading-[1.1] mb-8">
              Sonor: The Quiet Art of <br />
              Urban Intelligence.
            </h1>
            <p className="text-xl md:text-2xl font-body text-on-surface-variant max-w-xl leading-relaxed mb-16">
              A two-year entrepreneurial journey as Co-founder & Product Lead into the heart of city noise. Building an
              open-data SaaS platform to transform invisible pollution into actionable insights for more silent,
              sustainable, and livable cities.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-8 border-t border-outline-variant/30">
              {META.map((m) => (
                <div key={m.label}>
                  <h4 className="font-label uppercase tracking-widest text-[10px] text-secondary mb-2">{m.label}</h4>
                  <p className="text-on-surface-variant font-medium">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-end">
            <div className="w-full aspect-[4/5] bg-surface-container-high overflow-hidden relative group">
              <img
                src={PROJECTS.sonor.image}
                alt="Aerial view of urban landscape"
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Curiosity */}
      <section className="py-20 md:py-40 bg-surface-container-low">
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            <div className="w-full md:w-1/3">
              <h2 className="text-4xl font-headline italic text-primary md:sticky md:top-40">The Curiosity</h2>
            </div>
            <div className="w-full md:w-2/3 space-y-12">
              <p className="text-3xl font-headline leading-snug text-on-surface mb-12">
                How do we reclaim silence in a world that's getting louder? We started with a simple question: "Can
                open-source data be the key to designing quieter, more livable cities?"
              </p>
              <div className="space-y-8">
                <h4 className="font-label uppercase tracking-widest text-xs text-secondary">The Observation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <p className="text-on-surface-variant leading-relaxed">
                    Urban noise is the second largest source of urban nuisance in Europe. 25 million people are exposed
                    to dangerous nighttime noise levels.
                  </p>
                  <p className="text-on-surface-variant leading-relaxed">
                    It generates multiple deep disorders — chronic stress, cardiovascular diseases, cognitive impacts in
                    children — and carries a heavy social cost (48 000 deaths/year in Europe). Yet noise remains largely
                    invisible and under-addressed by public policies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Hypothesis (video placeholder) */}
      <section className="py-20 md:py-40 bg-surface">
        <div className="px-6 md:px-12 max-w-4xl mx-auto text-center">
          <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-6 block">
            The Hypothesis
          </span>
          <div className="relative w-full pt-[56.25%] bg-surface-container-high rounded-xl overflow-hidden shadow-2xl border border-outline-variant/30">
            <div className="absolute inset-0 flex items-center justify-center bg-primary/5 group cursor-pointer">
              <div className="text-center space-y-4 px-8">
                <Icon
                  name="play_circle"
                  className="text-6xl text-primary/40 group-hover:scale-110 transition-transform duration-500"
                />
                <p className="font-headline italic text-primary/60">
                  By making noise visible and data truly actionable — through real-time multi-source mapping,
                  prioritized action plans, citizen engagement, and impact measurement — we could equip municipalities
                  and urban planners with the tools to anticipate, act, and protect the most fragile resource of a city:
                  silence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product interfaces */}
      <section className="py-20 md:py-48 overflow-hidden">
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center mb-24 md:mb-40">
            <div className="order-2 lg:order-1">
              <div className="relative bg-surface-container rounded-lg p-4 shadow-xl">
                <img
                  src="https://lh3.googleusercontent.com/aida/ADBb0uhXfmnbxEoVVOeIxkmbCp6Zh7e8OyPDsW10ZrZR6zZ59L-gTkSWAmavfrONTK9DuOjgMtQZ0knjL_7KPJD8OjK8X5o1ZQfticeyJOe8mB3j73I2Nnlxvxt-1X0nvAVYF_KMhCJ3D1wLCETmsPxW4l29YucBW6JHoBXjQJ75HnN7mhO7N1QE8L0p4UwpbqJAboflIutayUm_-VpvY4eWZPHDzQjGZzKGgSLW9EYCJU6fQv340WELWaSEyrbxDV49Y7NJvf215VJqyhQ"
                  alt="Atmospheric Map interface"
                  loading="lazy"
                  className="w-full h-auto rounded border border-outline-variant/20 shadow-sm"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h3 className="text-4xl font-headline italic text-primary">Data Synthesis</h3>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                We designed and shipped a SaaS decision-support platform that aggregates and normalizes multiple open
                data sources, delivering high-fidelity, real-time city-wide acoustic mapping and actionable
                recommendations for urban planners.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl font-headline italic text-primary">Citizen Engagement & Urban Quietude</h3>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                The platform puts residents at the center: citizens can report local issues and share testimonies
                directly. Planners receive prioritized action plans and can measure real impact over time — turning data
                into concrete public policies that protect acoustic health.
              </p>
            </div>
            <div>
              <div className="relative bg-surface-container rounded-lg p-4 shadow-xl">
                <img
                  src="https://lh3.googleusercontent.com/aida/ADBb0uizONYHMWB38LdSfX2-YV2-l8QwqcEy7p52FvGB44y7XBnaFJ8cV31Uqe4W_ykns5xuUvYaPpG16QO84mycjqYuf4Bw95YrxmeWXS1q5dAh5ZqSodMsfr6Q_VVySKcBeQUZSrI3Y8C9jgkg_gM524ydgII5HJQklgv7p7RPdmYyTfgI5eaFSMTwVnUZAX7oNoMmeZrZlyD0GMYSeYe4bTUxJP2wOc6sgpEBnZvWfWXGtyo07mxy_NZ_v7FJIDzbzmj72v4-ttahe4E"
                  alt="Quiet Intelligence dashboard interface"
                  loading="lazy"
                  className="w-full h-auto rounded border border-outline-variant/20 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcome — midnight */}
      <section className="bg-primary text-on-primary py-20 md:py-40">
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <span className="font-label uppercase tracking-[0.2em] text-[10px] text-primary-fixed-dim block">
                  From Hypothesis to Reality
                </span>
                <div className="flex items-center space-x-4 text-on-primary-container text-sm font-label tracking-wider overflow-x-auto pb-4">
                  {TIMELINE.map((t, i) => (
                    <div key={t.phase} className="flex items-center gap-4 min-w-max">
                      <div className="flex flex-col space-y-2">
                        <span className="text-primary-fixed-dim text-xs">{t.date}</span>
                        <span>{t.phase}</span>
                      </div>
                      {i < TIMELINE.length - 1 && (
                        <Icon name="arrow_forward" className="text-primary-fixed-dim text-sm" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <span className="font-label uppercase tracking-[0.2em] text-[10px] text-primary-fixed-dim block">
                Milestones & Results
              </span>
              <h2 className="text-5xl md:text-7xl font-headline italic leading-tight">
                A Sanctuary in <br />
                the Concrete.
              </h2>
              <div className="space-y-6 text-on-primary-container text-lg max-w-lg">
                <p>
                  Through partnerships with Banque des Territoires and Matrice, Sonor has become a vital tool for
                  municipalities seeking to value acoustic health as a cornerstone of sustainability and territorial
                  attractiveness.
                </p>
                <p>
                  Beyond the data points, the project proved that a quieter city isn't just a quieter city — it is a
                  more humane, human-centric sanctuary for everyone who calls it home.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {STATS.map((s) => (
                <div key={s.k} className="p-6 md:p-8 border border-on-primary/10 space-y-4">
                  <span className="text-4xl font-headline italic block">{s.v}</span>
                  <p className="text-sm font-label uppercase tracking-widest text-primary-fixed-dim">{s.k}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explore the platform */}
      <section className="py-20 md:py-40 bg-surface-container-low">
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-headline italic text-primary">Explore the Platform</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="relative w-full pt-[56.25%] bg-surface-container-high rounded-xl overflow-hidden shadow-2xl border border-outline-variant/30">
              <iframe
                title="Sonor walkthrough"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                src="https://www.loom.com/embed/80aea87ed30245bdb4a0847abbda7aae"
              />
            </div>
            <div className="text-center">
              <a
                href="https://byronbark.github.io/sonor-web-component/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-on-primary font-headline italic text-lg rounded-full hover:bg-primary-container transition-colors shadow-lg"
              >
                Discover Banque des Territoires Vision →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders */}
      <section className="py-20 md:py-40 bg-surface">
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-headline italic text-primary">What Stakeholders Said</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {QUOTES.map((q) => (
              <div
                key={q.n}
                className="p-10 border border-outline-variant/20 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow"
              >
                <Icon name="format_quote" className="text-4xl text-primary/20 mb-6 block" />
                <p className="font-headline text-lg text-on-surface-variant leading-relaxed mb-8 italic">"{q.q}"</p>
                <div>
                  <p className="font-bold text-primary">{q.n}</p>
                  <p className="text-sm text-secondary uppercase tracking-wider mt-1">{q.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-32 bg-surface-container-low border-t border-outline-variant/20">
        <div className="px-6 md:px-12 max-w-3xl mx-auto space-y-12 md:space-y-16">
          <h2 className="text-3xl md:text-4xl font-headline italic text-primary text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8 md:space-y-12">
            {FAQ.map((f, i) => (
              <div
                key={f.q}
                className={i < FAQ.length - 1 ? "border-b border-outline-variant/30 pb-8" : ""}
              >
                <h4 className="text-xl font-bold text-primary mb-4">{f.q}</h4>
                <p className="text-on-surface-variant leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Acknowledgments */}
      <section className="py-24 md:py-48 bg-surface-container-lowest border-t border-outline-variant/10">
        <div className="px-6 md:px-12 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-headline italic text-primary mb-12">Acknowledgments</h2>
          <p className="text-xl md:text-2xl font-headline text-on-surface-variant leading-relaxed mb-16 md:mb-24 max-w-3xl mx-auto">
            This project would not have been possible without the support of Banque des Territoires and Matrice
            association, and the collaboration of my three co-founders: Émilie, Majda and Benjamin.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
            <span className="font-headline italic text-2xl text-on-surface-variant">SONOR</span>
            <span className="font-headline italic text-2xl text-on-surface-variant">Banque des Territoires</span>
            <span className="font-headline italic text-2xl text-on-surface-variant">Matrice</span>
          </div>
          <div className="mt-16">
            <Link
              to="/contact"
              className="inline-block bg-primary text-on-primary px-10 py-4 rounded-xl font-label uppercase tracking-[0.2em] text-[11px] hover:bg-primary-container transition-all"
            >
              Begin a Conversation
            </Link>
          </div>
        </div>
      </section>
    </main>
  </SiteLayout>
);

export default Sonor;
