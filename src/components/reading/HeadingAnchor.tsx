import { Icon } from "@/components/ui/Icon";

/**
 * Copy-link affordance attached to a heading. Reveals on hover or keyboard
 * focus, copies the absolute URL of the section, and scrolls to it.
 */
export const HeadingAnchor = ({ id, text }: { id: string; text: string }) => (
  <a
    href={`#${id}`}
    aria-label={`Link to section: ${text}`}
    onClick={(e) => {
      e.preventDefault();
      const url = `${window.location.origin}${window.location.pathname}#${id}`;
      window.history.replaceState(null, "", `#${id}`);
      navigator.clipboard?.writeText(url).catch(() => undefined);
      document.getElementById(id)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    }}
    className="ml-2 align-middle inline-flex items-center text-secondary opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus:opacity-100 transition-opacity duration-300 print:hidden"
  >
    <Icon name="link" aria-hidden="true" className="text-base not-italic" />
  </a>
);

export default HeadingAnchor;
