import { SiteLayout } from "@/components/layout/SiteLayout";
import { Icon } from "@/components/ui/Icon";

const PROJECT_INFO = [
  { label: "Rôle", value: "Product Builder & Lead Developer (solo side project)" },
  { label: "Durée", value: "2026 (2–3 mois – V1 à V2 shipped)" },
  { label: "Équipe", value: "Solo (avec collaboration IA)" },
  {
    label: "Contexte",
    value: "Déclinaison B2C de Sonor – Application web mobile-first pour les Parisiens",
  },
  {
    label: "Objectif",
    value:
      "Visualiser la pollution sonore en temps réel, calculer un Serenity Score et trouver les itinéraires les plus calmes grâce aux données ouvertes Bruitparif",
  },
];

const STEPS = [
  { n: "01", icon: "water_drop", title: "Onboarding", body: "Première découverte du silence autour de soi." },
  { n: "02", icon: "lens_blur", title: "The Void", body: "Exploration libre de la carte." },
  { n: "03", icon: "edit_document", title: "Journaling", body: "Comparaison de zones et partage." },
  { n: "04", icon: "flare", title: "Session End", body: "Retour avec une vue claire de son environnement sonore." },
];

const FAQ = [
  { q: "Quelle est la source des données ?", a: "Données officielles Bruitparif + capteurs RUMEUR en temps réel + Open Data Paris." },
  { q: "Tacet est-il lié à Sonor ?", a: "Oui, c'est la version grand public de Sonor : des données macro vers un outil concret pour chaque habitant." },
  { q: "Quelles sont les prochaines étapes ?", a: "Passage vers une application iOS native avec navigation guidée et requêtes en langage naturel." },
];

