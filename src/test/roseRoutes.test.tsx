import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import RoseDesignLab, { RoseCasePage } from "@/pages/RoseDesignLab";
import { RoseDesignLabRedirect } from "@/App";
import { MoodProvider } from "@/components/MoodProvider";
import { AmbienceProvider } from "@/components/AmbienceProvider";

class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("ResizeObserver", NoopObserver);
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  document.head.innerHTML = "";
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const at = (url: string, el: JSX.Element) => render(<MoodProvider><AmbienceProvider><MemoryRouter initialEntries={[url]}>{el}</MemoryRouter></AmbienceProvider></MoodProvider>);
const meta = (sel: string) => document.head.querySelector(sel)?.getAttribute(sel.includes("canonical") ? "href" : "content");

describe("/rose is the case study", () => {
  it("is indexable with /rose as canonical, and has no lab banner and no concept tabs", () => {
    at("/rose", <RoseCasePage />);
    expect(meta('link[rel="canonical"]')).toBe("https://ivandemurard.com/rose");
    expect(document.head.querySelector('meta[name="robots"][content*="noindex"]')).toBeNull();
    expect(screen.queryByText(/Design lab · unlinked prototype/)).toBeNull();
    expect(screen.getByRole("tablist", { name: "Answer formats" })).toBeTruthy();
    expect(screen.queryByRole("tab", { name: "A" })).toBeNull();
  });
});

describe("/rose as a reference route", () => {
  it("is a known portfolio destination for Rose's measurement, and the old path is not", async () => {
    const { referencePath } = await import("@/components/rose/roseMeasurement");
    expect(referencePath("/rose?x=1#ch-learn")).toBe("/rose");
    expect(referencePath("/rose-design-lab")).toBeNull();
  });
});

describe("/rose/lab is the lab", () => {
  it("keeps the banner and the six tabs, and is noindex", () => {
    at("/rose/lab", <RoseDesignLab />);
    expect(screen.getByText(/Design lab · unlinked prototype/)).toBeTruthy();
    const tabs = screen.getAllByRole("tab").filter((t) => !t.closest("[data-answer-formats]") && !t.closest("[data-got-wrong]"));
    expect(tabs.map((t) => t.textContent?.[0])).toEqual(["C", "A", "B", "C", "D", "E"]);
    expect(document.head.querySelector('meta[name="robots"][content*="noindex"]')).toBeTruthy();
  });
});

describe("/rose-design-lab redirects", () => {
  const Where = () => { const l = useLocation(); return <p data-testid="where">{l.pathname + l.search + l.hash}</p>; };
  const go = (url: string) => {
    render(<MemoryRouter initialEntries={[url]}><Routes>
      <Route path="/rose-design-lab" element={<RoseDesignLabRedirect />} />
      <Route path="*" element={<Where />} />
    </Routes></MemoryRouter>);
    return screen.getByTestId("where").textContent;
  };
  it("sends a ?concept= link to the lab, and anything else to /rose", () => {
    expect(go("/rose-design-lab?concept=d")).toBe("/rose/lab?concept=d");
    cleanup();
    expect(go("/rose-design-lab?concept=narrative#ch-trust")).toBe("/rose/lab?concept=narrative#ch-trust");
    cleanup();
    expect(go("/rose-design-lab")).toBe("/rose");
    cleanup();
    expect(go("/rose-design-lab#ch-learn")).toBe("/rose#ch-learn");
  });
});
