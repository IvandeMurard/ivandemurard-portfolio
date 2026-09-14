import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://ivandemurard.com";
const DEFAULT_OG = `${SITE_URL}/og/ivan-default.jpg`;

/**
 * Routes that have a markdown representation served at <path>.md.
 * Kept in sync with scripts/seo-routes.ts (route.markdown), which emits the files.
 */
const MARKDOWN_ROUTES: readonly string[] = [
  "/aetherix",
  "/sonor",
  "/tacet",
  "/lore",
  "/anima",
  "/architecture",
  "/journal/harnesses-graders-closed-loops",
];

type SeoProps = {
  title: string;
  description: string;
  /** Path only, e.g. "/atherix". Defaults to current location. */
  path?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  /** One or many JSON-LD objects. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** If true, title is used verbatim (no " · Ivan de Murard" suffix). */
  rawTitle?: boolean;
  markdown?: string;
  /** If true, emits <meta name="robots" content="noindex, follow">. */
  noIndex?: boolean;
};

const upsertMeta = (selector: string, attr: "name" | "property", key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const SCRIPT_ID = "seo-jsonld";

export const Seo = ({
  title,
  description,
  path,
  image = DEFAULT_OG,
  type = "website",
  jsonLd,
  rawTitle,
  markdown,
  noIndex,
}: SeoProps) => {
  const { pathname } = useLocation();
  const finalPath = path ?? pathname;
  const canonical = `${SITE_URL}${finalPath === "/" ? "" : finalPath}`;
  const fullTitle = rawTitle ? title : `${title} · Ivan de Murard`;
  // Route-shaped .md URL wins over a hand-passed one, so the announced variant
  // always matches what the build emits.
  const markdownHref = MARKDOWN_ROUTES.includes(finalPath)
    ? `${SITE_URL}${finalPath}.md`
    : markdown
      ? new URL(markdown, SITE_URL).href
      : undefined;

  useEffect(() => {
    const alternate = document.createElement("link");
    if (markdownHref) {
      alternate.rel = "alternate";
      alternate.type = "text/markdown";
      alternate.href = markdownHref;
      document.head.appendChild(alternate);
    }
    document.title = fullTitle;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertLink("canonical", canonical);

    if (noIndex) {
      upsertMeta('meta[name="robots"]', "name", "robots", "noindex, follow");
    } else {
      const r = document.head.querySelector('meta[name="robots"]');
      if (r) r.remove();
    }

    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
    upsertMeta('meta[property="og:image"]', "property", "og:image", image);
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", "Ivan de Murard");

    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    upsertMeta('meta[name="twitter:creator"]', "name", "twitter:creator", "@IvanMurard");

    // JSON-LD
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = SCRIPT_ID;
      script.text = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]);
      document.head.appendChild(script);
    }

    return () => {
      alternate.remove();
      const s = document.getElementById(SCRIPT_ID);
      if (s) s.remove();
    };
  }, [fullTitle, description, canonical, image, type, jsonLd, noIndex, markdownHref]);

  return null;
};

export const SITE = {
  url: SITE_URL,
  defaultOg: DEFAULT_OG,
};

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ivan de Murard",
  url: SITE_URL,
  jobTitle: "Product Builder",
  description:
    "Product builder with five years across start-ups, scale-ups and large groups, plus two years co-founding a SaaS. Designs from operational experience, ships with AI, keeps the human at the center.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Paris",
    addressCountry: "FR",
  },
  knowsAbout: [
    "Product Management",
    "Service Design",
    "Agentic AI",
    "Hospitality Operations",
    "SaaS",
    "Open Data",
  ],
  sameAs: [
    "https://www.linkedin.com/in/ivandemurard/",
    "https://github.com/IvandeMurard",
    "https://x.com/IvanMurard",
  ],
};

export default Seo;
