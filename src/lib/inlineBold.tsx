import { Fragment, type ReactNode } from "react";

/**
 * Renders **x** as <strong>x</strong> in a plain string, and nothing else: no other markdown, no HTML. The text goes
 * through React as text, so it cannot inject markup. The raw markdown stays in the content and in the MCP output,
 * where it is correct; this is only for places that render a content string on screen.
 */
export const renderBold = (text: string): ReactNode => {
  const parts = text.split(/\*\*([^*]+)\*\*/);
  if (parts.length === 1) return text;
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>));
};

/** The same text with the ** markers removed, for an aria-label or a title. */
export const stripBold = (text: string): string => text.replace(/\*\*([^*]+)\*\*/g, "$1");
