// Source of truth for facts (dates, stack, status).
// If you change facts here, also update public/lore.md.
import { TransitionLink as Link } from "@/hooks/useViewTransition";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CaseAnchors } from "@/components/case/CaseAnchors";
import { Seo } from "@/components/Seo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/Reveal";
import { SectionDivider } from "@/components/SectionDivider";
import { SOCIAL_LINKS } from "@/content/site";
import { Term } from "@/components/Term";
import { LoreHeroBadges } from "@/components/lore/LoreHeroBadges";
import { LoreThreeModes } from "@/components/lore/LoreThreeModes";
import { LoreHangarDialogue } from "@/components/lore/LoreHangarDialogue";
import { LoreMemoryThread } from "@/components/lore/LoreMemoryThread";
import { LoreSopConflictCard } from "@/components/lore/LoreSopConflictCard";
import { LoreTierTable } from "@/components/lore/LoreTierTable";
import { LoreHonestyBlock } from "@/components/lore/LoreHonestyBlock";
import { LoreStatBand } from "@/components/lore/LoreStatBand";
import { LoreWhatItIsFor } from "@/components/lore/LoreWhatItIsFor";

const REPO = "https://github.com/IvandeMurard/Lore";

const PROJECT_INFO: { label: string; value: string; href?: string; hint?: string; wide?: boolean }[] = [
  { label: "Role", value: "Product Builder, evaluation & safety engineering" },
  { label: "Origin", value: "Speechmatics × AI Collective Paris, 28 Feb – 1 Mar 2026" },
  { label: "Team", value: "V1 built by a team of four, developed solo since" },
  { label: "Repository", value: "GitHub Repository", href: REPO, hint: "Public repo, tag v0.1-hackathon" },
  { label: "Status", value: "Prototype. Synthetic procedures, mock aircraft data, evaluation harness in CI", wide: true },
];

const STACK: { layer: string; tech: string }[] = [
  { layer: "Voice in", tech: "Speechmatics real-time STT, noise-robust" },
  { layer: "Reasoning", tech: "OpenAI GPT-4o" },
  { layer: "Memory and retrieval", tech: "Backboard, thread per aircraft and per technician" },
  { layer: "Voice out", tech: "OpenAI TTS" },
  { layer: "Frontend", tech: "Next.js 14, TypeScript, Tailwind" },
  { layer: "Deploy", tech: "Vercel" },
];

const LORE_SECTIONS = [
  { id: "loss", label: "The loss" },
  { id: "modes", label: "Three modes" },
  { id: "hangar", label: "The hangar" },
  { id: "thesis", label: "Same thesis" },
  { id: "hazard", label: "The hazard" },
  { id: "admissible", label: "Admissible" },
  { id: "evaluation", label: "Evaluation" },
  { id: "purpose", label: "What it is for" },
  { id: "honesty", label: "Honestly" },
  { id: "contact", label: "Stack & links" },
];

