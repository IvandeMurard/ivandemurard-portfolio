import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RoseDock } from "@/components/rose/RoseDock";
import { resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { sourceLabelsLoaded } from "@/lib/sourceLinks";

class NoopObserver { observe() {} unobserve() {} disconnect() {} }

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  window.sessionStorage.clear();
  resetRoseChat("test").messages = [];
  setRoseOpen(false);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("The dock loads the label registry", () => {
  it("when Rose is asked from the page (rose:ask), even with the dock closed", async () => {
    render(<MemoryRouter><RoseDock roseStatus="live" /></MemoryRouter>);
    expect(sourceLabelsLoaded()).toBe(false);
    act(() => { window.dispatchEvent(new CustomEvent("rose:ask", { detail: "" })); });
    await waitFor(() => expect(sourceLabelsLoaded()).toBe(true));
  });
});
