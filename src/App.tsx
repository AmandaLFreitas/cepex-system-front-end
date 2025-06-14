import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/modal/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PageTransition } from "@/components/PageTransition";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Activities from "./pages/Activities";
import Monitorias from "./pages/Monitorias";
import ProjetosPesquisa from "./pages/ProjetosPesquisa";
import ProjetosExtensao from "./pages/ProjetosExtensao";
import Approvals from "./pages/Approvals";
import Certificates from "./pages/Certificates";
import NotFound from "./pages/NotFound";
import { MainLayout } from "./components/ui/modal/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

// Componente para rotas públicas (login, register, etc)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="cepex-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <PageTransition>
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PublicRoute>
                        <ForgotPassword />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/atividades" element={<Activities />} />
                      <Route path="/monitorias" element={<Monitorias />} />
                      <Route
                        path="/projetos-pesquisa"
                        element={<ProjetosPesquisa />}
                      />
                      <Route
                        path="/projetos-extensao"
                        element={<ProjetosExtensao />}
                      />
                      <Route path="/aprovacoes" element={<Approvals />} />
                      <Route path="/certificados" element={<Certificates />} />
                    </Route>
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                    <Route element={<MainLayout />}>
                      <Route path="/usuarios" element={<Users />} />
                    </Route>
                  </Route>

                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