const Lore = () => (
  <SiteLayout title="Lore: A Living Memory for Aviation Maintenance" sections={LORE_SECTIONS}>
    <Seo
      title="Lore, Voice AI Mentor for Aviation Maintenance"
      description="The knowledge retiring technicians carry isn't in any manual. Lore captures a senior's oral expertise by voice and gives it back to a junior on the shop floor, never contradicting the procedure."
      path="/lore"
      type="article"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: "Lore",
          headline: "Lore, a living memory for a trade that is handed down out loud",
          description:
            "Voice AI mentor for aviation maintenance. Lore elicits what a retiring technician never wrote down, files it against the airframe and conditions it applies to, and returns it to a junior by voice, always behind the procedure.",
          url: "https://ivandemurard.com/lore",
          about: [
            "Institutional Memory",
            "Tacit Knowledge",
            "Aviation Maintenance",
            "Voice AI",
            "Evaluation Harness",
          ],
          creator: { "@type": "Person", name: "Ivan de Murard", url: "https://ivandemurard.com" },
          dateCreated: "2026-02-28",
          codeRepository: REPO,
          relatedLink: ["https://ivandemurard.com/aetherix"],
        },
      ]}
    />
    <div className="pt-32">
      {/* Hero */}
      <Reveal as="header" className="px-6 md:px-12 mb-12 md:mb-16">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row items-end gap-12 lg:gap-16">
          <div className="flex-1">
            <span
              data-reveal-child
              className="text-secondary font-label uppercase tracking-[0.2em] text-[10px] mb-6 block"
            >
              Case Study / Voice AI
            </span>
            <h1
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "120ms" }}
              className="headline-ink font-headline text-5xl md:text-7xl lg:text-8xl text-primary italic leading-[0.95] tracking-tight mb-6"
            >
              Lore
            </h1>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "200ms" }}
              className="font-headline italic text-primary text-2xl md:text-3xl max-w-3xl leading-tight mb-6"
            >
              The knowledge retiring technicians carry isn't in any manual.
            </p>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "280ms" }}
              className="text-on-surface-variant font-body text-lg max-w-2xl leading-relaxed"
            >
              A living memory for a trade that is handed down out loud.
            </p>
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "380ms" }}>
              <LoreHeroBadges />
            </div>
            <div data-reveal-child style={{ ["--reveal-delay" as string]: "440ms" }} className="mt-8">
              <EntryActions title="Lore" markdownPath="/lore.md" variant="case" />
            </div>
          </div>
          <div className="hidden lg:flex flex-none items-center gap-4 text-secondary italic font-headline text-2xl pb-4">
            <span>Scroll to Explore</span>
            <Icon name="expand_more" className="animate-bounce" />
          </div>
        </div>
      </Reveal>

      {/* Stat band */}
      <Reveal as="section" className="px-6 md:px-12 mb-12 md:mb-16">
        <div className="max-w-screen-2xl mx-auto">
          <LoreStatBand />
        </div>
      </Reveal>



      <CaseAnchors current="lore" more={{ to: "/architecture", text: "How these systems fit together: the architecture note" }} />

      {/* Project Info */}
      <section className="px-6 md:px-12 mb-12 md:mb-16">
        <div className="max-w-screen-2xl mx-auto border-t border-b border-outline-variant py-10">
          <h2 className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary mb-8">Project Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {PROJECT_INFO.map((info) => (
              <div key={info.label} className={info.wide ? "lg:col-span-2" : ""}>
                <h3 className="text-xs text-on-surface-variant mb-2">{info.label}</h3>
                {info.href ? (
                  <a
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={info.hint}
                    className="text-sm font-medium text-primary inline-flex items-center gap-1.5 border-b border-secondary hover:border-secondary transition-colors"
                  >
                    {info.value}
                    <Icon name="open_in_new" className="text-xs" />
                  </a>
                ) : (
                  <p className="text-sm font-medium text-primary">{info.value}</p>
                )}
                {info.hint && <p className="mt-1 text-[10px] text-on-surface-variant italic">{info.hint}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider label="The loss" index="01" />

      {/* THE LOSS */}
      <Reveal as="section" id="loss" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
            Why it exists
          </span>
          <h2
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "120ms" }}
            className="font-headline italic text-3xl md:text-5xl text-primary mt-4 leading-tight"
          >
            Not retrieval, elicitation.
          </h2>
          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "240ms" }}
            className="mt-6 space-y-5 text-on-surface-variant leading-relaxed"
          >
            <p>
              Every senior who retires takes decades of contextual knowledge with them: the exceptions, the quirks of
              one specific airframe, the patterns a manual cannot hold because nobody thought to write them down.
            </p>
            <p>
              The tools that exist do <Term id="rag">RAG</Term> on explicit documents: manuals, standard procedures,
              service bulletins. Zymbly, LexX, AWS Q. They retrieve what somebody already put in.{" "}
              <span className="text-on-surface font-medium">
                None of them capture what a senior never thought to write.
              </span>
            </p>
            <p className="font-headline italic text-primary text-lg leading-snug">
              That is the gap. Not retrieval, elicitation.
            </p>
            <p className="text-sm">
              What is missing is <Term id="tacitKnowledge">tacit knowledge</Term>, the part of an{" "}
              <Term id="mro">MRO</Term> trade that lives in the people doing it.
            </p>
          </div>
        </div>
      </Reveal>

      <SectionDivider label="Three modes" index="02" />

      {/* THREE MODES */}
      <Reveal as="section" id="modes" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
              Capture, query, log. All by voice.
            </h2>
          </div>
          <LoreThreeModes />
        </div>
      </Reveal>

      <SectionDivider label="The hangar, 23:00" index="03" />

      {/* HANGAR DIALOGUE */}
      <Reveal as="section" id="hangar" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <h2
            data-reveal-child
            className="font-headline italic text-3xl md:text-5xl text-primary leading-tight"
          >
            The hangar, 23:00.
          </h2>
          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "140ms" }}
            className="mt-6 mb-10 space-y-4 text-on-surface-variant leading-relaxed max-w-2xl"
          >
            <p>
              Night shift. Thomas is two years in, working a scheduled check on F-GKXA. He finds a vibration that is not
              on the job card.
            </p>
            <p>
              There are other people in the hangar. None of them worked this airframe for twenty-six years. Marc did,
              and Marc retired in March.
            </p>
          </div>
          <LoreHangarDialogue />
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "700ms" }}
            className="mt-8 font-headline italic text-primary text-xl md:text-2xl leading-snug"
          >
            Marc has been retired for four months. He answered anyway.
          </p>
        </div>
      </Reveal>

      <SectionDivider label="Same thesis, one industry over" index="04" />

      {/* SAME THESIS */}
      <Reveal as="section" id="thesis" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-3xl mb-10">
            <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
              The thread
            </span>
            <h2
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "120ms" }}
              className="font-headline italic text-3xl md:text-5xl text-primary mt-4 leading-tight"
            >
              The same thesis as Aetherix, one industry over.
            </h2>
            <p
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "240ms" }}
              className="mt-6 text-on-surface-variant leading-relaxed"
            >
              What separates them is the cost of being wrong. In hospitality it compounds quietly: food thrown away, a
              shift overstaffed while another runs short, a new manager taking a year to learn what the last one knew, a
              guest who meets the consequences before anyone in the building does. In maintenance it does not compound.
              A wrong figure touches <Term id="airworthiness">airworthiness</Term> on the first occurrence.
            </p>
          </div>
          <LoreMemoryThread />
        </div>
      </Reveal>

      <SectionDivider label="The hazard" index="05" />

      {/* HAZARD */}
      <Reveal as="section" id="hazard" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
            The hazard nobody else has.
          </h2>
          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "160ms" }}
            className="mt-6 mb-10 space-y-5 text-on-surface-variant leading-relaxed"
          >
            <p>
              A junior with a manual has the limits but not the judgement. A junior with a senior on shift has both,
              which is why shops have always run that way.
            </p>
            <p>
              Lore's bet is that{" "}
              <span className="text-on-surface font-medium">the second half survives the person</span>. What it
              surfaces is a named technician's judgement about a specific airframe, in the same breath as the procedure
              that governs it, never instead of it.
            </p>
            <p>
              That is also the part that has to be engineered rather than promised. Oral knowledge is trusted{" "}
              <em className="italic">and</em> sits partly outside the manual, so the only acceptable design is one where
              the procedure always wins and the judgement always arrives attributed.
            </p>
            <p>
              It is not hypothetical. It is already in the demo data, where a senior's judgement sits next to the{" "}
              <Term id="amm">AMM</Term>.
            </p>
          </div>
          <LoreSopConflictCard />
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "320ms" }}
            className="mt-8 text-on-surface-variant leading-relaxed"
          >
            These are not contrived conflicts. They are what happens when you put a real expert's judgement next to a
            manual, which is the entire product.
          </p>
        </div>
      </Reveal>

      <SectionDivider label="What makes an answer admissible" index="06" />

      {/* ADMISSIBLE */}
      <Reveal as="section" id="admissible" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
            What makes an answer admissible.
          </h2>
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "140ms" }}
            className="mt-6 text-on-surface-variant leading-relaxed"
          >
            Two rules, neither designed in advance. They are not a defence against a bad model, they are the condition
            under which used knowledge can be counted at all: a system that invents figures or manufactures agreement
            would feed the loop noise and call it evidence.
          </p>

          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "260ms" }}
            className="mt-10 border-t border-outline-variant pt-8"
          >
            <h3 className="font-headline italic text-2xl text-primary leading-tight">The refusal contract.</h3>
            <p className="mt-4 text-on-surface-variant leading-relaxed">
              Eight rules, written because "say so honestly" was not enough: early on the model refused correctly and
              then volunteered "36 fan blades" anyway, and elsewhere answered about one tail number using a different
              aircraft's borescope record. Honesty about the gap did not stop it filling the gap. The rules now say it
              plainly: no figure absent from the sources, no other aircraft's record, no general engine knowledge, no
              unnamed source, no claimed consensus.
            </p>
          </div>

          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "380ms" }}
            className="mt-8 border-t border-outline-variant pt-8"
          >
            <h3 className="font-headline italic text-2xl text-primary leading-tight">
              The closing sentence is enforced in code, not in the prompt.
            </h3>
            <p className="mt-4 text-on-surface-variant leading-relaxed">
              Every maintenance answer ends with{" "}
              <span className="font-headline italic text-primary">
                "Always verify the AMM procedure before intervening."
              </span>{" "}
              Asked to close with it and also ask a follow-up, the model reliably ordered them the wrong way round, so
              the reminder read as if it applied to the pleasantry. The safety documentation calls that sentence
              non-removable, which is a claim about code, so code now holds it.
            </p>
          </div>
        </div>
      </Reveal>

      <SectionDivider label="How we know it holds" index="07" />

      {/* EVALUATION */}
      <Reveal as="section" id="evaluation" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
            How we know it holds.
          </h2>
          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "160ms" }}
            className="mt-6 mb-10 space-y-5 text-on-surface-variant leading-relaxed"
          >
            <p>
              The failure mode here is not a crash. It is a syntactically perfect answer that gives a technician the
              wrong threshold. Test coverage cannot see that, so the answers get graded instead of the code.
            </p>
            <p>
              <span className="text-on-surface font-medium">
                64 cases across 12 categories. 9 <Term id="grader">graders</Term>, every one a pure function
              </span>
              , because a grader that needs a model to decide cannot gate a safety property: it fails the same way as
              the thing it grades. The tiers below are not an inventory of what goes wrong. They are the standing
              conditions under which an answer, and later the record of how it was used, can be trusted.
            </p>
          </div>
          <LoreTierTable />
          <p
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "320ms" }}
            className="mt-10 font-headline italic text-primary text-xl md:text-2xl leading-snug max-w-3xl"
          >
            One run scored 52 out of 53 and was declared a failure, because the single miss was in tier 1.
          </p>
          <Link
            data-reveal-child
            to="/journal/harnesses-graders-closed-loops"
            className="mt-8 flex items-start gap-4 px-6 py-5 rounded-2xl border border-outline-variant bg-surface-container-low hover:bg-surface-container transition-colors"
          >
            <Icon name="arrow_forward" className="text-secondary text-base mt-1" />
            <span className="text-primary">
              <span className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary block mb-2">
                Field note
              </span>
              <span className="font-headline italic text-xl md:text-2xl leading-snug block">
                Harnais, graders, boucles fermées
              </span>
              <span className="block mt-2 text-sm text-on-surface-variant leading-relaxed">
                The full protocol: how the 9 graders were written, why every one is deterministic, and how the
                acceptance tiers came out of runs that failed.
              </span>
            </span>
          </Link>
        </div>
      </Reveal>

      <SectionDivider label="What it is for" index="08" />

      {/* WHAT IT IS FOR */}
      <Reveal as="section" id="purpose" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-screen-2xl mx-auto">
          <div className="max-w-3xl mb-10 md:mb-12">
            <span data-reveal-child className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary">
              The vision
            </span>
            <h2
              data-reveal-child
              style={{ ["--reveal-delay" as string]: "120ms" }}
              className="font-headline italic text-3xl md:text-5xl text-primary mt-4 leading-tight"
            >
              What it is for.
            </h2>
          </div>
          <LoreWhatItIsFor />
        </div>
      </Reveal>

      <SectionDivider label="Where it stands" index="09" />

      {/* HONESTY */}
      <Reveal as="section" id="honesty" className="px-6 md:px-12 mb-12 md:mb-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight mb-10">
            Where it stands, honestly.
          </h2>
          <LoreHonestyBlock />
        </div>
      </Reveal>

      <SectionDivider label="Role & team" index="10" />

      {/* ROLE & TEAM */}
      <Reveal as="section" className="px-6 md:px-12 mb-12 md:mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight">
            Role and team.
          </h2>
          <div
            data-reveal-child
            style={{ ["--reveal-delay" as string]: "160ms" }}
            className="mt-6 space-y-5 text-on-surface-variant leading-relaxed"
          >
            <p>
              V1 was built in <span className="text-on-surface font-medium">24 hours by a team of four</span>, 43
              commits, from the first line of code to the demo on stage. That build is frozen at the{" "}
              <span className="font-label uppercase tracking-[0.15em] text-xs text-secondary">v0.1-hackathon</span> tag.
            </p>
            <p>
              Everything since, the evaluation harness, the refusal contract, the acceptance tiers, the CI gate, is
              mine.
            </p>
            <p>
              <a
                href="https://github.com/IvandeMurard/Lore/blob/main/AUTHORS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-1.5 border-b border-secondary hover:border-secondary transition-colors"
              >
                AUTHORS.md
                <Icon name="open_in_new" className="text-xs" />
              </a>
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" className="px-6 md:px-12 mb-8 md:mb-10">
        <div className="max-w-4xl mx-auto">
          <p className="font-body text-on-surface-variant leading-relaxed">
            Lore sits outside the Hospitality Agentic Mesh, but shares its architecture:{" "}
            <Link
              to="/architecture"
              className="text-primary border-b border-secondary hover:opacity-70 transition-opacity"
            >
              the architecture note
            </Link>{" "}
            explains why.
          </p>
        </div>
      </Reveal>

      <SectionDivider label="Stack & links" index="11" />

      {/* STACK & LINKS */}
      <Reveal as="section" id="contact" className="px-6 md:px-12 mb-24 md:mb-32 scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <h2 data-reveal-child className="font-headline italic text-3xl md:text-5xl text-primary leading-tight mb-10">
            Stack and links.
          </h2>
          <div
            data-reveal-child
            className="rounded-2xl border border-outline-variant bg-surface-container-low overflow-hidden"
          >
            <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Stack and links table">
              <table className="w-full min-w-[32rem] border-collapse text-left">
                <caption className="sr-only">Lore technical stack by layer and technology</caption>
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th scope="col" className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary px-6 py-4">
                      Layer
                    </th>
                    <th scope="col" className="font-label uppercase tracking-[0.25em] text-[10px] text-secondary px-6 py-4">
                      Technology
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {STACK.map((s) => (
                    <tr key={s.layer} className="border-b border-outline-variant last:border-0 align-top">
                      <td className="px-6 py-4 text-on-surface-variant">{s.layer}</td>
                      <td className="px-6 py-4 text-on-surface">
                        {s.layer === "Voice in" ? (
                          <>
                            Speechmatics real-time <Term id="stt">STT</Term>, noise-robust
                          </>
                        ) : (
                          s.tech
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div data-reveal-child style={{ ["--reveal-delay" as string]: "240ms" }} className="mt-10 flex flex-wrap gap-4">
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-opacity"
            >
              <Icon name="code" className="text-base" />
              Repository
            </a>
            <Link
              to="/aetherix"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-primary font-label uppercase tracking-[0.2em] text-xs hover:bg-surface-container-low transition-colors"
            >
              <Icon name="arrow_forward" className="text-base" />
              Read Aetherix
            </Link>
            <Link
              to="/journal/harnesses-graders-closed-loops"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-primary font-label uppercase tracking-[0.2em] text-xs hover:bg-surface-container-low transition-colors"
            >
              <Icon name="rule" className="text-base" />
              Evaluation protocol
            </Link>
            <a
              href={SOCIAL_LINKS.schedule}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-primary font-label uppercase tracking-[0.2em] text-xs hover:bg-surface-container-low transition-colors"
            >
              <Icon name="event" className="text-base" />
              Contact
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  </SiteLayout>
);

export default Lore;
