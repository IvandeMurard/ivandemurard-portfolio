// Central registry of indexable routes. Consumed by:
// - scripts/generate-sitemap.ts (sitemap.xml)
// - scripts/generate-seo-snapshots.ts (per-route static HTML head)
//
// Keep in sync with src/App.tsx routes that should be indexed.
// Aliases (e.g. /atherix → /aetherix) are intentionally excluded.

export const BASE_URL = "https://ivandemurard.com";
export const SITE_NAME = "Ivan de Murard";
export const TWITTER_HANDLE = "@IvanMurard";
export const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/sMRil9LH9sToThaq9m11r7H5Eqq2/social-images/social-1777484036920-Capture_d%E2%80%99e%CC%81cran_2026-04-29_193344.webp";

export interface SeoRoute {
  path: string;
  title: string; // raw <title>
  description: string;
  type?: "website" | "article" | "profile";
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /**
   * File name of the hand-authored markdown mirror in public/ for this route.
   * When set, the build emits dist<path>.md with the same bytes and the head
   * announces it with <link rel="alternate" type="text/markdown">.
   */
  markdown?: string;
}

/** Absolute URL of the markdown variant of a route, derived from its path. */
export const markdownUrlFor = (route: SeoRoute): string | undefined =>
  route.markdown ? `${BASE_URL}${route.path}.md` : undefined;

/** Path -> markdown URL, for every route that has a mirror. */
export const markdownRouteMap = (): Record<string, string> =>
  Object.fromEntries(
    SEO_ROUTES.filter((r) => r.markdown).map((r) => [r.path, `${BASE_URL}${r.path}.md`]),
  );

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ivan de Murard",
  url: BASE_URL,
  jobTitle: "Product Builder",
  description:
    "Product builder with five years across start-ups, scale-ups and large groups, plus two years co-founding a SaaS. Designs from operational experience, ships with AI, keeps the human at the center.",
  address: { "@type": "PostalAddress", addressLocality: "Paris", addressCountry: "FR" },
  sameAs: [
    "https://www.linkedin.com/in/ivandemurard/",
    "https://github.com/IvandeMurard",
    "https://x.com/IvanMurard",
  ],
};

