import React, { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ProjetosExtensao = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [participacoes, setParticipacoes] = useState<number[]>([2]);
  const { toast } = useToast();
  const { hasRole } = useAuth();

  const isStudent = hasRole(["STUDENT"]);
  const canCreate = hasRole(["ADMIN", "PROFESSOR", "COORDINATOR", "SECRETARY"]);

  const handleParticipacao = (projetoId: number, titulo: string) => {
    if (participacoes.includes(projetoId)) {
      setParticipacoes(participacoes.filter((id) => id !== projetoId));
      toast({
        title: "Participação cancelada",
        description: `Você cancelou sua participação no projeto de extensão ${titulo}`,
      });
    } else {
      setParticipacoes([...participacoes, projetoId]);
      toast({
        title: "Participação confirmada",
        description: `Você se inscreveu no projeto de extensão ${titulo}`,
      });
    }
  };

  const handleViewDetails = (projetoId: number) => {
    // Implementar navegação para página de detalhes
    navigate(`/projetos-extensao/${projetoId}`);
  };

  const projetosExtensaoData = [
    {
      id: 1,
      titulo: "Desenvolvimento de App para Acompanhamento de Saúde",
      coordenador: "Prof. Dra. Camila Soares",
      area: "Saúde Digital",
      descricao:
        "Criação de um aplicativo móvel para auxiliar pacientes no gerenciamento de condições crônicas.",
      inicio: "01/08/2025",
      alunosEnvolvidos: 6,
      status: "Em Andamento",
      participando: false,
    },
    {
      id: 2,
      titulo: "Oficinas de Programação para Jovens da Comunidade",
      coordenador: "Prof. Dr. Eduardo Lima",
      area: "Educação Tecnológica",
      descricao:
        "Série de workshops práticos sobre lógica de programação e desenvolvimento web básico.",
      inicio: "10/09/2025",
      alunosEnvolvidos: 15,
      status: "Em Andamento",
      participando: true,
    },
    {
      id: 3,
      titulo: "Sistema de Gerenciamento de Resíduos com IoT",
      coordenador: "Prof. Dra. Mariana Costa",
      area: "Sustentabilidade e IoT",
      descricao:
        "Implementação de uma solução de IoT para monitorar e otimizar a coleta seletiva em áreas urbanas.",
      inicio: "05/10/2025",
      alunosEnvolvidos: 9,
      status: "Aguardando Início",
      participando: false,
    },
    {
      id: 4,
      titulo: "Cibersegurança para Pequenas Empresas Locais",
      coordenador: "Prof. Esp. Bruno Martins",
      area: "Segurança da Informação",
      descricao:
        "Consultoria e treinamento em práticas básicas de cibersegurança para empresários e colaboradores.",
      inicio: "20/11/2025",
      alunosEnvolvidos: 7,
      status: "Em Planejamento",
      participando: false,
    },
    {
      id: 5,
      titulo: "Plataforma Online de Apoio à Leitura Inclusiva",
      coordenador: "Prof. Ms. Clara Viana",
      area: "Tecnologia Assistiva",
      descricao:
        "Criação de uma plataforma web com recursos para facilitar a leitura para pessoas com dislexia.",
      inicio: "15/12/2025",
      alunosEnvolvidos: 10,
      status: "Em Planejamento",
      participando: false,
    },
  ];

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
              />
            </div>
            <Select defaultValue="todas">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {projetosExtensaoData.map((projeto) => (
              <Card key={projeto.id} className="bg-card border-border">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-foreground mb-2">
                      {projeto.titulo}
                    </CardTitle>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        projeto.status === "Em Andamento"
                          ? "bg-blue-600 text-white"
                          : projeto.status === "Aguardando Início"
                          ? "bg-yellow-600 text-white"
                          : projeto.status === "Em Planejamento"
                          ? "bg-purple-600 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {projeto.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{projeto.coordenador}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>{projeto.area}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {projeto.descricao}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Início: {projeto.inicio}</span>
                    </div>
                    <span>{projeto.alunosEnvolvidos} alunos envolvidos</span>
                  </div>

                  <div className="pt-2">
                    {isStudent ? (
                      <Button
                        className={`w-full ${
                          participacoes.includes(projeto.id)
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-[#EC0444] hover:bg-[#EC0444]/90"
                        }`}
                        onClick={() =>
                          handleParticipacao(projeto.id, projeto.titulo)
                        }
                      >
                        {participacoes.includes(projeto.id)
                          ? "Cancelar Participação"
                          : "Participar"}
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-[#EC0444] hover:bg-[#EC0444]/90"
                        onClick={() => handleViewDetails(projeto.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Mais
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
        <CreateProjetoDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      )}
    </div>
  );
};

export default ProjetosExtensao;
