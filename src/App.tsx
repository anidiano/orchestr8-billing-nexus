
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';

// Pages
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Usage from '@/pages/Usage';
import Billing from '@/pages/Billing';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Orchestr8Dashboard from '@/pages/Orchestr8Dashboard';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/orchestr8" element={
                  <ProtectedRoute>
                    <Orchestr8Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/usage" element={
                  <ProtectedRoute>
                    <Usage />
                  </ProtectedRoute>
                } />
                <Route path="/billing" element={
                  <ProtectedRoute>
                    <Billing />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
