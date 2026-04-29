import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Journeys from "./pages/Journeys.tsx";
import Sonor from "./pages/Sonor.tsx";
import Atherix from "./pages/Atherix.tsx";
import Tacet from "./pages/Tacet.tsx";
import Atrium from "./pages/Atrium.tsx";
import Contact from "./pages/Contact.tsx";
import Journal from "./pages/Journal.tsx";
import JournalEntry from "./pages/JournalEntry.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/journeys" element={<Journeys />} />
          <Route path="/sonor" element={<Sonor />} />
          <Route path="/atherix" element={<Atherix />} />
          <Route path="/tacet" element={<Tacet />} />
          <Route path="/atrium" element={<Atrium />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<JournalEntry />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
