export type CvRole = {
  title: string;
  dates: string;
  context: string;
  bullets: string[];
};

export type CvSkill = { label: string; text: string };

export const CV = {
  name: "Ivan de Murard",
  title: "AI Product Builder",
  location: "Paris (open to relocation)",
  email: "ivandemurard@gmail.com",
  website: "ivandemurard.com",
  github: "github.com/IvandeMurard",
  summary:
    "Product builder with 5 years in B2B SaaS: co-founded a SaaS company, led product inside large organisations, and now builds AI-native products from 0 to 1 by directing AI coding agents. I work across tech and non-tech teams, and I'm drawn to problems where the product still has to be made.",
  founder: [
    {
      title: "Product Builder, Hospitality agentic architecture",
      dates: "Nov 2025 – present",
      context:
        "Agentic systems for independent hotels: intelligence pushed into the tools staff already use, not another dashboard.",
      bullets: [
        "Aetherix (F&B agent): one recommendation a day on WhatsApp, with the manager's reply and the actual outcome logged next to it. Built and running on the Apaleo sandbox (OAuth2, MCP) and on public data; staged for a 30-day pilot.",
        "Anima (guest memory): keeps what guests said apart from what was inferred, and forgets what was never confirmed. Synthetic proof of concept with four memory layers and an MCP server; real guest data gated behind a data-protection assessment.",
        "Evaluation by design: forecasting benchmarked publicly on the Kaggle Recruit dataset against a naive median baseline, with mixed results reported as they are; 12 public ADRs.",
        "Architecture: 5 agents around a central orchestrator, multi-tenant, with GDPR constraints designed in from the start.",
      ],
    },
    {
      title: "Product Builder, Compass",
      dates: "2026 – present",
      context: "Address-level context for commercial location decisions in Paris, built on open data.",
      bullets: [
        "Product and data design, built by directing AI coding agents. A person and an AI agent see the same figures, sources and confidence levels.",
        "Published MCP server (npm paris-compass-mcp, listed in the MCP registry).",
      ],
    },
    {
      title: "Co-founder & Product Manager, Sonor",
      dates: "2020 – 2022",
      context: "B2G SaaS helping local governments reduce noise pollution with open data.",
      bullets: [
        "Took the product from problem discovery to a working MVP and engaged local governments in a sales process, with four co-founders plus a fifth person covering development and data science.",
        "Raised 20 000 € in grants; incubated at Matrice (Banque des Territoires).",
      ],
    },
  ] satisfies CvRole[],
  product: [
    {
      title: "Consultant Product Manager, DomusVi",
      dates: "2024 – 2025",
      context: "France's 2nd-largest private nursing-home group (Planète Grise 2026), highly regulated.",
      bullets: [
        "Owned discovery, specs and a no-code POC (Airtable, Make) to consolidate 10+ legacy tools onto one SaaS platform across 3 business lines.",
        "Aligned 7 C-level stakeholders and coordinated IT, business teams, legal, marketing and an external SaaS vendor.",
        "Prepared deployment and training; rollout planned for 500+ users across 100 care homes.",
      ],
    },
    {
      title: "Consultant Product Manager, Objenious (Bouygues Telecom IoT)",
      dates: "2023 – 2024",
      context: "France's first B2B IoT operator.",
      bullets: [
        "Owned a data-driven tool to recover 1,9M € in unpaid invoices across a mixed European B2B customer base.",
        "Coordinated IT, finance, sales and legal from build through adoption. 40% of the targeted debt recovered; tool adopted into standard process.",
      ],
    },
    {
      title: "Customer Success Manager, Opendatasoft (now Huwise)",
      dates: "2022 – 2023",
      context: "SaaS platform for public open-data publishing.",
      bullets: [
        "Owned the full customer lifecycle for 22 European cities and metro areas; zero churn.",
        "Fed customer feedback into product and partnered with sales on upsell.",
      ],
    },
  ] satisfies CvRole[],
  skills: [
    { label: "AI & agentic systems", text: "multi-agent architecture, MCP, RAG, orchestration, evaluation by design, human-in-the-loop." },
    { label: "Build & ship", text: "Claude Code, FastAPI, PostgreSQL, REST APIs, OAuth2, n8n, Make, Docker, Fly.io." },
    { label: "Discovery & delivery", text: "0-to-1 discovery (OST), workflow mapping, adoption metrics, Shape Up, Kanban." },
    { label: "Cross-functional leadership", text: "stakeholder alignment up to C-level, change management, training across technical and non-technical teams." },
    { label: "Field", text: "front-of-house experience in restaurants (waiter, bartender, barista)." },
    { label: "Languages", text: "English fluent (TOEIC 980/990), French native." },
  ] satisfies CvSkill[],
  education: [
    "Service Design, Interaction Design Foundation · 2020",
    "MSc Management & Entrepreneurship, Agro, IHEDREA · 2012 – 2017",
  ],
} as const;

export const CV_PROJECT_LINKS: Record<string, string> = {
  Aetherix: "/aetherix",
  Anima: "/anima",
  Compass: "/compass",
  Sonor: "/sonor",
};