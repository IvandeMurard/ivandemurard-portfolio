import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useRevealHash } from "../hooks/useRevealHash";
import { openCollapsedAncestors, revealAnchor } from "../lib/revealAnchor";
import { getRoseSystemPrompt } from "../../supabase/functions/_shared/rose-context";

afterEach(() => { cleanup(); document.body.innerHTML = ""; vi.restoreAllMocks(); vi.unstubAllGlobals(); });

const html = (markup: string) => { document.body.innerHTML = markup; };

describe("a link to an element inside a collapsed section opens it, then scrolls", () => {
  it("opens a closed <details> around the target", () => {
    html('<details id="d"><summary>More</summary><p id="t">Target</p></details>');
    expect(openCollapsedAncestors(document.getElementById("t")!)).toBe(true);
    expect((document.getElementById("d") as HTMLDetailsElement).open).toBe(true);
  });

  it("opens nested <details> from the inside out, and leaves open ones alone", () => {
    html('<details id="a" open><summary>A</summary><details id="b"><summary>B</summary><p id="t">T</p></details></details>');
    openCollapsedAncestors(document.getElementById("t")!);
    expect((document.getElementById("a") as HTMLDetailsElement).open).toBe(true);
    expect((document.getElementById("b") as HTMLDetailsElement).open).toBe(true);
    expect(openCollapsedAncestors(document.getElementById("t")!)).toBe(false);
  });

  it("clicks the trigger of a closed disclosure when the target is the disclosure itself", () => {
    html('<div id="the-numbers" data-disclosure data-state="closed"><button data-disclosure-trigger>The numbers</button></div>');
    const trigger = document.querySelector<HTMLElement>("[data-disclosure-trigger]")!;
    const click = vi.fn();
    trigger.addEventListener("click", click);
    expect(openCollapsedAncestors(document.getElementById("the-numbers")!)).toBe(true);
    expect(click).toHaveBeenCalledTimes(1);
  });

  it("does not click an open disclosure", () => {
    html('<div id="x" data-disclosure data-state="open"><button data-disclosure-trigger>X</button></div>');
    const click = vi.fn();
    document.querySelector("[data-disclosure-trigger]")!.addEventListener("click", click);
    expect(openCollapsedAncestors(document.getElementById("x")!)).toBe(false);
    expect(click).not.toHaveBeenCalled();
  });

  it("opens first, then scrolls to the element; scrolls at once when nothing was collapsed", () => {
    const scroll = vi.fn();
    Element.prototype.scrollIntoView = scroll;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => { cb(0); return 0; });
    html('<details id="d"><summary>More</summary><p id="t">Target</p></details><p id="plain">P</p>');
    expect(revealAnchor("t", true)).toBe(true);
    expect((document.getElementById("d") as HTMLDetailsElement).open).toBe(true);
    expect(scroll).toHaveBeenCalledWith({ behavior: "auto", block: "start" });
    scroll.mockClear();
    expect(revealAnchor("plain", false)).toBe(true);
    expect(scroll).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    expect(revealAnchor("missing", true)).toBe(false);
  });
});

describe("useRevealHash", () => {
  const Page = () => { useRevealHash(); return <details id="d"><summary>More</summary><p id="t">Target</p></details>; };

  it("opens the section around the URL hash on arrival, and does nothing without a hash", () => {
    Element.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => { cb(0); return 0; });
    const { unmount } = render(<MemoryRouter initialEntries={["/page"]}><Page /></MemoryRouter>);
    expect((document.getElementById("d") as HTMLDetailsElement).open).toBe(false);
    unmount();
    render(<MemoryRouter initialEntries={["/page#t"]}><Page /></MemoryRouter>);
    expect((document.getElementById("d") as HTMLDetailsElement).open).toBe(true);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });
});

describe("The numbers on /aetherix", () => {
  it("has its own anchor id on a disclosure that opens for a link", () => {
    const page = readFileSync("src/pages/Atherix.tsx", "utf8");
    expect(page).toContain('<AetherixDisclosure id="the-numbers" title="The numbers">');
    const disclosure = readFileSync("src/components/atherix/AetherixDisclosure.tsx", "utf8");
    expect(disclosure).toContain("DISCLOSURE_TRIGGER");
    expect(disclosure).toContain("forceMount");
    expect(disclosure).toContain("data-[state=closed]:hidden");
    expect(readFileSync("src/components/layout/SiteLayout.tsx", "utf8")).toContain("useRevealHash()");
  });

  it("is among the anchors Rose may link to", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/" }, question: "What has Ivan built?" });
    expect(prompt).toContain("/aetherix#the-numbers");
    expect(prompt).toContain("/aetherix#where-it-stands");
  });
});
