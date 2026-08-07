import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Journeys from "./pages/Journeys.tsx";
import Sonor from "./pages/Sonor.tsx";
import Atherix from "./pages/Atherix.tsx";
import Tacet from "./pages/Tacet.tsx";
import Lore from "./pages/Lore.tsx";
import Anima from "./pages/Anima.tsx";
import Architecture from "./pages/Architecture.tsx";
import Atrium from "./pages/Atrium.tsx";
import Contact from "./pages/Contact.tsx";
import Journal from "./pages/Journal.tsx";
import JournalEntry from "./pages/JournalEntry.tsx";
import NotFound from "./pages/NotFound.tsx";
import { MoodProvider } from "./components/MoodProvider";
import { AmbienceProvider } from "./components/AmbienceProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MoodProvider>
      <AmbienceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/journeys" element={<Journeys />} />
              <Route path="/sonor" element={<Sonor />} />
              <Route path="/aetherix" element={<Atherix />} />
              <Route path="/atherix" element={<Navigate to="/aetherix" replace />} />
              <Route path="/tacet" element={<Tacet />} />
              <Route path="/lore" element={<Lore />} />
              <Route path="/architecture" element={<Architecture />} />
              <Route path="/atrium" element={<Atrium />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/journal" element={<Journal />} />
              <Route
                path="/journal/harnais-graders-boucles-fermees"
                element={<Navigate to="/journal/harnesses-graders-closed-loops" replace />}
              />
              <Route path="/journal/:slug" element={<JournalEntry />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AmbienceProvider>
    </MoodProvider>
  </QueryClientProvider>
);

export default App;
