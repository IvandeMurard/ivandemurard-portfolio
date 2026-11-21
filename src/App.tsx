import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import { pages } from "./routes";
import { MoodProvider } from "./components/MoodProvider";
import { AmbienceProvider } from "./components/AmbienceProvider";
import { ListenProvider } from "./components/listen/ListenProvider";

// Every page but the homepage loads on demand (see routes.ts). main.tsx fetches the chunk of the first route before it
// renders, so the prerendered HTML in #root is never replaced by a fallback.
const CaseStudies = pages.CaseStudies.Component;
const Sonor = pages.Sonor.Component;
const Atherix = pages.Atherix.Component;
const Tacet = pages.Tacet.Component;
const Lore = pages.Lore.Component;
const Anima = pages.Anima.Component;
const Compass = pages.Compass.Component;
const Architecture = pages.Architecture.Component;
const Atrium = pages.Atrium.Component;
const Contact = pages.Contact.Component;
const Cv = pages.Cv.Component;
const Agents = pages.Agents.Component;
const RoseCasePage = pages.RoseCasePage.Component;
const RoseDesignLab = pages.RoseDesignLab.Component;
const Privacy = pages.Privacy.Component;
const AdminRose = pages.AdminRose.Component;
const Journal = pages.Journal.Component;
const JournalEntry = pages.JournalEntry.Component;
const NotFound = pages.NotFound.Component;

const queryClient = new QueryClient();

/** The old URL of the Rose case study. A ?concept= link goes to the lab, anything else to /rose; the hash is kept. */
export const RoseDesignLabRedirect = () => {
  const { search, hash } = useLocation();
  const concept = new URLSearchParams(search).get("concept");
  return <Navigate to={concept === null ? `/rose${hash}` : `/rose/lab?concept=${encodeURIComponent(concept)}${hash}`} replace />;
};

/** Shown only when a client navigation reaches a chunk that is not loaded yet and the current page cannot stay up. */
const RouteFallback = () => <div aria-busy="true" className="min-h-[60vh]" />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MoodProvider>
      <AmbienceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* v7_startTransition: a navigation to a page whose chunk is still loading keeps the current page on screen. */}
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {/* One reader for the whole site: a page change never cuts the sound (it lives above the routes). */}
            <ListenProvider>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/journeys" element={<Navigate to="/case-studies" replace />} />
                <Route path="/sonor" element={<Sonor />} />
                <Route path="/aetherix" element={<Atherix />} />
                <Route path="/atherix" element={<Navigate to="/aetherix" replace />} />
                <Route path="/tacet" element={<Tacet />} />
                <Route path="/lore" element={<Lore />} />
                <Route path="/anima" element={<Anima />} />
                <Route path="/compass" element={<Compass />} />
                <Route path="/architecture" element={<Architecture />} />
                <Route path="/atrium" element={<Atrium />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cv" element={<Cv />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/rose" element={<RoseCasePage />} />
                <Route path="/rose/lab" element={<RoseDesignLab />} />
                <Route path="/rose-design-lab" element={<RoseDesignLabRedirect />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/admin/rose" element={<AdminRose />} />
                <Route path="/journal" element={<Journal />} />
                <Route
                  path="/journal/harnais-graders-boucles-fermees"
                  element={<Navigate to="/journal/harnesses-graders-closed-loops" replace />}
                />
                <Route path="/journal/:slug" element={<JournalEntry />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            </ListenProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AmbienceProvider>
    </MoodProvider>
  </QueryClientProvider>
);

export default App;
