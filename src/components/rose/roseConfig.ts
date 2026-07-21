export const CAL_URL = "https://cal.com/ivandemurard/30min";

export const INTENT_CHIPS: Array<{
  intent: "product" | "technical" | "culture" | "exploring";
  label: string;
  message: string;
}> = [
  {
    intent: "product",
    label: "Product expertise",
    message: "I want to understand Ivan's product craft.",
  },
  {
    intent: "technical",
    label: "Technical profile",
    message: "I want to evaluate Ivan's technical profile.",
  },
  {
    intent: "culture",
    label: "Culture fit",
    message: "I want to see if we would work well together.",
  },
  {
    intent: "exploring",
    label: "Just exploring",
    message: "I am just looking around, tell me what matters.",
  },
];
