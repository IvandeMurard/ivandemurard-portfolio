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
  { label: "Journeys", to: "/journeys" },
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDogW3hnTyvO1mOpFDqS98V3PU318gkspKvg9at7VD2tY3XU9BRAIF8WN1HkhcV5eGLTa5tWoRbVT7M91iA-K4yWW9etf5cKGGyIN3g-cDSr9BWMT_euUFT-sApE3NeVPQMwPYyHg8bOFm4G7suAhSJq72Tyufw87kazEiL3va133hNUvaZSZq5Ej-1hna7Fzepy_3N7BjxBsQD-aD6suYO8OxFLgMEFZQDL4qUQJXlZUbjdlg8Z8_XKAT2N3wNlPsG0QM212z6N_gW",
    cta: "The Full Narrative",
  },
  atherix: {
    slug: "atherix",
    name: "Atherix",
    tagline: "Agentic AI framework for boutique hotel operations. Anticipates staffing and F&B needs in real time, reduces food waste and operational costs, and frees teams to focus on exceptional guest experiences.",
    label: "AI Agent • Hospitality Operations",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJj8pqco3G2Hq93O7h037g7Mq11stPvvybosiWAChmYU-M6WVoj9MtGdlEBp7OkrLkybn_m6-Ba23aT0Uhl9d6aQtyF5xmzblqQp14UWYUSp7VI5KkkuhMWx9O-gUfO372I0Rv9FOOh5fD1LIc9vPAwWE5rnLArGx5Jz28tFMMN3Y557xX3k4aWslbYDMP1Gw3P_IlKhGY05VKLMoEf6CbSskfS62bfzuUfqK6PntaSFoA7m4vrRU29OXgqB2g_TwyAn3aCvmDhmlO",
    cta: "Read the Vision",
  },
  tacet: {
    slug: "tacet",
    name: "Tacet",
    tagline: "Personal mobile sanctuary for Parisians. Puts real-time Bruitparif data and Serenity Score in users' hands to reclaim quiet in daily life, housing choices, and urban commutes.",
    label: "B2C • iOS • Wellness",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCshxC-2ndyHiSMfYsfo3wyGle4QYN9a723qLo_lEpBHt-A5XwqhIef2ME27mOo67MNq-bRPE6Mwpg2mTLHXqKg4w3t2LU3uPkh78U-fXQ3JnWxq-z5r6RPbnz4w4QLNvVcUtLDACQoUzTkqknXqMjlA1fLFNJ9g_DQm0UaZeeUVqZtDu0v89ooPFXjCZOgMfAVVSFUS5yxwgEmzXgNqpqBA871uJDfIGxTh4TtiDQQP3ZF4h3VZCzyGHYkPj-RPFhbh5vfIvoELiVs",
    cta: "The Full Narrative",
  },
} as const;
