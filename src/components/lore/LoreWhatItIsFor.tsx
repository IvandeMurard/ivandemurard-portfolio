import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { Icon } from "@/components/ui/Icon";
import { Term } from "@/components/Term";

/**
 * The vision section: what accompanied autonomy means, why the three modes
 * form one circuit, what an aircraft's own reasoning is worth, and where
 * the same loss shows up outside aviation.
 */
export const LoreWhatItIsFor = () => (
  <div className="space-y-12 md:space-y-16">
    {/* Accompanied autonomy */}
    <div data-reveal-child>
      <h3 className="font-headline italic text-2xl md:text-3xl text-primary leading-tight">Accompanied autonomy</h3>
      <div className="mt-5 space-y-5 text-on-surface-variant leading-relaxed max-w-3xl">
        <p>
          Lore does not shorten certification and does not sign anything. It shortens the distance between being
          certified and being sure.
        </p>
        <p>
          A junior works at the edge of their competence when the net is there, and waits when it is not. Waiting is the
          cost: the escalation raised out of caution, the interesting task quietly given to someone else, the question
          not asked because asking twice in an hour has a price. Competence grows by doing things slightly too hard,
          which only happens when a mistake gets caught.
        </p>
        <p>
          <span className="text-on-surface font-medium">
            Target: cut time-to-autonomy on an engine type by 30%.
          </span>{" "}
          The lever is not working faster. It is removing the wait between a question and the person who already
          answered it.
        </p>
      </div>
    </div>

    {/* Three modes, one circuit */}
    <div data-reveal-child style={{ ["--reveal-delay" as string]: "120ms" }}>
      <h3 className="font-headline italic text-2xl md:text-3xl text-primary leading-tight">Three modes, one circuit</h3>
      <div className="mt-5 space-y-5 text-on-surface-variant leading-relaxed max-w-3xl">
        <p>
          Capture, query and log are not three features. They are one circuit, and the third decides whether the other
          two are worth anything.
        </p>
        <p>
          A junior asks. Lore answers with the procedure, the senior's judgement, the aircraft's history. Then he logs
          what he actually did: the reading, the conditions, the call he made. That log is not an archive entry. It is
          evidence about the knowledge that was just used.
        </p>
        <p>
          Marc's observation, acted on once, is one technician's note. Acted on twelve times across four winters with
          the same outcome, it is something the shop knows. And when an outcome contradicts it, the vibration that did
          escalate at 2.4 NU, that has to surface too, rather than sit buried under twelve confirmations.
        </p>
        <p className="font-headline italic text-primary text-lg md:text-xl leading-snug">
          Knowledge that is only ever read decays. Knowledge that is used and measured gets sharper, and the reason to
          trust it stops being who said it and becomes what happened next.
        </p>
      </div>

      <div className="mt-8 max-w-3xl rounded-2xl border border-outline-variant bg-surface-container-low p-6 md:p-8">
        <span className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">The honest state</span>
        <div className="mt-4 space-y-4 text-on-surface-variant leading-relaxed">
          <p>
            The circuit is open today. All three modes work; nothing yet weights an observation by what happened after
            it was used.
          </p>
          <p>
            What already exists is the guardrail. Lore will not state that technicians agree unless two or more
            retrieved sources actually say so, and that rule is held by a deterministic{" "}
            <Term id="grader">check</Term> rather than by asking the model nicely. The rule that will govern the
            counting is in place before the counting. Most products do it the other way round and discover later that
            they manufactured a consensus.
          </p>
        </div>
      </div>
    </div>

    {/* An aircraft keeps its own reasoning */}
    <div data-reveal-child style={{ ["--reveal-delay" as string]: "240ms" }}>
      <h3 className="font-headline italic text-2xl md:text-3xl text-primary leading-tight">
        An aircraft keeps its own reasoning
      </h3>
      <p className="mt-5 text-on-surface-variant leading-relaxed max-w-3xl">
        Not the maintenance log, which records what was done, but the reasoning around it: why this airframe was left
        alone at 2.4 NU in January and escalated at 2.9 in March. Tail number as the unit of memory, rather than one
        technician's recollection.
      </p>
    </div>

    {/* What it opens elsewhere */}
    <div data-reveal-child style={{ ["--reveal-delay" as string]: "360ms" }}>
      <h3 className="font-headline italic text-2xl md:text-3xl text-primary leading-tight">What it opens elsewhere</h3>
      <div className="mt-5 space-y-5 text-on-surface-variant leading-relaxed max-w-3xl">
        <p>
          Aviation is the most demanding case, not the only one. Wherever expertise is oral, specific to one machine,
          and held by a generation on its way out, the same loss occurs: energy and nuclear, rail, process industry,
          shipping, utilities, and operating theatres where technique passes by apprenticeship.
        </p>
        <p>
          That portability is not a projection.{" "}
          <Link
            to="/aetherix"
            className="text-primary border-b border-secondary hover:border-secondary transition-colors"
          >
            Aetherix
          </Link>{" "}
          solves the same loss in hospitality: a manager leaves and takes what they knew about the property. Same
          memory architecture, two industries, two levels of tolerance for being wrong.{" "}
          <span className="text-on-surface font-medium">Built twice, not argued once.</span>
        </p>
      </div>
      <Link
        to="/aetherix"
        className="mt-6 inline-flex items-center gap-2 text-sm text-primary border-b border-secondary hover:border-secondary transition-colors"
      >
        Read the Aetherix case study
        <Icon name="arrow_forward" className="text-base" />
      </Link>
    </div>
  </div>
);

export default LoreWhatItIsFor;
