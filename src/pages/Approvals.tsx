import { useState, useEffect } from "react";
import Header from "@/components/ui/modal/Header";
import Footer from "@/components/ui/modal/Footer";
import FloatingRating from "@/components/ui/modal/FloatingRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Users,
  Shield,
  Globe,
  ArrowRight,
  Check,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { approvalService, ApprovalItem } from "@/service/api";
import { useToast } from "@/hooks/use-toast";

const Approvals = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Verificar se o usuário tem permissão para acessar esta página
  const canAccessApprovals = hasRole(["ADMIN", "COORDENATION", "SECRETARY"]);

  const approvalFlow = [
    {
      step: 1,
      title: "Criação do Projeto/Monitoria",
      role: "Professor",
      description:
        "Professor propõe um projeto/monitoria com todos os detalhes necessários",
      color: "bg-gradient-to-br from-blue-500/50 to-blue-600/50",
      icon: User,
    },
    {
      step: 2,
      title: "Revisão Inicial",
      role: "Coordenador",
      description: "Coordenador analisa viabilidade acadêmica e adequação",
      color: "bg-gradient-to-br from-purple-500/50 to-purple-600/50",
      icon: Users,
    },
    {
      step: 3,
      title: "Aprovação Final",
      role: "Secretaria",
      description: "Secretaria valida e confirma disponibilidade de recursos",
      color: "bg-gradient-to-br from-green-500/50 to-green-600/50",
      icon: Shield,
    },
    {
      step: 4,
      title: "Publicação",
      role: "Sistema",
      description: "Evento é publicado e disponibilizado para inscrições",
      color: "bg-gradient-to-br from-[#EC0444]/50 to-[#EC0444]/50",
      icon: Globe,
    },
  ];

  const approvalCriteria = [
    {
      title: "Análise do Projeto",
      description:
        "Avaliação da qualidade, relevância e contribuição acadêmica do evento proposto",
    },
    {
      title: "Verificação de Recursos",
      description:
        "Análise da disponibilidade de espaços, equipamentos e orçamento necessários",
    },
    {
      title: "Alinhamento Institucional",
      description:
        "Conformidade com as políticas educacionais e valores da instituição",
    },
  ];

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // Função para obter o tipo traduzido
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "MONITORIA":
        return "Monitoria";
      case "PESQUISA":
        return "Projeto de Pesquisa";
      case "EXTENSAO":
        return "Projeto de Extensão";
      default:
        return type;
    }
  };

  // Função para obter a cor do tipo
  const getTypeColor = (type: string) => {
    switch (type) {
      case "MONITORIA":
        return "bg-blue-500/20 text-blue-600 border border-blue-500/30";
      case "PESQUISA":
        return "bg-green-500/20 text-green-600 border border-green-500/30";
      case "EXTENSAO":
        return "bg-purple-500/20 text-purple-600 border border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-600 border border-gray-500/30";
    }
  };

  // Carregar aprovações pendentes
  const loadPendingApprovals = async () => {
    try {
      setLoading(true);
      const data = await approvalService.getPendingApprovals();
      setPendingApprovals(data);
    } catch (error) {
      console.error("Erro ao carregar aprovações:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as aprovações pendentes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Aprovar item
  const handleApprove = async (id: string, type: string) => {
    try {
      setProcessingId(id);
      await approvalService.approveItem(id, type);
      toast({
        title: "Sucesso",
        description: "Item aprovado com sucesso!",
      });
      await loadPendingApprovals(); // Recarregar lista
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o item.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Rejeitar item
  const handleReject = async (id: string, type: string) => {
    try {
      setProcessingId(id);
      await approvalService.rejectItem(id, type);
      toast({
        title: "Sucesso",
        description: "Item rejeitado com sucesso!",
      });
      await loadPendingApprovals(); // Recarregar lista
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
      toast({
        title: "Erro",
        description: "Não foi possível rejeitar o item.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    if (canAccessApprovals) {
      loadPendingApprovals();
    }
  }, [canAccessApprovals]);

  // Se o usuário não tem permissão, mostrar mensagem de acesso negado
  if (!canAccessApprovals) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <Card className="w-full max-w-md">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
                  <p className="text-muted-foreground mb-4">
                    Você não tem permissão para acessar esta página.
                  </p>
                  <Button onClick={() => navigate("/")}>
                    Voltar ao Início
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <nav className="text-sm text-muted-foreground mb-2">
                  Início / Aprovações
                </nav>
                <h1 className="text-3xl font-bold text-foreground">
                  Módulo de Aprovações
                </h1>
                <p className="text-muted-foreground mt-2">
                  Fluxo de revisão e aprovação para todas as atividades
                  institucionais.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Fluxo de Aprovação
            </h2>
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {approvalFlow.map((step, index) => (
                  <div key={index} className="relative">
                    <Card
                      className={`${step.color} border-border backdrop-blur-sm`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-white/70 text-slate-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                            {step.step}
                          </div>
                          <step.icon className="h-8 w-8 text-foreground" />
                        </div>
                        <CardTitle className="text-foreground text-lg">
                          {step.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground mb-2 font-semibold">
                          {step.role}
                        </p>
                        <p className="text-sm text-foreground">
                          {step.description}
                        </p>
                      </CardContent>
                    </Card>

                    {index < approvalFlow.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                        <ArrowRight className="h-8 w-8 text-[#EC0444]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Aprovações Pendentes
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={loadPendingApprovals}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Atualizar
              </Button>
            </div>

            <Card className="bg-card border-border">
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <span>Carregando aprovações...</span>
                  </div>
                ) : pendingApprovals.length === 0 ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Nenhuma aprovação pendente
                      </h3>
                      <p className="text-muted-foreground">
                        Todos os itens foram processados.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left text-foreground p-4 font-medium">
                            Tipo
                          </th>
                          <th className="text-left text-foreground p-4 font-medium">
                            Título
                          </th>
                          <th className="text-left text-foreground p-4 font-medium">
                            Criador
                          </th>
                          <th className="text-left text-foreground p-4 font-medium">
                            Departamento/Área
                          </th>
                          <th className="text-left text-foreground p-4 font-medium">
                            Enviado em
                          </th>
                          <th className="text-left text-foreground p-4 font-medium">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApprovals.map((approval) => (
                          <tr
                            key={approval.id}
                            className="border-b border-border"
                          >
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                                  approval.type
                                )}`}
                              >
                                {getTypeLabel(approval.type)}
                              </span>
                            </td>
                            <td className="text-foreground p-4 font-medium">
                              {approval.title}
                            </td>
                            <td className="text-muted-foreground p-4">
                              {approval.creatorName}
                            </td>
                            <td className="text-muted-foreground p-4">
                              {approval.departmentOrArea}
                            </td>
                            <td className="text-muted-foreground p-4">
                              {formatDate(approval.submittedAt)}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() =>
                                    handleApprove(approval.id, approval.type)
                                  }
                                  disabled={processingId === approval.id}
                                >
                                  {processingId === approval.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() =>
                                    handleReject(approval.id, approval.type)
                                  }
                                  disabled={processingId === approval.id}
                                >
                                  {processingId === approval.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <X className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Critérios de Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {approvalCriteria.map((criteria, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-muted rounded-lg"
                  >
                    <h3 className="text-foreground font-semibold mb-2">
                      {criteria.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {criteria.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
      <FloatingRating />
    </div>
  );
};

export default Approvals;