const Tacet = () => (
  <SiteLayout title="Tacet: The Architecture of Silence">
    <main className="pt-32">
      {/* Hero */}
      <section className="relative min-h-[80vh] md:min-h-[800px] flex flex-col justify-center px-6 md:px-12 max-w-screen-2xl mx-auto mb-16 overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <p className="font-label text-secondary uppercase tracking-[0.3em] text-xs mb-8">Selected Work / 2026</p>
          <h1 className="font-headline text-5xl md:text-9xl italic leading-tight text-primary mb-12">
            Tacet: The <br />
            Architecture <br />
            of Silence.
          </h1>
          <p className="font-headline text-2xl md:text-3xl text-on-surface-variant max-w-xl italic leading-relaxed">
            A personal sanctuary for the traveler in a noisy world.
          </p>
        </div>
        <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-full md:w-3/4 h-[600px] md:h-[800px] opacity-80 pointer-events-none">
          <div
            className="w-full h-full bg-gradient-to-tr from-primary/20 via-primary-container/10 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "8s" }}
          />
        </div>
      </section>

      {/* Project Info */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-24 md:mb-32">
        <div className="grid md:grid-cols-5 gap-8 py-12 border-y border-surface-variant">
          <div className="md:col-span-1">
            <h4 className="font-label text-xs uppercase tracking-[0.2em] text-secondary mb-2">Project Info</h4>
          </div>
          <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECT_INFO.map((info) => (
              <div key={info.label}>
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                  {info.label}
                </p>
                <p className="font-body text-sm text-on-surface">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Pursuit of Quiet */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto py-16 md:py-24 mb-24 md:mb-32 grid md:grid-cols-12 gap-12">
        <div className="md:col-start-2 md:col-span-4 self-center">
          <h2 className="font-headline text-3xl md:text-4xl italic text-primary mb-8 leading-snug">
            The Pursuit <br />
            of Quiet
          </h2>
        </div>
        <div className="md:col-span-6">
          <div className="space-y-8 text-lg text-on-surface-variant leading-relaxed max-w-lg">
            <p>
              Tacet est né d'une question simple : comment rendre les données Bruitparif utiles au quotidien ? Au lieu
              de rester au niveau macro des urbanistes (Sonor), Tacet met le pouvoir du silence directement dans la
              poche des habitants.
            </p>
          </div>
        </div>
      </section>

      {/* Mindful Interactions */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-32 md:mb-48">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-stretch">
          {/* Guided Respiration */}
          <div className="relative group">
            <div className="aspect-[4/5] bg-surface-container overflow-hidden rounded-xl mb-12 relative flex items-center justify-center border border-outline-variant/30">
              <div className="absolute inset-0 bg-gradient-to-b from-primary-container/5 to-transparent" />
              <div className="w-56 md:w-64 h-[450px] md:h-[500px] rounded-[3rem] bg-surface-container-low border-[8px] border-surface-container-highest shadow-2xl flex flex-col items-center justify-center overflow-hidden relative z-10 opacity-90 transition-transform duration-700 group-hover:scale-105">
                <div
                  className="w-32 h-32 rounded-full bg-secondary/10 border border-secondary/20 animate-ping"
                  style={{ animationDuration: "4s" }}
                />
                <div className="absolute text-center">
                  <p className="font-headline text-4xl text-primary italic mb-2">85</p>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Serenity Score
                  </p>
                </div>
              </div>
            </div>
            <div className="max-w-sm">
              <h3 className="font-headline text-3xl italic text-primary mb-4">Guided Respiration</h3>
              <p className="text-on-surface-variant mb-6">
                Interface calme et réactive qui affiche le Serenity Score (0–100) et la carte de bruit en temps réel
                (couche RUMEUR rafraîchie toutes les 3 minutes).
              </p>
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">01 / The Breath</span>
            </div>
          </div>

          {/* Soft Haptics */}
          <div className="relative group md:mt-24 lg:mt-48">
            <div className="aspect-[4/5] bg-surface-container overflow-hidden rounded-xl mb-12 relative flex items-center justify-center border border-outline-variant/30">
              <div className="w-56 md:w-64 h-[450px] md:h-[500px] rounded-[3rem] bg-surface-container-low border-[8px] border-surface-container-highest shadow-2xl flex flex-col items-center justify-center overflow-hidden relative z-10 opacity-90 transition-transform duration-700 group-hover:scale-105">
                <div className="w-full h-full relative">
                  <svg
                    className="absolute inset-0 w-full h-full text-secondary/30"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                  >
                    <path d="M 20 80 Q 50 20 80 80" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-surface/80 backdrop-blur-md px-6 py-3 rounded-full border border-outline-variant/30 text-center">
                    <p className="font-body text-sm text-primary mb-1">Calmest Route</p>
                    <p className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
                      12 min • 35 dB
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-primary/5 mix-blend-multiply pointer-events-none" />
            </div>
            <div className="max-w-sm">
              <h3 className="font-headline text-3xl italic text-primary mb-4">Soft Haptics</h3>
              <p className="text-on-surface-variant mb-6">
                Et guide l'utilisateur vers les rues les plus calmes, avec une interface pensée pour le confort et
                l'apaisement.
              </p>
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">02 / The Touch</span>
            </div>
          </div>
        </div>
      </section>

      {/* Chromatic Silence, midnight */}
      <section className="bg-primary py-32 md:py-48 text-on-primary relative overflow-hidden mb-32 md:mb-48">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-primary-container rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="px-6 md:px-12 max-w-screen-2xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div>
              <h2 className="font-headline text-4xl md:text-5xl italic mb-12 leading-tight">Chromatic Silence</h2>
              <div className="space-y-8 max-w-md">
                <p className="text-on-primary-container text-lg leading-relaxed">
                  Inspired by Picasso's Blue Era and the melancholic depth of dusk, our palette uses #001b3a as its
                  anchor. It is a color meant for introspection, not attention.
                </p>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary ring-1 ring-on-primary-container/30" />
                  <div className="w-12 h-12 rounded-full bg-primary-container ring-1 ring-on-primary-container/30" />
                  <div className="w-12 h-12 rounded-full bg-on-primary-container ring-1 ring-on-primary-container/30" />
                  <div className="w-12 h-12 rounded-full bg-secondary ring-1 ring-on-primary-container/30" />
                </div>
              </div>
            </div>
            <div className="bg-primary-container/40 p-8 md:p-12 rounded-2xl glass-nav border border-on-primary-container/10">
              <h4 className="font-label text-[10px] uppercase tracking-[0.3em] text-on-primary-container mb-8">
                The Grain Engine
              </h4>
              <p className="font-headline text-2xl md:text-3xl italic mb-12">
                "Imperfection is the signature of the human."
              </p>
              <p className="text-on-primary-container leading-relaxed">
                We utilize a proprietary Grain Engine to layer organic textures over digital surfaces. This, paired with
                the humanistic flaws of the Newsreader font, ensures Tacet never feels synthetic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Path Through Silence */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-32 md:mb-48">
        <div className="text-center mb-16 md:mb-32">
          <h2 className="font-headline text-4xl md:text-5xl italic text-primary mb-6">The Path Through Silence</h2>
          <div className="h-px w-24 bg-secondary/30 mx-auto" />
        </div>
        <div className="grid md:grid-cols-4 gap-8 md:gap-12">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="p-8 bg-surface-container-low rounded-lg transition-all duration-500 hover:bg-surface-container-lowest hover:shadow-2xl hover:shadow-primary/5 group relative overflow-hidden"
            >
              <span className="font-label text-[10px] text-secondary mb-8 block tracking-widest">{s.n}</span>
              <div className="w-12 h-12 rounded-full bg-surface-container-highest/50 mb-6 flex items-center justify-center text-primary/40">
                <Icon name={s.icon} className="text-sm" />
              </div>
              <h5 className="font-headline text-2xl italic mb-4 text-primary">{s.title}</h5>
              <p className="text-sm text-on-surface-variant leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* A Sanctuary in Daily Life */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto py-16 md:py-24 mb-24 md:mb-32 border-t border-surface-variant/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-headline text-3xl md:text-4xl italic text-primary mb-8 leading-snug">
            A Sanctuary in Daily Life
          </h2>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Tacet aide les Parisiens à évaluer leur quartier, choisir des rues calmes pour se déplacer ou habiter, et
            reprendre le contrôle sur leur exposition quotidienne au bruit, avec des données officielles et une
            interface pensée pour le mobile.
          </p>
        </div>
      </section>

      {/* Explore */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-32 md:mb-48">
        <div className="bg-surface-container-low rounded-3xl p-12 md:p-24 flex flex-col items-center text-center relative overflow-hidden">
          <h2 className="font-headline text-3xl md:text-4xl italic text-primary mb-6 relative z-10">
            Explore the Platform
          </h2>
          <p className="text-on-surface-variant mb-12 max-w-xl relative z-10">
            Experience the architecture of silence firsthand.
          </p>
          <a
            href="https://tacet.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-3xl aspect-[16/9] bg-surface-container-highest/50 rounded-2xl border border-outline-variant/20 mb-12 flex items-center justify-center relative z-10 group cursor-pointer overflow-hidden shadow-lg"
          >
            <div className="absolute inset-0 bg-primary/5 transition-colors duration-500 group-hover:bg-primary/10" />
            <div className="w-20 h-20 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-primary shadow-xl transition-transform duration-500 group-hover:scale-110">
              <Icon name="play_arrow" className="text-4xl ml-2" />
            </div>
          </a>
          <a
            href="https://github.com/IvandeMurard/tacet-app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center group relative z-10 bg-primary text-on-primary px-8 py-4 rounded-full hover:bg-primary/90 transition-colors duration-300 shadow-md"
          >
            <span className="font-label text-sm uppercase tracking-widest mr-4">View Repository</span>
            <Icon name="open_in_new" className="text-sm" />
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-12 max-w-3xl mx-auto mb-24 md:mb-32">
        <h3 className="font-headline text-2xl md:text-3xl italic text-primary mb-12 text-center">
          Frequently Asked Questions
        </h3>
        <div className="space-y-8">
          {FAQ.map((f) => (
            <div key={f.q} className="border-b border-surface-variant pb-8">
              <h4 className="font-body text-lg text-primary mb-4">{f.q}</h4>
              <p className="text-on-surface-variant leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto py-32 md:py-48 border-t border-surface-container-high">
        <div className="max-w-4xl">
          <h2 className="font-headline text-4xl md:text-7xl italic text-primary mb-12 leading-tight">
            Interested in the intersection of wellness and digital design?
          </h2>
          <a href="mailto:ivandemurard@gmail.com" className="inline-flex items-center group">
            <span className="font-headline text-2xl md:text-3xl italic text-secondary border-b border-secondary/20 group-hover:border-secondary transition-all duration-500 pb-1">
              Let's discuss.
            </span>
            <Icon
              name="east"
              className="ml-4 text-secondary group-hover:translate-x-2 transition-transform duration-500"
            />
          </a>
        </div>
      </section>
    </main>
  </SiteLayout>
);

export default Tacet;
