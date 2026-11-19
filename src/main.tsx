import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { preloadRoute } from "./routes";
import "./index.css";

// A chunk that no longer exists (a deploy replaced it while this tab was open): reload once to get the new build.
window.addEventListener("vite:preloadError", () => {
  try {
    if (sessionStorage.getItem("chunk-reload") === "1") return;
    sessionStorage.setItem("chunk-reload", "1");
  } catch { /* storage blocked: reload anyway, once per event */ }
  window.location.reload();
});

const root = document.getElementById("root")!;

// The host serves the page's HTML already in #root. Fetch the chunk of the first route before the first render, so React
// finds the page ready and never commits a Suspense fallback over that HTML. If the fetch fails and there is HTML to
// keep, leave it: its links are plain links and still work.
const boot = async () => {
  try {
    await preloadRoute(window.location.pathname, window.location.search);
  } catch {
    if (root.hasChildNodes()) return;
  }
  createRoot(root).render(<App />);
  try { sessionStorage.removeItem("chunk-reload"); } catch { /* storage blocked */ }
};
void boot();
