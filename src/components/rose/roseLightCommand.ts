import type { Mood } from "@/components/MoodProvider";

/** Only standalone, explicit site-control requests, never questions about the work. */
export const roseLightCommand = (text: string): { mood: Mood; answer: string } | null => {
  const normalized = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[’'-]/g, " ").replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim()
    .replace(/^(?:rose[, ]+|peux tu |pourrais tu |can you |could you |please )+/g, "")
    .replace(/(?: s il te plait| svp| please)$/, "").trim();
  if (/^(?:allume(?:r)? (?:la lumiere|les lumieres)|(?:mets|passe)(?: en)? (?:mode )?jour)$/.test(normalized)) {
    return { mood: "day", answer: "La lumière est allumée." };
  }
  if (/^(?:(?:eteins|eteindre) (?:la lumiere|les lumieres)|(?:tamise|baisse) (?:la lumiere|les lumieres)|(?:mets|passe)(?: en)? (?:mode )?(?:dusk|crepuscule|nuit))$/.test(normalized)) {
    return { mood: "dusk", answer: "La lumière est tamisée." };
  }
  if (/^(?:turn (?:on|up) (?:the )?lights?|turn (?:the )?lights? (?:on|up)|(?:set|switch to) (?:the )?(?:day|light)(?: mode)?)$/.test(normalized)) {
    return { mood: "day", answer: "The lights are on." };
  }
  if (/^(?:turn off (?:the )?lights?|turn (?:the )?lights? off|dim (?:the )?lights?|(?:set|switch to) (?:the )?(?:dusk|dark)(?: mode)?)$/.test(normalized)) {
    return { mood: "dusk", answer: "The lights are dimmed." };
  }
  return null;
};