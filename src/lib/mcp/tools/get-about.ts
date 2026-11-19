import { defineTool } from "@lovable.dev/mcp-js";
import { CV } from "../../../content/cv";

const ABOUT = {
  name: "Ivan de Murard",
  site: "https://ivandemurard.com",
  focus:
    "Product builder working on agentic AI systems for hospitality and operations. Full-stack 0 to 1 craft, business value, human interactions.",
  track_record: [
    {
      range: "2024-2025",
      role: "Product Manager, SaaS",
      company: "FORTIL for DomusVi",
      outcome:
        "Key users trained; deployment planned for 500+ users across 100+ establishments and 20 agencies. Led the information-system overhaul across 3 business lines: 10+ legacy tools consolidated and migrated onto one SaaS platform; no-code POC (Airtable, Make) before deployment.",
    },
    {
      range: "2023-2024",
      role: "Product Manager, Data & Operations",
      company: "ALTEN for Bouygues Telecom",
      outcome:
        "Built a data-driven dashboard to track and recover 1.9M EUR of receivables. 40% recovered, adopted by ops teams.",
    },
    {
      range: "2022-2023",
      role: "Customer Success Manager, Public Sector SaaS",
      company: "Opendatasoft",
      outcome:
        "Owned 22 European city and metropolitan clients from onboarding to production. 2 launches, zero churn.",
    },
    {
      range: "2020-2022",
      role: "Co-founder & Product Manager",
      company: "Sonor",
      outcome:
        "0 to 1 B2G SaaS for urban noise mapping (open data). Backed by Matrice and Banque des Territoires, 20K EUR in grants, MVP shipped.",
    },
  ],
  current_builds: ["Aetherix", "Tacet", "Lore", "Paris Compass"],
  cv: {
    page: "https://ivandemurard.com/cv",
    pdf: "https://ivandemurard.com/Ivan_de_Murard_CV.pdf",
    markdown: "https://ivandemurard.com/Ivan_de_Murard_CV.md",
    title: CV.title,
    location: CV.location,
    summary: CV.summary,
    founder_and_builder: CV.founder,
    product_and_customer_roles: CV.product,
    skills: CV.skills,
    education: CV.education,
  },
  links: {
    email: "ivandemurard@gmail.com",
    schedule: "https://cal.com/ivandemurard/discussion-and-introduction",
    linkedin: "https://www.linkedin.com/in/ivandemurard/",
    github: "https://github.com/IvandeMurard",
    x: "https://x.com/IvanMurard",
  },
};

export default defineTool({
  name: "get_about",
  title: "Get about & contact",
  description:
    "Return Ivan de Murard's professional bio and CV: focus, full experience, skills, education, current builds and contact links (email, schedule, LinkedIn, GitHub, X).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(ABOUT, null, 2) }],
    structuredContent: ABOUT,
  }),
});
