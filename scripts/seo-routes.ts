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
}

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
    title: "Ivan de Murard, Product Builder in Paris",
    description:
      "Product builder in Paris. 5 years across start-ups, scale-ups and large groups, plus 2 years co-founding a SaaS. Designs from ops, ships with AI.",
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
    path: "/journeys",
    title: "Case Studies, Selected Work by Ivan de Murard · Ivan de Murard",
    description:
      "Case studies: Aetherix (agentic AI for boutique hotels), Sonor (urban noise SaaS), Tacet (acoustic twin). Product and AI work shipped 0 to 1.",
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
      ],
    },
  },
  {
    path: "/aetherix",
    title: "Aetherix, Agentic AI for Boutique Hotel Operations · Ivan de Murard",
    description:
      "Agentic AI framework for boutique hotel operations. Anticipates staffing and F&B needs, cuts food waste and costs, frees teams for guest experience.",
    type: "article",
    changefreq: "monthly",
    priority: "0.9",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Aetherix",
      headline: "Aetherix: A new operating layer for boutique hotels",
      url: `${BASE_URL}/aetherix`,
      about: ["Agentic AI", "Hospitality Operations", "Boutique Hotels"],
      creator: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
      dateCreated: "2026-01-01",
      relatedLink: [`${BASE_URL}/tacet`],
    },
  },
  {
    path: "/sonor",
    title: "Sonor, Urban Noise Intelligence for Cities · Ivan de Murard",
    description:
      "B2G SaaS turning open data into urban noise maps for municipalities. Co-founder and Product Lead, 2020 to 2022.",
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
        "Dual memory (idiosyncratic and hive mind)",
        "Human-in-the-loop price modifier rules",
        "Chain of Thought JSON payloads",
        "MCP server for RMS, PMS and orchestration agents",
      ],
      creator: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
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
    title: "A hard call on Aetherix's agent boundaries · Ivan de Murard",
    description:
      "Where to draw the line between a forecasting model and an acting agent, and why splitting Prophet from Claude was the decision that shaped the rest of the architecture.",
    type: "article",
    changefreq: "monthly",
    priority: "0.6",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "A hard call on Aetherix's agent boundaries",
      datePublished: "2026-04-20",
      dateModified: "2026-04-20",
      author: { "@type": "Person", name: "Ivan de Murard", url: BASE_URL },
      articleSection: "Agentic AI",
      url: `${BASE_URL}/journal/agent-boundaries-aetherix`,
    },
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
