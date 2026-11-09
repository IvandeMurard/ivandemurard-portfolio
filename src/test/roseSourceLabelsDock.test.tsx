import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RoseDock } from "@/components/rose/RoseDock";
import { resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { sourceLabelsLoaded } from "@/lib/sourceLinks";

// Each test needs the registry not loaded yet, and module state lasts for a file: one file per trigger.
class NoopObserver { observe() {} unobserve() {} disconnect() {} }

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  window.sessionStorage.clear();
  resetRoseChat("test").messages = [];
  setRoseOpen(false);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("The dock loads the label registry", () => {
  it("when it opens, and not before", async () => {
    render(<MemoryRouter><RoseDock roseStatus="live" /></MemoryRouter>);
    expect(sourceLabelsLoaded()).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: /^(Open Rose|Reopen the conversation with Rose)$/ }));
    await waitFor(() => expect(sourceLabelsLoaded()).toBe(true));
  });
});
