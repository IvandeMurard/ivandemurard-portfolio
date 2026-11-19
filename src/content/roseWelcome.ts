// Rose's welcome (homepage v2, board K v2, validated by Ivan on 18 Nov 2026). Scripted UI: no model call, never part of
// the conversation. Asset-free: the component and the tests read it.

export const ROSE_WELCOME = {
  text: "Welcome, make yourself comfortable. Sadly, I can't offer you a drink, but I can dim the lights or put on a record.",
  dim: "Dim the lights",
  up: "Turn the lights up",
  record: "Put on a record",
  decline: "No thanks",
} as const;

// The homepage card's "Ask Rose": a text put in the dock's input and selected, never sent. The reader decides.
export const ROSE_HOME_PREFILL = "How were you built?";
