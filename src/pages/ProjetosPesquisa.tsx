// src/pages/ProjetosPesquisa.tsx

import React, { useEffect, useState } from "react";
import Header from "@/components/ui/modal/Header";
import Footer from "@/components/ui/modal/Footer";
import FloatingRating from "@/components/ui/modal/FloatingRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Search,
  Plus,
  Users,
  Calendar,
  BookOpen,
  Eye,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateProjetoDialog from "@/components/ui/modal/CreateProjetoDialog";
import ViewProjetoDetailsDialog from "@/components/ui/modal/ViewProjetoDetailsDialog";
import EditProjetoDialog from "@/components/ui/modal/EditProjetoDialog";
import DeleteConfirmationDialog from "@/components/ui/modal/DeleteConfirmationDialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface User {
  id: string;
  login: string;
  email: string;
  firstName?: string;
  lastName?: string;
  ra?: string; // Para alunos
}

interface AlunoInscrito {
  id: string;
  name: string;
  registration: string;
  email: string;
}

interface Projeto {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string; // ABERTO, ANALISE, COMPLETO, CANCELADO
  leadResearcher: User;
  collaborators?: User[];
  inscritosCount?: number; // Contador de inscritos vindo do backend
}

const ProjetosPesquisa = () => {
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Projeto | null>(null);
  const [inscricoes, setInscricoes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { user, hasRole, roles } = useAuth();

  const isStudent = hasRole(["STUDENT"]);
  const canCreate = hasRole(["ADMIN", "PROFESSOR", "COORDINATOR", "SECRETARY"]);
  const canEdit = hasRole(["ADMIN", "PROFESSOR", "COORDINATOR", "SECRETARY"]);
  const canDelete = hasRole(["ADMIN", "COORDINATOR", "SECRETARY"]);
  const canViewParticipants = hasRole(["ADMIN", "PROFESSOR", "COORDINATOR", "SECRETARY"]);
  const canViewStatusFilter = hasRole(["ADMIN", "PROFESSOR", "COORDINATOR", "SECRETARY"]);

  const fetchProjetos = async () => {
    try {
      const response = await api.get("/research-projects", {
        params: {
          search: searchTerm || undefined,
          status: statusFilter !== "todos" ? statusFilter.toUpperCase() : undefined,
        },
      });
      setProjetos(response.data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos de pesquisa.",
        variant: "destructive",
      });
    }
  };

  const fetchUserInscricoes = async () => {
    if (user) {
      try {
        const response = await api.get(`/research-projects/inscricoes/aluno/${user.id}`);
        setInscricoes(response.data.map((p: Projeto) => p.id));
      } catch (error) {
        console.error("Erro ao carregar inscrições do usuário:", error);
      }
    }
  };

  useEffect(() => {
    fetchProjetos();
    if (isStudent) {
      fetchUserInscricoes();
    }
  }, [searchTerm, statusFilter, isStudent, user]);

  const handleViewDetails = (projeto: Projeto) => {
    setSelectedProject(projeto);
    setIsViewDialogOpen(true);
  };

  const handleEditProject = (projeto: Projeto) => {
    setSelectedProject(projeto);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProject = (projeto: Projeto) => {
    setSelectedProject(projeto);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/research-projects/${selectedProject.id}`);
      toast({
        title: "Sucesso",
        description: "Projeto excluído com sucesso!",
      });
      fetchProjetos();
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInscricao = async (projetoId: string, title: string) => {
    try {
      if (inscricoes.includes(projetoId)) {
        await api.delete(`/research-projects/${projetoId}/inscrever`);
        setInscricoes(inscricoes.filter((id) => id !== projetoId));
        toast({ title: "Inscrição cancelada" });
      } else {
        await api.post(`/research-projects/${projetoId}/inscrever`);
        setInscricoes([...inscricoes, projetoId]);
        toast({ title: "Inscrição realizada" });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua inscrição. Verifique se já está inscrito ou se o período de inscrição está aberto.",
        variant: "destructive",
      });
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "ABERTO":
        return { text: "Aberto", color: "bg-green-500 text-white" };
      case "ANALISE":
        return { text: "Em Análise", color: "bg-yellow-500 text-white" };
      case "COMPLETO":
        return { text: "Concluído", color: "bg-blue-500 text-white" };
      case "CANCELADO":
        return { text: "Cancelado", color: "bg-red-500 text-white" };
      default:
        return { text: status, color: "bg-gray-500 text-white" };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/atividades")}
                className="text-muted-foreground hover:text-foreground mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <nav className="text-sm text-muted-foreground mb-2">
                  Início / Atividades / Projetos de Pesquisa
                </nav>
                <h1 className="text-3xl font-bold text-foreground">
                  Projetos de Pesquisa
                </h1>
                <p className="text-muted-foreground mt-2">
                  Iniciação científica e desenvolvimento acadêmico
                </p>
              </div>
            </div>
            {canCreate && (
              <Button
                className="bg-[#EC0444] hover:bg-[#EC0444]/90"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Projeto
              </Button>
            )}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou pesquisador líder..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {canViewStatusFilter && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="analise">Em Análise</SelectItem>
                  <SelectItem value="completo">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((projeto) => (
              <Card key={projeto.id} className="bg-gray-800 text-white shadow-lg rounded-lg flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold mb-2 text-white">
                      {projeto.title}
                    </CardTitle>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusDisplay(projeto.status).color}`}>
                      {getStatusDisplay(projeto.status).text}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <div className="flex-grow">
                    <div className="flex items-center text-sm text-gray-300 mb-3">
                      <Users className="h-4 w-4 mr-2 text-gray-300" />
                      <span>{projeto.leadResearcher.login}</span>
                    </div>
                    {projeto.collaborators && projeto.collaborators.length > 0 && (
                      <div className="flex items-center text-sm text-gray-300 mb-3">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-300" />
                        <span>{projeto.collaborators.length} colaborador(es)</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-300 mb-3">
                      <Users className="h-4 w-4 mr-2 text-gray-300" />
                      <span>{projeto.inscritosCount || 0} aluno(s) inscrito(s)</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                      {projeto.description}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-600 pt-4 mt-4">
                    <div className="flex justify-between text-sm text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-300" />
                        <span>Início: {formatDate(projeto.startDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-300" />
                        <span>Fim: {formatDate(projeto.endDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    {!isStudent && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 bg-[#EC0444] hover:bg-[#EC0444]/90 text-white border-[#EC0444] hover:border-[#EC0444]/90"
                          onClick={() => handleViewDetails(projeto)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Mais
                        </Button>
                        {canEdit && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                            onClick={() => handleEditProject(projeto)}
                          >
                            <Edit className="h-4 w-4 text-gray-300" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-[#EC0444] hover:text-[#EC0444]/90 border-[#EC0444] hover:border-[#EC0444]/90 bg-gray-700 hover:bg-gray-600"
                            onClick={() => handleDeleteProject(projeto)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {isStudent && (
                      <Button
                        onClick={() => handleInscricao(projeto.id, projeto.title)}
                        className="w-full"
                        variant={inscricoes.includes(projeto.id) ? 'destructive' : 'default'}
                        disabled={projeto.status !== 'ABERTO'}
                      >
                        {projeto.status !== 'ABERTO' 
                          ? 'Inscrições Fechadas' 
                          : inscricoes.includes(projeto.id) 
                            ? 'Cancelar Inscrição' 
                            : 'Inscrever-se'
                        }
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingRating />

      <CreateProjetoDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchProjetos}
      />

      <ViewProjetoDetailsDialog
        projeto={selectedProject}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        userRoles={roles}
        onStatusChange={fetchProjetos}
      />

      <EditProjetoDialog
        projeto={selectedProject}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={fetchProjetos}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Excluir Projeto"
        description={`Tem certeza que deseja excluir o projeto "${selectedProject?.title}"? Esta ação não pode ser desfeita.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProjetosPesquisa;