import { Toaster } from "@/modules/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/modules/shared/components/ui/sonner";
import { TooltipProvider } from "@/modules/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, SignIn, PropertyManagement, CrmGuest, NotFound, HostsListing, AtpDashboard, AreaCoordinators, AtpAdvancedView } from "@/modules";
import { authService } from "@/modules/auth/services/authService";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = authService.getCurrentToken();
  
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/properties" 
            element={
              <ProtectedRoute>
                <PropertyManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crm-guest" 
            element={
              <ProtectedRoute>
                <CrmGuest />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hosts" 
            element={
              <ProtectedRoute>
                <HostsListing />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/atp-dashboard" 
            element={
              <ProtectedRoute>
                <AtpDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/area-coordinators" 
            element={
              <ProtectedRoute>
                <AreaCoordinators />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/area-coordinators/:id" 
            element={
              <ProtectedRoute>
                <AtpAdvancedView />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
