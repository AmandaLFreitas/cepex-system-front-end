
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Activities from "./pages/Activities";
import Monitorias from "./pages/Monitorias";
import ProjetosPesquisa from "./pages/ProjetosPesquisa";
import ProjetosExtensao from "./pages/ProjetosExtensao";
import Approvals from "./pages/Approvals";
import Certificates from "./pages/Certificates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="cepex-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/atividades" element={<Activities />} />
            <Route path="/monitorias" element={<Monitorias />} />
            <Route path="/projetos-pesquisa" element={<ProjetosPesquisa />} />
            <Route path="/projetos-extensao" element={<ProjetosExtensao />} />
            <Route path="/aprovacoes" element={<Approvals />} />
            <Route path="/certificados" element={<Certificates />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
