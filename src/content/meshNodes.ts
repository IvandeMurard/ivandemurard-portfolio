// Source of truth for the five mesh agents.
// Used by the section 03 table and by the Mesh Blueprint figure on /architecture.
// If you change facts here, also update public/architecture.md.

export type MeshNodeState = "built" | "poc" | "design";

export interface MeshNode {
  node: string;
  status: string;
  owns: string;
  not: string;
  state: MeshNodeState;
  to?: string;
}

export const MESH_NODES: MeshNode[] = [
  {
    node: "Aetherix",
    status: "Built · 0 real users · forecast in shadow mode · pilot partner in recruitment",
    owns: "F&B execution: covers forecast, staffing grid, waste risk, per-property memory",
    not: "Orchestration, pricing, guest-facing anything",
    state: "built",
    to: "/aetherix",
  },
  {
    node: "Tacet",
    status: "Built · maintenance mode since July 2026",
    owns: "External signal: weather, street, events, ray-traced acoustic impact, yield rules",
    not: "Deciding anything. It publishes rules for approval",
    state: "built",
    to: "/tacet",
  },
  {
    node: "Anima",
    status: "Synthetic PoC, production DPIA-gated",
    owns: "Guest memory: what a guest said and what happened, four layers, each claim with source, confidence and age",
    not: "Acting on it, or returning a whole person: every query declares one layer",
    state: "poc",
    to: "/anima",
  },
  {
    node: "Peritia",
    status: "Design",
    owns: "House knowledge: what the people who work in a property know and never wrote down",
    not: "Everything. It is a named slot in the contract, and no code",
    state: "design",
  },
  {
    node: "Orchestrator",
    status: "Design · stateless router, no memory",
    owns: "Supervisory routing and business rules across agents",
    not: "Domain logic and memory. It routes, it does not compute and it stores nothing",
    state: "design",
  },
];
