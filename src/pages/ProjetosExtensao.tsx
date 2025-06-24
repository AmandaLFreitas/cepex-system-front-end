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
import CreateExtensionProjectDialog from "@/components/ui/modal/CreateExtensionProjectDialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import ViewExtensionProjectDetailsDialog from "@/components/ui/modal/ViewExtensionProjectDetailsDialog";
import EditExtensionProjectDialog from "@/components/ui/modal/EditExtensionProjectDialog";
import DeleteConfirmationDialog from "@/components/ui/modal/DeleteConfirmationDialog";

interface ExtensionProject {
  id: string;
  title: string;
  description: string;
  location: string;
  targetBeneficiaries: string;
  startDate: string;
  endDate: string;
  status: string;
  coordinator: any;
  team?: any[];
  inscritosCount?: number;
}

const ProjetosExtensao = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projetos, setProjetos] = useState<ExtensionProject[]>([]);
  const [inscricoes, setInscricoes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const { toast } = useToast();
  const { hasRole, user } = useAuth();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ExtensionProject | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isStudent = hasRole(["STUDENT"]);
  const canCreate = hasRole(["ADMIN", "PROFESSOR", "COORDINATOR", "SECRETARY"]);
  const canEdit = hasRole(["ADMIN", "PROFESSOR", "COORDINATOR", "SECRETARY"]);
  const canDelete = hasRole(["ADMIN", "COORDINATOR", "SECRETARY"]);

  const fetchProjetos = async () => {
    try {
      const response = await api.get("/extension-projects", {
        params: {
          search: searchTerm || undefined,
          status: statusFilter !== "todas" ? statusFilter : undefined,
        },
      });
      setProjetos(response.data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os projetos de extensão.",
        variant: "destructive",
      });
    }
  };

  const fetchInscricoes = async () => {
    if (!isStudent || !user) return;
    try {
      const inscricoesAtuais: string[] = [];
      for (const projeto of projetos) {
        try {
          const response = await api.get(`/extension-projects/${projeto.id}/inscricao-status`);
          if (response.data === true) {
            inscricoesAtuais.push(projeto.id);
          }
        } catch (error) {
          // Assume que não está inscrito
        }
      }
      setInscricoes(inscricoesAtuais);
    } catch (error) {
      // erro silencioso
    }
  };

  useEffect(() => {
    fetchProjetos();
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (projetos.length > 0 && isStudent) {
      fetchInscricoes();
    }
  }, [projetos, isStudent]);

  const handleInscricao = async (projetoId: string, title: string) => {
    try {
      if (inscricoes.includes(projetoId)) {
        await api.delete(`/extension-projects/${projetoId}/inscrever`);
        setInscricoes(inscricoes.filter((id) => id !== projetoId));
        toast({
          title: "Inscrição cancelada",
          description: `Você cancelou sua inscrição no projeto de extensão ${title}`,
        });
      } else {
        await api.post(`/extension-projects/${projetoId}/inscrever`);
        setInscricoes([...inscricoes, projetoId]);
        toast({
          title: "Inscrição realizada",
          description: `Você se inscreveu no projeto de extensão ${title}`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua inscrição.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (projeto: ExtensionProject) => {
    setSelectedProject(projeto);
    setIsViewDialogOpen(true);
  };

  const handleEditProject = (projeto: ExtensionProject) => {
    setSelectedProject(projeto);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProject = (projeto: ExtensionProject) => {
    setSelectedProject(projeto);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;
    setIsDeleting(true);
    try {
      await api.delete(`/extension-projects/${selectedProject.id}`);
      toast({
        title: "Sucesso",
        description: "Projeto de extensão excluído com sucesso!",
      });
      fetchProjetos();
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o projeto de extensão.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "ABERTO":
        return { text: "Aberto", color: "bg-green-500" };
      case "ANALISE":
        return { text: "Em Análise", color: "bg-yellow-500" };
      case "COMPLETO":
        return { text: "Concluído", color: "bg-blue-500" };
      case "CANCELADO":
        return { text: "Cancelado", color: "bg-red-500" };
      default:
        return { text: status, color: "bg-gray-500" };
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
                  Início / Atividades / Projetos de Extensão
                </nav>
                <h1 className="text-3xl font-bold text-foreground">
                  Projetos de Extensão
                </h1>
                <p className="text-muted-foreground mt-2">
                  Conectando a universidade com a comunidade através de ações
                  transformadoras em tecnologia.
                </p>
              </div>
            </div>
            {canCreate && (
              <Button
                className="bg-[#EC0444] hover:bg-[#EC0444]/90"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Projeto de Extensão
              </Button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por título, coordenador ou área..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="todas" value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por área de tecnologia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as áreas</SelectItem>
                <SelectItem value="saude_digital">Saúde Digital</SelectItem>
                <SelectItem value="educacao_tecnologica">
                  Educação Tecnológica
                </SelectItem>
                <SelectItem value="sustentabilidade_iot">
                  Sustentabilidade e IoT
                </SelectItem>
                <SelectItem value="seguranca_informacao">
                  Segurança da Informação
                </SelectItem>
                <SelectItem value="tecnologia_assistiva">
                  Tecnologia Assistiva
                </SelectItem>
                <SelectItem value="desenvolvimento_web_mobile">
                  Desenvolvimento Web/Mobile
                </SelectItem>
              </SelectContent>
            </Select>
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
                      <span>{projeto.coordinator?.name || projeto.coordinator?.login}</span>
                    </div>
                    {projeto.team && projeto.team.length > 0 && (
                      <div className="flex items-center text-sm text-gray-300 mb-3">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-300" />
                        <span>{projeto.team.length} colaborador(es)</span>
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
      {canCreate && (
        <CreateExtensionProjectDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={fetchProjetos}
        />
      )}
      <ViewExtensionProjectDetailsDialog
        projeto={selectedProject}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        userRoles={user?.roles || []}
      />
      <EditExtensionProjectDialog
        projeto={selectedProject}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={fetchProjetos}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Excluir Projeto de Extensão"
        description={`Tem certeza que deseja excluir o projeto "${selectedProject?.title}"? Esta ação não pode ser desfeita.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProjetosExtensao;
