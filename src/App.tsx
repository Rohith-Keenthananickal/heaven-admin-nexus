import { Toaster } from "@/modules/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/modules/shared/components/ui/sonner";
import { TooltipProvider } from "@/modules/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard, SignIn, PropertyManagement, CrmGuest, NotFound,HostsListing } from "@/modules";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<PropertyManagement />} />
          <Route path="/crm-guest" element={<CrmGuest />} />
          <Route path="/hosts" element={<HostsListing />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
