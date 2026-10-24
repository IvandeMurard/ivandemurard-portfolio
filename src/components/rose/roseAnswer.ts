import { CAL_URL } from "./roseConfig";

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