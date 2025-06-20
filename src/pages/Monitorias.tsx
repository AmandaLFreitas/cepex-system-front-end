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
  MapPin,
  Clock,
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
import CreateMonitoriaDialog from "@/components/ui/modal/CreateMonitoriaDialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface Monitoria {
  id: string;
  title: string;
  description: string;
  remote: boolean;
  location: string;
  vacancies: number;
  workload: number;
  inicialDate: string;
  finalDate: string;
  inicialIngressDate: string;
  finalIngressDate: string;
  selectionType: string;
  selectionDate: string;
  selectionTime: string;
  divulgationDate: string;
  eventStatus: string;
  subject?: {
    id: string;
    name: string;
  };
  professor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface MonitoriaStatistics {
  monitoriasAbertas: number;
  monitoresAtivos: number;
  candidatosPendentes: number;
}

const Monitorias = () => {
  const navigate = useNavigate();
  const [monitoria, setMonitoria] = useState<Monitoria | null>(null);
  const [monitorias, setMonitorias] = useState<Monitoria[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [inscricoes, setInscricoes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [statistics, setStatistics] = useState<MonitoriaStatistics>({
    monitoriasAbertas: 0,
    monitoresAtivos: 0,
    candidatosPendentes: 0,
  });
  const { toast } = useToast();
  const { hasRole } = useAuth();

  const isStudent = hasRole(["STUDENT"]);
  const canCreate = hasRole(["ADMIN", "PROFESSOR"]);

  const handleInscricao = async (monitoriaId: string, title: string) => {
    try {
      if (inscricoes.includes(monitoriaId)) {
        await api.delete(`/monitorias/${monitoriaId}/candidatar`);
        setInscricoes(inscricoes.filter((id) => id !== monitoriaId));
        toast({
          title: "Candidatura cancelada",
          description: `Você cancelou sua candidatura para monitoria de ${title}`,
        });
      } else {
        await api.post(`/monitorias/${monitoriaId}/candidatar`);
        setInscricoes([...inscricoes, monitoriaId]);
        toast({
          title: "Candidatura realizada",
          description: `Você se candidatou para monitoria de ${title}`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua candidatura.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (monitoriaId: string) => {
    navigate(`/monitorias/${monitoriaId}`);
  };

  const fetchMonitorias = async () => {
    try {
      const response = await api.get("/monitorias", {
        params: {
          search: searchTerm || undefined,
          status: statusFilter !== "todos" ? statusFilter : undefined,
        },
      });
      setMonitorias(response.data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as monitorias.",
        variant: "destructive",
      });
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get("/monitorias/statistics");
      setStatistics(response.data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  useEffect(() => {
    fetchMonitorias();
    fetchStatistics();
  }, [searchTerm, statusFilter, toast]);

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
                  Início / Atividades / Monitorias
                </nav>
                <h1 className="text-3xl font-bold text-foreground">
                  Monitorias
                </h1>
                <p className="text-muted-foreground mt-2">
                  Acompanhamento e suporte acadêmico
                </p>
              </div>
            </div>
            {canCreate && (
              <Button
                className="bg-[#EC0444] hover:bg-[#EC0444]/90"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Monitoria
              </Button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por disciplina, professor ou monitor..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="PENDENTE">Pendente</SelectItem>
                <SelectItem value="APROVADO">Aprovado</SelectItem>
                <SelectItem value="REJEITADO">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {monitorias.map((monitoria) => (
              <Card key={monitoria.id} className="bg-card border-border">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-foreground">
                      {monitoria.title}
                    </CardTitle>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        monitoria.eventStatus === "APROVADO"
                          ? "bg-green-500 text-white"
                          : monitoria.eventStatus === "PENDENTE"
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {monitoria.eventStatus === "APROVADO"
                        ? "Aprovado"
                        : monitoria.eventStatus === "PENDENTE"
                        ? "Pendente"
                        : "Rejeitado"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>
                      <strong>Professor:</strong>{" "}
                      {monitoria.professor
                        ? `${monitoria.professor.firstName} ${monitoria.professor.lastName}`
                        : "Não definido"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      <strong>Disciplina:</strong>{" "}
                      {monitoria.subject
                        ? monitoria.subject.name
                        : "Não definida"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      <strong>Carga Horária:</strong> {monitoria.workload}h
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                      <strong>Local:</strong>{" "}
                      {monitoria.remote ? "Remoto" : monitoria.location}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Vagas:</strong> {monitoria.vacancies}
                  </div>

                  <div className="pt-4 space-y-2">
                    {isStudent && monitoria.eventStatus === "APROVADO" ? (
                      <Button
                        className={`w-full ${
                          inscricoes.includes(monitoria.id)
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-[#EC0444] hover:bg-[#EC0444]/90"
                        }`}
                        onClick={() =>
                          handleInscricao(monitoria.id, monitoria.title)
                        }
                      >
                        {inscricoes.includes(monitoria.id)
                          ? "Cancelar Candidatura"
                          : "Candidatar-se a Monitor"}
                      </Button>
                    ) : canCreate ? (
                      <Button
                        className="w-full bg-[#EC0444] hover:bg-[#EC0444]/90"
                        onClick={() => handleViewDetails(monitoria.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Mais
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <div className="text-4xl font-bold text-blue-500">
                  {statistics.monitoriasAbertas}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Monitorias Abertas
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <div className="text-4xl font-bold text-green-500">
                  {statistics.monitoresAtivos}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Monitores Ativos
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                <div className="text-4xl font-bold text-purple-500">
                  {statistics.candidatosPendentes}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Candidatos Pendentes
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingRating />
      {canCreate && (
        <CreateMonitoriaDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSuccess={fetchMonitorias}
        />
      )}
    </div>
  );
};

export default Monitorias;
