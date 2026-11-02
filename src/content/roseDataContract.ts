/**
 * The official short form of the Rose data contract (full text: /privacy, and the sentences checked in
 * src/test/roseDataContractWording.test.ts). Every surface that has room for one line only uses this
 * constant: the text before the link, the link label and its target. Never retype it.
 */
const TEXT = "Questions are stored for 90 days";
const LINK_LABEL = "Privacy";

export const ROSE_DATA_SHORT = {
  text: TEXT,
  linkLabel: LINK_LABEL,
  href: "/privacy",
  /** The line as plain text, for places that cannot render a link. */
  line: `${TEXT} · ${LINK_LABEL}`,
} as const;
