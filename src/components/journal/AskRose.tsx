import { Icon } from "@/components/ui/Icon";

/**
 * Ready prompts that open the Rose dock pre-filled. The dock listens for the
 * "rose:ask" event, so this component stays presentational.
 */
export const AskRose = ({
  prompts,
  label = "Ask Rose about this piece",
  note,
}: {
  prompts: string[];
  label?: string;
  note?: string;
}) => {
  const ask = (text: string) => {
    window.dispatchEvent(new CustomEvent("rose:ask", { detail: { text } }));
  };

  return (
    <section
      aria-label={label}
      className="rounded-sm border border-outline-variant bg-surface-container-lowest p-5 md:p-6 not-italic print:hidden"
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon name="forum" className="text-secondary text-[20px] leading-none" />
        <span className="font-label uppercase tracking-[0.2em] text-[10px] text-secondary">{label}</span>
      </div>
      {note && <p className="font-body font-light text-sm text-on-surface-variant mb-4">{note}</p>}
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {prompts.map((prompt) => (
          <li key={prompt}>
            <button
              type="button"
              onClick={() => ask(prompt)}
              className="w-full text-left rounded-sm border border-outline-variant bg-surface-container-low px-4 py-2.5 font-body text-sm text-on-surface-variant transition-colors duration-300 hover:border-secondary hover:text-primary"
            >
              {prompt}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AskRose;
