import { CAL_URL } from "./roseConfig";

/** Hide accidental textual tool invocations, not legitimate fenced code examples.
 * The model must call UI tools structurally. This is a rendering safety net,
 * not evidence that the model respected the tool contract.
 */
export const stripLeakedRoseToolCalls = (text: string): string =>
  text.split(/(```[\s\S]*?(?:```|$))/g)
    .map((part, index) => index % 2 === 1 ? part : part.replace(
      /^[ \t]*(?:suggest_followups|propose_booking)\s*\([^\r\n]*\)\s*$/gm, "",
    ))
    .join("")
    .replace(/\n[ \t]+\n/g, "\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();


/** Normalize generated prose only, preserving code and link destinations. */
export const normalizeRoseText = (text: string): string =>
  text.split(/(```[\s\S]*?(?:```|$)|`[^`\n]*`|https?:\/\/[^\s)<>]+|\]\([^\n)]*\))/g)
    .map((part, index) => index % 2 === 1 ? part : part.replace(/\s*\u2014\s*/g, ", "))
    .join("");

/** The CV reading action uses the human page; explicit downloads stay downloads. */
export const roseCvHref = (href: string): string => {
  if (href === "/cv.md" || href === "https://ivandemurard.com/cv.md") return "/cv";
  return href;
};

/** The card owns the calendar action, not model-generated duplicate links. */
export const bookingSafeAnswer = (text: string, hasBookingCard: boolean): string => {
  if (!hasBookingCard) return text;
  return text
    .replace(/\[[^\]\n]*\]\((https:\/\/cal\.com\/[^)\s]+)\)/gi, "")
    .replace(/<?https:\/\/cal\.com\/[^\s<>]+>?/gi, "")
    .split(CAL_URL).join("")
    .replace(/\n[ \t]+\n/g, "\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};