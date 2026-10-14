import { forwardRef, MouseEvent, useCallback } from "react";
import {
  Link,
  LinkProps,
  useNavigate,
  type NavigateOptions,
  type To,
} from "react-router-dom";

/**
 * Wraps react-router navigation in document.startViewTransition when supported,
 * so the browser interpolates between the old and new DOM. Falls back to a
 * plain navigation in Firefox or when the user prefers reduced motion.
 */
export function useViewTransitionNavigate() {
  const navigate = useNavigate();

  return useCallback(
    (to: To, options?: NavigateOptions) => {
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const start = (document as Document & {
        startViewTransition?: (cb: () => void) => unknown;
      }).startViewTransition?.bind(document);
      const destination = typeof to === "string" ? to.split(/[?#]/)[0] : to.pathname;
      const rawDocument = window.location.pathname === "/agents" || destination === "/agents";
      if (!start || reduce || rawDocument) {
        navigate(to, options);
        return;
      }
      start(() => {
        navigate(to, options);
      });
    },
    [navigate],
  );
}

/**
 * Drop-in <Link> replacement that triggers a View Transition on click.
 * Preserves modifier-clicks, middle-click, and target=_blank semantics
 * so the browser handles them natively.
 */
export const TransitionLink = forwardRef<HTMLAnchorElement, LinkProps>(
  function TransitionLink({ to, onClick, target, replace, state, ...rest }, ref) {
    const tnav = useViewTransitionNavigate();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (target && target !== "_self") return;
      e.preventDefault();
      tnav(to, { replace, state });
    };

    return (
      <Link ref={ref} to={to} target={target} onClick={handleClick} {...rest} />
    );
  },
);
