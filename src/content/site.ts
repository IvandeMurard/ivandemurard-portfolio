import sonorImg from "@/assets/case-sonor.png";
import aetherixImg from "@/assets/case-aetherix.png";
import tacetImg from "@/assets/case-tacet.png";
import loreImg from "@/assets/case-lore.png";
import animaImg from "@/assets/case-anima.png";
import parisCompassImg from "@/assets/case-paris-compass.jpg";
import { STATUSES } from "./statuses";


export const SOCIAL_LINKS = {
  email: "mailto:ivandemurard@gmail.com",
  schedule: "https://cal.com/ivandemurard/discussion-and-introduction",
  linkedin: "https://www.linkedin.com/in/ivandemurard/",
  github: "https://github.com/IvandeMurard",
  instagram: "https://www.instagram.com/",
  x: "https://x.com/IvanMurard",
  cv: "/cv/Ivan_de_Murard_CV.pdf",
};

export type NavItem = { label: string; to: string };

export const PRIMARY_NAV: NavItem[] = [
  { label: "Case Studies", to: "/journeys" },
  { label: "Architecture", to: "/architecture" },
  { label: "About", to: "/atrium" },
  { label: "CV", to: "/cv" },
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
    status: STATUSES.sonor,
    slug: "sonor",
    name: "Sonor",
    tagline: "B2G SaaS that turned acoustic open data into a decision tool for cities. Taken from discovery to MVP; stopped in 2022 after discovery concluded no contract would clear.",
    label: "SaaS • Urban Noise Insights • 2020 - 2022",
    image: sonorImg,
    cta: "The Full Narrative",
  },
  atherix: {
    status: STATUSES.aetherix,
    slug: "aetherix",
    name: "Aetherix",
    tagline: "The F&B agent for boutique hotels: one recommendation a day in WhatsApp, the manager's reply, and the outcome recorded next to it. Built to improve with every day it runs.",
    label: "AI Agent • Boutique Hotel Operations • 2026",
    image: aetherixImg,
    cta: "Read the Vision",
  },
  tacet: {
    status: STATUSES.tacet,
    slug: "tacet",
    name: "Tacet",
    tagline: "Synthetic Acoustic Twin for hospitality. A headless intelligence layer that predicts how the external environment affects revenue and guest experience, pushing JSON alerts to RMS and PMS.",
    label: "B2B • Hospitality • Acoustic Intelligence • 2026",
    image: tacetImg,
    cta: "The Full Narrative",
  },
  lore: {
    status: STATUSES.lore,
    slug: "lore",
    name: "Lore",
    tagline: "Voice AI mentor for aviation maintenance. Captures what a retiring technician knows and never wrote down, then gives it back to a junior on the shop floor by voice, always behind the procedure.",
    label: "AI Agent · Aviation Maintenance · 2026",
    image: loreImg,
    cta: "The Full Narrative",
  },
  anima: {
    status: STATUSES.anima,
    slug: "anima",
    name: "Anima",
    tagline: "Hotels have amnesia. What they know about a guest lives in one person's head or a diversity of files and tools, forcing guests to repeat themselves. But AI agents profiling people without their consent can't be the answer. Anima is a guest memory that keeps only what guests said, fuses it with live hotel context and adapts the stay as reality changes.",
    label: "AI Agent · Guest Memory · 2026",
    image: animaImg,
    cta: "The Full Narrative",
  },
  compass: {
    status: STATUSES.compass,
    slug: "compass",
    name: "Compass",
    tagline: "Every address has a story. Compass reads it before you sign.",
    label: "Data product · Commercial premises · Paris · 2026",
    image: parisCompassImg,
    cta: "Read the case study",
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
      "Delivered the MVP; rollout planned for 500+ users across 100 care homes. Led the full lifecycle, from discovery and POC (Airtable, Make) to specs, IT mapping and field training.",
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
      "F&B execution agent for boutique hotel operations. Forecasts covers daily against real data; staffing and waste outcomes are pilot hypotheses, not measured results.",
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
    name: "Lore",
    blurb:
      "Voice AI mentor that captures tacit expertise from senior technicians and shares it on the shop floor. Built in 24 hours by a team of 4.",
    href: "/lore",
    external: false,
    meta: "Case study",
  },
  {
    name: "Paris Compass",
    blurb:
      "Find commercial spaces from their context. Business history, turnover signals, noise, amenities and risk scores from public open data, for humans and agents.",
    href: "https://paris-compass.lovable.app",
    external: true,
    meta: "Live app",
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
