import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RoseMarkdown } from "@/components/rose/roseMarkdown";
import { loadSourceLabels, sourceLabelsLoaded } from "@/lib/sourceLinks";

// The registry behind the "§" labels is a separate chunk. This file loads it only by hand, in the one test,
// so what a link shows before and after is what a visitor gets. (Vitest isolates module state per file.)

class NoopObserver { observe() {} unobserve() {} disconnect() {} }

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  window.sessionStorage.clear();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const text = "See [the status](/aetherix#where-it-stands).";
const view = (t: string) => <MemoryRouter><RoseMarkdown text={t} /></MemoryRouter>;

describe("The label registry is loaded on demand", () => {
  it("shows Rose's text before it has loaded, and never swaps a label after it rendered", async () => {
    expect(sourceLabelsLoaded()).toBe(false);
    const { rerender } = render(view(text));
    expect(screen.getByRole("link", { name: "the status" }).textContent).toBe("the status");

    await loadSourceLabels();
    expect(sourceLabelsLoaded()).toBe(true);

    // The same link, rendered again (a streaming answer re-renders): it keeps what it showed.
    rerender(view(text));
    expect(screen.getByRole("link").textContent).toBe("the status");

    // A link that renders after the load is labelled.
    cleanup();
    render(view(text));
    expect(screen.getByRole("link").textContent).toBe("§ Where it stands");
  });
});
