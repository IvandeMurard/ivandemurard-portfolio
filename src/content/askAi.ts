// The "Ask your AI" entry: where an assistant can be opened with a prompt already in its input, and the words of the
// menu. Light on purpose (no React, no assets): the page (AskAiMenu) and the Markdown mirror generator both read it.
//
// Each prefill URL was opened in a browser before it was kept (see the PR that added this file). The prompt travels in
// the query string, so it must be public text: it is never anything the reader typed.

export const ASSISTANTS: { name: string; href: (prompt: string) => string }[] = [
  { name: "Perplexity", href: (p) => `https://www.perplexity.ai/search?q=${encodeURIComponent(p)}` },
  { name: "ChatGPT", href: (p) => `https://chatgpt.com/?q=${encodeURIComponent(p)}` },
  { name: "Claude", href: (p) => `https://claude.ai/new?q=${encodeURIComponent(p)}` },
];

export const ASK_AI = { label: "Ask your AI", copy: "Copy the prompt", copied: "Copied!" } as const;
