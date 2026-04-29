import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Icon } from "@/components/ui/Icon";

const PRINCIPLES = [
  {
    icon: "architecture",
    title: "Holistic Product Building",
    body: "I approach every project with a complete 0→1 vision — connecting digital interfaces with physical operations, online experiences with offline realities, front-end to back-end.",
  },
  {
    icon: "favorite",
    title: "Human-Centered Impact",
    body: "Every system I design aims to reduce friction, eliminate waste, and create space for genuine human connection and care while delivering clear business value.",
  },
  {
    icon: "visibility_off",
    title: "Quiet Confidence",
    body: "I build technology that stays out of the way, anticipates needs, and empowers people rather than demanding their attention.",
  },
];

const STEPS = [
  { n: "01", title: "Discovery", body: "Deep listening to users, business needs and operational realities" },
  { n: "02", title: "Refinement", body: "Removing noise until only essential value remains" },
  { n: "03", title: "The Welcome", body: "Delivering elegant, impactful solutions that feel natural and human." },
];

const Atrium = () => (
  <SiteLayout title="About">
    <main className="relative pt-32 md:pt-48">
      {/* Hero */}
      <section className="px-6 md:px-12 max-w-screen-2xl mx-auto mb-32 md:mb-56">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl text-primary leading-none tracking-tight italic mb-8">
              About: <br />
              A Conversation <br />
              <span className="pl-12 md:pl-24">with Ivan</span>
            </h1>
            <p className="font-body text-lg md:text-2xl text-on-surface-variant max-w-4xl leading-relaxed">
              A personal space telling the story of a Product Builder dedicated to curiosity, determination, and a
              philosophy rooted in care and craft. From{" "}
              <Link
                to="/sonor"
                className="border-b border-on-surface-variant/30 hover:border-primary hover:text-primary transition-all duration-300"
              >
                co-founding an open-data SaaS
              </Link>{" "}
              to{" "}
              <Link
                to="/atherix"
                className="border-b border-on-surface-variant/30 hover:border-primary hover:text-primary transition-all duration-300"
              >
                designing agentic AI for boutique hotel operations
              </Link>
              , I build products that bridge digital interfaces with physical operations, always placing the human
              experience at the center while delivering measurable business impact.
            </p>
          </div>
          <div className="lg:col-span-4 relative h-[400px] lg:h-[500px] bg-surface-container-high overflow-hidden">
            <div className="absolute inset-0 turner-gradient-warm" />
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNkD8TPVVqC2tcCNIvT2A8tVAEKEOW8yhVB6zL38ht2dOuHzmm0BXXzazpV6r-jcB6-ST3QldmVrqlQhzavhvgQi8BwDLm1kbVfQ4k-4_y_NT565cLoN0rvrIO7NOuQ3DaFRNtCi9i-cDPsQWyhtDKL_B1SDnvtO_iCgFOxC865X1eGLFEjmjf8rZnsxs8sUCT6c9WtWONdVCUuXzVBYk_ea3aUfIHTzVehYQK1nj6nkwBdc8QmjbRb9e7B3GzQ22fs9llREiTYB1g"
              alt="Portrait of Ivan in soft lighting"
              loading="lazy"
              className="w-full h-full object-cover mix-blend-luminosity opacity-80"
            />
            <div className="absolute bottom-8 left-8">
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface">
                Reflection No. 01
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Curiosity */}
      <section className="mb-32 md:mb-56">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div className="flex flex-col justify-center order-2 md:order-1">
            <span className="font-label text-secondary mb-6 tracking-widest uppercase text-sm">Chapter One</span>
            <h2 className="font-headline text-4xl md:text-6xl text-primary mb-10 italic">The Curiosity</h2>
            <div className="space-y-8 font-body text-lg text-on-surface-variant leading-relaxed">
              <p>
                Curiosity is a discipline. It has been the compass throughout my journey — from mechanical engineering
                and co-founding Sonor, an open-data SaaS platform that helps cities protect acoustic health, to
                designing Atherix, an agentic AI framework for boutique hotel operations. It guides me through complex
                systems toward purposeful, human-centered product building.
              </p>
            </div>
            <div className="mt-12 flex items-center gap-6">
              <div className="w-16 h-px bg-outline-variant/30" />
              <span className="font-headline italic text-primary text-2xl">Seeking the unseen connections.</span>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <div className="aspect-[4/5] bg-surface-container-low overflow-hidden relative">
              <div className="absolute top-10 right-10 w-48 md:w-64 h-48 md:h-64 bg-secondary-fixed/30 rounded-full mix-blend-multiply" />
              <div className="absolute bottom-20 left-10 w-32 md:w-40 h-32 md:h-40 bg-primary-container/10 rounded-full mix-blend-multiply" />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeBdNJ9Jo17dT0Utajts10Kc0pme6VYhYbls8QtDjwJPCDyRdTkiV6ASIbVEafxO_z2FH5uMLzu4uo8Su-bhyf5GHf4okreDzhXb67dBrdH1OH6UBlmvK1Wl3Brr6o3-yp8vLEECsC2vBV4e9amcEOKm1KU14ZyT4nOHCxCYj_akk9eFOVXM54zR3gcBTqpcxHfdD_ysXlJfugQXZ1xBmqLAaysqTLCUvJ1a7CSwyKGyTARF5REMlqRgFso-3zEIL1IOWRUN2-QFks"
                alt="Soft light casting shadows on textured wall"
                loading="lazy"
                className="w-full h-full object-cover mix-blend-multiply opacity-60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Principles I Build With — midnight */}
      <section className="relative py-32 md:py-56 overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0">
          <div className="absolute inset-0 turner-gradient-warm opacity-20" />
        </div>
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-headline text-4xl md:text-7xl text-surface mb-16 md:mb-24 italic">
            The Principles I Build With
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="p-8 md:p-12 bg-surface/10 backdrop-blur-2xl border border-surface/5 flex flex-col items-center group transition-all duration-500 hover:bg-surface/15"
              >
                <Icon
                  name={p.icon}
                  className="text-surface-variant text-4xl mb-8 group-hover:scale-110 transition-transform duration-500"
                />
                <h3 className="font-headline text-2xl text-surface-bright mb-4 italic">{p.title}</h3>
                <p className="font-body text-surface-dim/80 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A Journey Together */}
      <section className="mt-32 md:mt-56 mb-24 md:mb-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          <div className="lg:col-span-5 relative h-[400px] lg:h-[600px] bg-surface-container-high">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOawyRk3Fc4Fwbnplm0TSJjwM1t8n0A8lHQDDVibzOMgGjeq0EOQG5ApTFXxjpuPHp1S9BqLLcmVEzJtefh-AgtXk_T6KVp7sFkI3HGXcXFvDBK7gTyxzquG8SSDfCcmBHTeQA_2Hv_7PPq47Jn1rAhfoX_XI1Zj_NRpyjbqVbWCglI_hnhIEY5jd7ZRNeguSzpDC4zIBFTs0-o20_VPiwbVw5XIJKj9kDnJy-wrKDlY7bdoOzHa4rL3U8gIZhPwF6oiJY-pK46tla"
              alt="Abstract networks"
              loading="lazy"
              className="w-full h-full object-cover mix-blend-overlay opacity-70"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 md:w-80 h-64 md:h-80 rounded-full border border-secondary/20 p-8 flex items-center justify-center">
                <div className="w-full h-full rounded-full border border-secondary/40 p-8 flex items-center justify-center">
                  <span className="font-headline italic text-secondary text-2xl">Together.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-headline text-4xl md:text-7xl text-primary mb-8 italic">A Journey Together</h2>
            <p className="font-body text-lg md:text-xl text-on-surface-variant leading-relaxed mb-12 max-w-2xl">
              Building products is a shared walk through a landscape of possibilities. Whether launching a SaaS
              platform that influences public policy or creating agentic systems that optimize hotel operations, my
              goal remains the same: to craft digital experiences that respect the human on the other side while
              driving real, measurable impact.
            </p>
            <div className="space-y-10 md:space-y-12">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-6 md:gap-8 items-start">
                  <span className="font-headline text-3xl text-secondary italic">{s.n}</span>
                  <div>
                    <h4 className="font-body font-bold text-primary uppercase tracking-wider text-sm mb-2">
                      {s.title}
                    </h4>
                    <p className="text-on-surface-variant">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 md:mt-20">
              <Link
                to="/contact"
                className="bg-primary text-on-primary px-10 md:px-12 py-5 rounded-xl font-label uppercase tracking-widest text-xs hover:opacity-90 transition-all duration-300 inline-flex items-center gap-4 group"
              >
                Inquire for a Journey
                <Icon
                  name="arrow_forward"
                  className="text-sm group-hover:translate-x-2 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  </SiteLayout>
);

export default Atrium;
