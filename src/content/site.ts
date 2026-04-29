import sonorImg from "@/assets/case-sonor.jpg";
import aetherixImg from "@/assets/case-aetherix.jpg";
import tacetImg from "@/assets/case-tacet.jpg";

export const SOCIAL_LINKS = {
  email: "mailto:ivandemurard@gmail.com",
  schedule: "https://cal.com/ivandemurard/30min?month=2026-05",
  linkedin: "https://www.linkedin.com/in/ivandemurard/",
  github: "https://github.com/IvandeMurard",
  instagram: "https://www.instagram.com/",
};

export type NavItem = { label: string; to: string };

export const PRIMARY_NAV: NavItem[] = [
  { label: "Stories", to: "/journeys" },
  { label: "Field Notes", to: "/journal" },
  { label: "About", to: "/atrium" },
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
    label: "SaaS • Urban Noise Insights • 2024",
    image: sonorImg,
    cta: "The Full Narrative",
  },
  atherix: {
    slug: "atherix",
    name: "Aetherix",
    tagline: "Agentic AI framework for boutique hotel operations. Anticipates staffing and F&B needs in real time, reduces food waste and operational costs, and frees teams to focus on exceptional guest experiences.",
    label: "AI Agent • Boutique Hotel Operations",
    image: aetherixImg,
    cta: "Read the Vision",
  },
  tacet: {
    slug: "tacet",
    name: "Tacet",
    tagline: "Personal mobile sanctuary for Parisians. Puts real-time Bruitparif data and Serenity Score in users' hands to reclaim quiet in daily life, housing choices, and urban commutes.",
    label: "B2C • iOS • Wellness",
    image: tacetImg,
    cta: "The Full Narrative",
  },
} as const;
