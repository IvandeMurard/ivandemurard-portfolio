import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { Icon } from "@/components/ui/Icon";
import { Term } from "@/components/Term";

/**
 * The shared thesis between Aetherix and Lore: institutional memory
 * that lives in one head and leaves with it.
 */
export const LoreMemoryThread = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div
      data-reveal-child
      className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-8"
    >
      <span className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">Hospitality</span>
      <h3 className="font-headline italic text-2xl text-primary mt-3 leading-tight">A manager resigns.</h3>
      <p className="mt-4 text-on-surface-variant leading-relaxed">
        Aetherix exists because most hotels lose critical knowledge every time a manager leaves. A bad forecast wastes
        food and overstaffs a Tuesday.
      </p>
      <Link
        to="/aetherix"
        className="mt-6 inline-flex items-center gap-2 text-sm text-primary border-b border-secondary/40 hover:border-secondary transition-colors"
      >
        Read the Aetherix case study
        <Icon name="arrow_forward" className="text-base" />
      </Link>
    </div>
    <div
      data-reveal-child
      style={{ ["--reveal-delay" as string]: "140ms" }}
      className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-8"
    >
      <span className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">Aviation maintenance</span>
      <h3 className="font-headline italic text-2xl text-primary mt-3 leading-tight">A technician retires.</h3>
      <p className="mt-4 text-on-surface-variant leading-relaxed">
        Lore exists because the same thing happens when a senior retires. A bad answer touches{" "}
        <Term id="airworthiness">airworthiness</Term>.
      </p>
      <p className="mt-4 text-sm text-on-surface-variant leading-relaxed">
        Same architecture of memory, one notch tighter on every guarantee, which is why the evaluation protocol got
        built here first and hardest.
      </p>
    </div>
    <p
      data-reveal-child
      style={{ ["--reveal-delay" as string]: "280ms" }}
      className="lg:col-span-2 font-headline italic text-primary text-xl md:text-2xl leading-snug"
    >
      A manager who resigns and a technician who retires are the same loss wearing different clothes: institutional
      memory that lives in one head and leaves with it.
    </p>
  </div>
);

export default LoreMemoryThread;