export const SEO_ROUTES: SeoRoute[] = [
  {
    path: "/",
    title: "Ivan de Murard, AI Product Manager & Builder, Paris",
    description:
      "AI Product Manager & Builder in Paris. Front-of-house, co-founder, product manager. Now I build AI workflows for operations, bridging operations, tech and real business value.",
    type: "website",
    changefreq: "weekly",
    priority: "1.0",
    jsonLd: [
      personJsonLd,
      { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: BASE_URL, inLanguage: "en" },
    ],
  },
  {
    path: "/atrium",
    title: "About Ivan de Murard, Product Builder · Ivan de Murard",
    description:
      "Ivan de Murard is a product builder based in Paris. Five years across start-ups, scale-ups and large groups, plus two years co-founding Sonor. Convictions, method, and track record.",
    type: "profile",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/cv",
    markdown: "Ivan_de_Murard_CV.md",
    title: "CV, Ivan de Murard, AI Product Builder · Ivan de Murard",
    description:
      "Ivan de Murard's CV: founder and builder experience, product and customer roles, skills, and education.",
    type: "profile",
    changefreq: "monthly",
    priority: "0.8",
    jsonLd: personJsonLd,
  },
  {
    path: "/journeys",
    title: "Case Studies, Selected Work by Ivan de Murard · Ivan de Murard",
    description:
      "The Hospitality Multi-Agent Architecture: Aetherix (F&B agent), Tacet (environmental agent), Anima (guest agent). Standalone systems: Lore (voice AI for aviation maintenance), Sonor (urban noise SaaS). Product and AI work shipped 0 to 1.",
    type: "website",
    changefreq: "monthly",
    priority: "0.9",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Case Studies",
      url: `${BASE_URL}/journeys`,
      hasPart: [
        { "@type": "CreativeWork", name: "Aetherix", url: `${BASE_URL}/aetherix` },
        { "@type": "CreativeWork", name: "Sonor", url: `${BASE_URL}/sonor` },
        { "@type": "CreativeWork", name: "Tacet", url: `${BASE_URL}/tacet` },
        { "@type": "CreativeWork", name: "Lore", url: `${BASE_URL}/lore` },
        { "@type": "CreativeWork", name: "Anima", url: `${BASE_URL}/anima` },
      ],
    },
  },
  {
    path: "/aetherix",
    markdown: "aetherix.md",
    title: "Aetherix, the F&B execution agent for boutique hotels · Ivan de Murard",
    description:
      "Aetherix is an F&B agent for boutique hotels: one WhatsApp message a day, the manager's reply, and the outcome recorded next to it. Built and evaluated on historical data. Staged on Fly.io, connected to the Apaleo sandbox. Ready for a 30-day pilot.",
    type: "article",
    changefreq: "monthly",
    priority: "0.9",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Aetherix",
      headline: "Aetherix, the F&B agent for boutique hotels",
      description: "Aetherix is an F&B agent for boutique hotels: one WhatsApp message a day, the manager's reply, and the outcome recorded next to it. Built and evaluated on historical data. Staged on Fly.io, connected to the Apaleo sandbox. Ready for a 30-day pilot.",
      url: `${BASE_URL}/aetherix`,
      about: ["Agentic AI", "Hospitality Operations", "Model Context Protocol", "Boutique Hotels"],
      creator: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
      dateCreated: "2026-01-01",
      dateModified: "2026-10-07",
      codeRepository: "https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture",
      relatedLink: [`${BASE_URL}/tacet`],
    },
  },
  {
    path: "/sonor",
    markdown: "sonor.md",
    title: "Sonor, Urban Noise Intelligence for Cities · Ivan de Murard",
    description:
      "B2G SaaS that turned acoustic open data into a decision tool for cities. Taken from discovery to MVP; stopped in 2022 after discovery concluded no contract would clear.",
    type: "article",
    changefreq: "yearly",
    priority: "0.7",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Sonor",
      headline: "Sonor: The Quiet Art of Urban Intelligence",
      url: `${BASE_URL}/sonor`,
      about: ["Urban Noise", "Open Data", "Public Sector SaaS"],
      creator: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
    },
  },
  {
    path: "/tacet",
    markdown: "tacet.md",
    title: "Tacet, Environmental Twin for Hospitality · Ivan de Murard",
    description:
      "Headless MCP server that turns street, weather and crowd signals into yield rules and Chain of Thought payloads for RMS, PMS and orchestration agents.",
    type: "article",
    changefreq: "monthly",
    priority: "0.9",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Tacet",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "MCP server",
      operatingSystem: "Web, API",
      url: `${BASE_URL}/tacet`,
      featureList: [
        "3D ray-tracing physics engine",
        "Dual memory (idiosyncratic and Hive Mind, Research: no network to aggregate yet)",
        "Human-in-the-loop price modifier rules",
        "Chain of Thought JSON payloads",
        "MCP server for RMS, PMS and orchestration agents",
      ],
      creator: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
    },
  },
  {
    path: "/lore",
    markdown: "lore.md",
    title: "Lore, Voice AI Mentor for Aviation Maintenance · Ivan de Murard",
    description:
      "The knowledge retiring technicians carry isn't in any manual. Lore captures a senior's oral expertise by voice and returns it to a junior on the shop floor, never contradicting the procedure.",
    type: "article",
    changefreq: "monthly",
    priority: "0.9",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Lore",
      headline: "Lore: a living memory for a trade that is handed down out loud",
      url: `${BASE_URL}/lore`,
      about: ["Institutional Memory", "Tacit Knowledge", "Aviation Maintenance", "Voice AI", "Evaluation Harness"],
      creator: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
      dateCreated: "2026-02-28",
      codeRepository: "https://github.com/IvandeMurard/Lore",
      relatedLink: [`${BASE_URL}/aetherix`],
    },
  },
  {
    path: "/anima",
    markdown: "anima.md",
    title: "Anima, the Guest Memory Node of the Hospitality Multi-Agent Architecture · Ivan de Murard",
    description:
      "Memory that means no guest has to ask twice. A guest memory node: keeps what a guest said and what happened, so nobody asks twice, without watching.",
    type: "article",
    changefreq: "monthly",
    priority: "0.9",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Anima",
      headline: "Anima: memory that means no guest has to ask twice",
      url: `${BASE_URL}/anima`,
      inLanguage: "en",
      about: ["Guest Memory", "Data Protection", "Agentic AI", "Hospitality Operations"],
      creator: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
      dateCreated: "2026-06-01",
      relatedLink: [`${BASE_URL}/architecture`, `${BASE_URL}/aetherix`],
    },
  },
  {
    path: "/compass",
    markdown: "compass.md",
    title: "Compass, address-level context for commercial location decisions in Paris · Ivan de Murard",
    description:
      "Every address has a story. Compass reads it before you sign: open data turned into traceable, address-level context for commercial premises in Paris. Corpus and MCP server live.",
    type: "article",
    changefreq: "monthly",
    priority: "0.8",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Compass",
      headline: "Every address has a story. Compass reads it before you sign.",
      url: `${BASE_URL}/compass`,
      inLanguage: "en",
      about: ["Open Data", "Commercial Real Estate", "Data Product", "Paris"],
      creator: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
      dateCreated: "2026-10-06",
      codeRepository: "https://github.com/IvandeMurard/paris-compass",
      relatedLink: [`${BASE_URL}/sonor`],
    },
  },
  {
    path: "/agents",
    markdown: "agents.md",
    title: "For agents: MCP server, Markdown mirrors and llms files · Ivan de Murard",
    description:
      "Public, read-only access for AI agents: a public MCP server, a Markdown mirror of every page and llms files, statuses and stated limits included.",
    type: "website",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/architecture",
    markdown: "architecture.md",
    title: "Hospitality Multi-Agent Architecture, an Architecture Note · Ivan de Murard",
    description:
      "Five specialised agents, each owning one bounded context, talking only through MCP. Two are Built, one is a Synthetic PoC, two are Design. This note says which is which, using one shared status vocabulary.",
    type: "article",
    changefreq: "monthly",
    priority: "0.9",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: "Hospitality Multi-Agent Architecture",
      url: `${BASE_URL}/architecture`,
      inLanguage: "en",
      about: ["Agentic AI", "Model Context Protocol", "Hospitality Operations", "Software Architecture"],
      author: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
      codeRepository: "https://github.com/IvandeMurard/Hospitality-Multi-agent-Architecture",
      relatedLink: [`${BASE_URL}/aetherix`, `${BASE_URL}/tacet`, `${BASE_URL}/lore`],
    },
  },
  {
    path: "/journal",
    title: "Field Notes by Ivan de Murard · Ivan de Murard",
    description:
      "Notes from the field on product, evaluation, and AI systems design. Written while building Aetherix and other 0 to 1 products.",
    type: "website",
    changefreq: "weekly",
    priority: "0.8",
  },
  {
    path: "/journal/agent-boundaries-aetherix",
    markdown: "agent-boundaries-aetherix.md",
    title: "A wrong forecast is absorbed. A wrong action reaches a guest. · Ivan de Murard",
    description:
      "Prophet is a statistical forecasting library. Claude is a large language model. Keeping them as two components, rather than letting one model both predict and act, is the decision that shaped everything after it.",
    type: "article",
    changefreq: "monthly",
    priority: "0.6",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "A wrong forecast is absorbed. A wrong action reaches a guest.",
      datePublished: "2026-04-20",
      dateModified: "2026-04-20",
      author: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
      articleSection: "Agentic AI",
      url: `${BASE_URL}/journal/agent-boundaries-aetherix`,
    },
  },
  {
    path: "/journal/whose-truth-is-the-ground-truth",
    markdown: "whose-truth-is-the-ground-truth.md",
    title: "Whose truth is the ground truth? · Ivan de Murard",
    description:
      "An AI product is only as honest as the answer it learns from. Choosing that answer is a product decision, made before the data arrives.",
    type: "article",
    changefreq: "monthly",
    priority: "0.7",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Whose truth is the ground truth?",
        inLanguage: "en",
        datePublished: "2026-10-11",
        author: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
        articleSection: "Product",
        url: `${BASE_URL}/journal/whose-truth-is-the-ground-truth`,
      },
    ],
  },
  {
    path: "/journal/harnesses-graders-closed-loops",
    markdown: "harnesses-graders-closed-loops.md",
    title: "What is an LLM evaluation harness? Graders, protocols and closed loops for AI agents · Ivan de Murard",
    description:
      "An LLM evaluation harness runs fixed test cases through a model, scores them with graders and returns a release verdict. Definitions, acceptance tiers and real numbers from two products.",
    type: "article",
    changefreq: "monthly",
    priority: "0.7",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "What is an LLM evaluation harness? Graders, protocols and closed loops for AI agents",
        description:
          "What a grader is, what a harness is, what a protocol decides, and why the difference matters the first time a system is allowed to block a release.",
        inLanguage: "en",
        datePublished: "2026-07-31",
        dateModified: "2026-10-23",
        author: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
        articleSection: "Evaluation",
        url: `${BASE_URL}/journal/harnesses-graders-closed-loops`,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        url: `${BASE_URL}/journal/harnesses-graders-closed-loops`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is a grader?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "One line of a marking sheet: a single criterion, pass or fail, plus the reason. Kept deterministic, because a model judging a model fails the same way as the thing it judges.",
            },
          },
          {
            "@type": "Question",
            name: "Harness or protocol, what is the difference?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The protocol says what passing means. The harness is the machinery that applies it. Neither decides anything without the other.",
            },
          },
          {
            "@type": "Question",
            name: "Why not just write tests?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Because the failure mode is a perfectly formed answer carrying the wrong threshold. Code coverage cannot see that. In the four real defects found on Lore, the code worked exactly as written.",
            },
          },
          {
            "@type": "Question",
            name: "Can an LLM judge another LLM's output?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "On criteria where the cost of a wrong verdict is bounded, yes, provided it is calibrated against a golden set and its agreement rate with humans is measured. Never on a tier that admits no failures, because it fails in the same way as the thing it grades.",
            },
          },
          {
            "@type": "Question",
            name: "What does a closed loop actually require?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ground truth. Without something that says whether the output was right, you have measurement, not learning. Closing the measurement loop is architectural; closing the authority loop is a business and regulatory decision, and in aviation it is prohibited.",
            },
          },
          {
            "@type": "Question",
            name: "How do you prevent hallucinations?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You do not prevent them, you make them visible and blocking. A safety tier at 100% with no budget, and refusal coded as a contract rather than requested as a style note.",
            },
          },
          {
            "@type": "Question",
            name: "What is a confidence score worth?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "It depends which of three things it is. Self-declared by the model: a generated token, not a measurement. By corroboration: counted, therefore useful. Calibrated: the only strict sense, and it requires outcome data.",
            },
          },
        ],
      },
    ],
  },
  {
    path: "/contact",
    title: "Contact Ivan de Murard · Ivan de Murard",
    description:
      "Get in touch with Ivan de Murard. Email, schedule a call, or connect on LinkedIn and GitHub.",
    type: "website",
    changefreq: "yearly",
    priority: "0.6",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      url: `${BASE_URL}/contact`,
      name: "Contact",
    },
  },
];
