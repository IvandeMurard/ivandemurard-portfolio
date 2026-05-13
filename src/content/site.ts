import sonorImg from "@/assets/case-sonor.png";
import aetherixImg from "@/assets/case-aetherix.png";
import tacetImg from "@/assets/case-tacet.png";

export const SOCIAL_LINKS = {
  email: "mailto:ivandemurard@gmail.com",
  schedule: "https://cal.com/ivandemurard/30min?month=2026-05",
  linkedin: "https://www.linkedin.com/in/ivandemurard/",
  github: "https://github.com/IvandeMurard",
  instagram: "https://www.instagram.com/",
  x: "https://x.com/IvanMurard",
  cv: "/cv/Ivan_de_Murard_CV.pdf",
};

export type NavItem = { label: string; to: string };

export const PRIMARY_NAV: NavItem[] = [
  { label: "Case Studies", to: "/journeys" },
  { label: "About", to: "/atrium" },
  { label: "Field Notes", to: "/journal" },
  { label: "Contact", to: "/contact" },
];

export const UTILITY_NAV: { label: string; href: string }[] = [
  { label: "Email", href: SOCIAL_LINKS.email },
  { label: "Schedule", href: SOCIAL_LINKS.schedule },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
  { label: "GitHub", href: SOCIAL_LINKS.github },
];

export const PROJECTS = {
  sonor: {
    slug: "sonor",
    name: "Sonor",
    tagline: "Two-year journey as Co-founder & Product Lead. Turned open data into a SaaS platform used by municipalities to protect acoustic health, drive sustainability policies, and increase territorial attractiveness.",
    label: "SaaS • Urban Noise Insights • 2020 - 2022",
    image: sonorImg,
    cta: "The Full Narrative",
  },
  atherix: {
    slug: "atherix",
    name: "Aetherix",
    tagline: "Agentic AI framework for boutique hotel operations. Anticipates staffing and F&B needs in real time, reduces food waste and operational costs, and frees teams to focus on exceptional guest experiences.",
    label: "AI Agent • Boutique Hotel Operations • 2026",
    image: aetherixImg,
    cta: "Read the Vision",
  },
  tacet: {
    slug: "tacet",
    name: "Tacet",
    tagline: "Synthetic Acoustic Twin for hospitality. A headless intelligence layer that predicts how the external environment affects revenue and guest experience, pushing JSON alerts to RMS and PMS.",
    label: "B2B • Hospitality • Acoustic Intelligence • 2026",
    image: tacetImg,
    cta: "The Full Narrative",
  },
} as const;

// Roles drawn from the CV, used by the About page Track record section.
export type TrackRecordEntry = {
  range: string;
  role: string;
  company: string;
  outcome: string;
};

export const TRACK_RECORD: TrackRecordEntry[] = [
  {
    range: "2024 to 2025",
    role: "Product Manager, SaaS",
    company: "FORTIL for DomusVi",
    outcome:
      "Rolled out an internal SaaS to 500+ users across 100 care homes. Led the full lifecycle, from discovery and POC (Airtable, Make) to specs, IT mapping and field training.",
  },
  {
    range: "2023 to 2024",
    role: "Product Manager, Data & Operations",
    company: "ALTEN for Bouygues Telecom",
    outcome:
      "Built a data-driven dashboard to track and recover 1.9M EUR of receivables. 40% recovered, adopted by ops teams. Cross-functional with IT, Finance, Sales and leadership.",
  },
  {
    range: "2022 to 2023",
    role: "Customer Success Manager, Public Sector SaaS",
    company: "Opendatasoft",
    outcome:
      "Owned 22 European city and metropolitan clients from onboarding to production. 2 launches, zero churn, growing data volumes loaded.",
  },
  {
    range: "2020 to 2022",
    role: "Co-founder & Product Manager",
    company: "Sonor",
    outcome:
      "0 to 1 B2G SaaS for urban noise mapping (open data). Backed by Matrice and Banque des Territoires, 20K EUR in grants, MVP shipped.",
  },
];

// Current builds, surfaced from the GitHub profile.
export type NowEntry = {
  name: string;
  blurb: string;
  href: string;
  external: boolean;
  meta: string;
};

export const NOW_PROJECTS: NowEntry[] = [
  {
    name: "Aetherix",
    blurb:
      "Contextual intelligence layer for boutique hotel operations. Anticipates staffing and F&B needs, frees teams for guest care.",
    href: "/aetherix",
    external: false,
    meta: "Case study",
  },
  {
    name: "Tacet",
    blurb:
      "Synthetic acoustic twin for hospitality. Predicts how street, weather and events affect rooms, alerts RMS and PMS.",
    href: "/tacet",
    external: false,
    meta: "Case study",
  },
  {
    name: "Kissa",
    blurb:
      "Digital twin of a record collection. Scan, contextualise and curate, built for selectors and listening culture.",
    href: "https://github.com/IvandeMurard/kissa-project-mvp-B2C",
    external: true,
    meta: "GitHub",
  },
  {
    name: "Lore",
    blurb:
      "Voice AI mentor that captures tacit expertise from senior technicians and shares it on the shop floor. 24h hackathon win.",
    href: "https://github.com/IvandeMurard/Lore",
    external: true,
    meta: "GitHub",
  },
  {
    name: "Field Notes",
    blurb:
      "Where I write what I learn while building, in product, evaluation, and AI systems design.",
    href: "/journal",
    external: false,
    meta: "Read",
  },
];
