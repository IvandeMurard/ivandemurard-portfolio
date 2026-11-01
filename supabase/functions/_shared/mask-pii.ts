// Pattern-based masking of personal details in typed questions, applied before they are stored.
// Pure and import-free so the edge function and the unit tests share one implementation.
// Masking is by pattern: unusual formats can slip through and names are not masked.
// Each class has its own label. Order matters: the more specific patterns run first so a card
// number is never reported as a phone number, nor an IP address as one.

const NAME = "[\\p{L}'’-]+";
const FR_STREET = "(?:rue|avenue|av|boulevard|bd|chemin|impasse|allée|allee|place|quai|route|cours|passage|square|cité|cite|villa)";
const EN_STREET = "(?:Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Place|Pl|Square|Sq|Close|Terrace|Gardens|Crescent)";

/** Luhn checksum over a string of digits. */
export const luhnValid = (digits: string): boolean => {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return digits.length > 0 && sum % 10 === 0;
};

/** ISO 13616 mod-97 check over a compact IBAN. */
export const ibanValid = (compact: string): boolean => {
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(compact)) return false;
  const moved = compact.slice(4) + compact.slice(0, 4);
  let rem = 0;
  for (const ch of moved) {
    const v = ch >= "A" ? String(ch.charCodeAt(0) - 55) : ch;
    for (const c of v) rem = (rem * 10 + Number(c)) % 97;
  }
  return rem === 1;
};

const EMAIL = /[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/gi;
const URL_SCHEME = /\b(?:https?:\/\/|www\.)[^\s<>"']*[^\s<>"'.,;:!?)\]]/gi;
const URL_BARE = /\b(?:[a-z0-9-]+\.)+(?:com|fr|org|net|io|ai|co|me|app|dev|eu|uk|de|ch|be|info|tech|xyz)\/[^\s<>"']*[^\s<>"'.,;:!?)\]]/gi;
const IBAN_CANDIDATE = /\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){2,7}(?:\s?[A-Z0-9]{1,3})?\b/gi;
const CARD_CANDIDATE = /\b\d(?:[ -]?\d){12,18}\b/g;
const IPV4 = /(?<![\d.])(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?!\d|\.\d)/g;
const IPV6_FULL = /\b(?:[0-9a-f]{1,4}:){7}[0-9a-f]{1,4}\b/gi;
const IPV6_COMPRESSED = /\b(?:[0-9a-f]{1,4}:){1,6}(?::[0-9a-f]{1,4}){1,6}(?![\w:])|\b(?:[0-9a-f]{1,4}:){1,7}:(?![\w:])/gi;
const PHONE = /\+?\d[\d\s().-]{7,}\d/g;

// French: "12 rue de la Paix, 75002 Paris". Words after the street type are taken up to four,
// so a trailing word can occasionally be masked with the address.
const ADDRESS_FR = new RegExp(
  `\\b\\d{1,4}(?:\\s?(?:bis|ter))?,?\\s+${FR_STREET}\\.?\\s+${NAME}(?:\\s+${NAME}){0,3}(?:,?\\s*\\d{5}\\s+${NAME}(?:[ -]${NAME})?)?`,
  "giu",
);
// English: capitalised street names only, so "In 2026 the street view shipped" is left alone.
const ADDRESS_EN = new RegExp(
  `\\b\\d{1,5}[A-Za-z]?\\s+(?:\\p{Lu}[\\p{L}'’.-]*\\s+){1,3}${EN_STREET}\\b\\.?(?:,?\\s*[A-Z]{1,2}\\d[A-Z\\d]?\\s*\\d[A-Z]{2}\\b)?`,
  "gu",
);

/** Masks the longest valid prefix of a digit-run, keeping any remainder. */
const maskCards = (text: string): string =>
  text.replace(CARD_CANDIDATE, (match) => {
    const digits = match.replace(/\D/g, "");
    for (let len = Math.min(19, digits.length); len >= 13; len--) {
      if (!luhnValid(digits.slice(0, len))) continue;
      // Map the digit count back to a position in the original text.
      let seen = 0, end = 0;
      for (; end < match.length && seen < len; end++) if (/\d/.test(match[end])) seen++;
      return `[card masked]${match.slice(end)}`;
    }
    return match;
  });

/** Same idea for IBANs, where a following word can look like another group of four. */
const maskIbans = (text: string): string =>
  text.replace(IBAN_CANDIDATE, (match) => {
    const compact = match.replace(/\s/g, "").toUpperCase();
    for (let len = Math.min(34, compact.length); len >= 15; len--) {
      if (!ibanValid(compact.slice(0, len))) continue;
      let seen = 0, end = 0;
      for (; end < match.length && seen < len; end++) if (/\S/.test(match[end])) seen++;
      return `[IBAN masked]${match.slice(end)}`;
    }
    return match;
  });

const maskIpv6 = (text: string): string =>
  text
    .replace(IPV6_FULL, "[IP masked]")
    // A compressed form needs a group of two or more hex digits, so "a::b" or a time like "12:30:45" stay.
    .replace(IPV6_COMPRESSED, (m) => (/[0-9a-f]{2,}/i.test(m) ? "[IP masked]" : m));

export const maskPii = (text: string): string => {
  const withoutLinks = text
    .replace(EMAIL, "[email masked]")
    .replace(URL_SCHEME, "[link masked]")
    .replace(URL_BARE, "[link masked]");
  return maskIpv6(maskCards(maskIbans(withoutLinks)))
    .replace(IPV4, "[IP masked]")
    .replace(ADDRESS_FR, "[address masked]")
    .replace(ADDRESS_EN, "[address masked]")
    .replace(PHONE, "[phone masked]");
};
