import "@testing-library/jest-dom";
import { beforeEach } from "vitest";

// Rose's welcome shows on the first page view of a browser session. A test starts as a returning visitor, so the welcome
// does not appear in tests about something else; the tests of the welcome clear the flag.
beforeEach(() => {
  try { window.sessionStorage.setItem("rose_welcome", "seen"); } catch { /* ignore */ }
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// jsdom reads a <span> as a block and puts a space before it when it
// builds an accessible name ("Book a call , opens in a new tab"). A browser does not. Say what a browser knows, so a name
// computed here is the name a browser computes (checked in Chrome and Edge on 15 Nov 2026).
const style = document.createElement("style");
style.textContent = "[data-external-mark], [data-external-mark] span { display: inline; }";
document.head.appendChild(style);
