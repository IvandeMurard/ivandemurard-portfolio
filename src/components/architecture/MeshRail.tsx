import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { MESH_ANCHORS } from "@/content/systems";
import { MESH_NODES, type MeshNodeState } from "@/content/meshNodes";

/**
 * Orientation rail for /architecture: the five nodes of the mesh, read as an
 * engraver's survey strip rather than as cards. Statuses come from MESH_NODES
 * so the rail, the table and Fig. 3.1 cannot diverge.
 */

const STATE_LABEL: Record<MeshNodeState, string> = {
  built: "Built",
  poc: "Synthetic PoC",
  design: "Design",
};

const stateOf = (name: string): MeshNodeState =>
  MESH_NODES.find((n) => n.node === name)?.state ?? "design";

/** Hairline status pip: filled for built, half for a proof of concept, open for design. */
const Pip = ({ state }: { state: MeshNodeState }) => (
  <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" aria-hidden="true">
    <circle cx="6" cy="6" r="5" className="fill-none stroke-outline" strokeWidth="1" />
    {state === "built" && <circle cx="6" cy="6" r="2.6" className="fill-secondary" />}
    {state === "poc" && (
      <path d="M6 1.2 A4.8 4.8 0 0 1 6 10.8 Z" className="fill-secondary" opacity="0.8" />
    )}
    {state === "design" && (
      <line x1="2.6" y1="9.4" x2="9.4" y2="2.6" className="stroke-outline" strokeWidth="1" />
    )}
  </svg>
);

export const MeshRail = () => (
  <section aria-label="The five nodes of the mesh" className="px-6 md:px-12 mb-12 md:mb-16">
    <div className="max-w-screen-2xl mx-auto">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">
          Where this sits
        </h2>
        <span className="font-label uppercase tracking-[0.16em] text-[10px] text-on-surface-variant">
          Five nodes · one contract
        </span>
      </div>

      <div className="border-y border-outline-variant">
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 m-0 p-0 list-none divide-y divide-outline-variant lg:divide-y-0 lg:divide-x lg:divide-outline-variant">
          {MESH_ANCHORS.map((item, i) => {
            const state = stateOf(item.name);
            return (
              <li key={item.slug} className="px-0 py-5 lg:px-5 lg:first:pl-0 lg:last:pr-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-label uppercase tracking-[0.18em] text-[10px] text-on-surface-variant tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-outline-variant" aria-hidden="true" />
                  <Pip state={state} />
                  <span className="font-label uppercase tracking-[0.16em] text-[10px] text-secondary">
                    {STATE_LABEL[state]}
                  </span>
                </div>

                {item.to ? (
                  <Link
                    to={item.to}
                    className="font-headline italic text-xl text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="font-headline italic text-xl text-primary">{item.name}</span>
                )}

                <p className="font-body text-sm text-on-surface-variant leading-relaxed mt-2">
                  {item.what}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="font-body text-sm text-on-surface-variant mt-4">
        <Link
          to="/lore"
          className="text-primary border-b border-secondary pb-0.5 hover:opacity-70 transition-opacity"
        >
          Lore
        </Link>{" "}
        sits outside this mesh: the same pattern in aviation maintenance, as a standalone project.
      </p>
    </div>
  </section>
);

export default MeshRail;
