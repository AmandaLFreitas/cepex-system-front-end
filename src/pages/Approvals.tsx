
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingRating from "@/components/FloatingRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Users, Shield, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Approvals = () => {
  const navigate = useNavigate();

  const approvalFlow = [
    {
      step: 1,
      title: "Criação do Evento",
      role: "Professor",
      description: "Professor propõe um evento com todos os detalhes necessários",
      color: "bg-gradient-to-br from-blue-500/20 to-blue-600/30",
      icon: User
    },
    {
      step: 2,
      title: "Revisão Inicial",
      role: "Coordenador",
      description: "Coordenador analisa viabilidade acadêmica e adequação",
      color: "bg-gradient-to-br from-purple-500/20 to-purple-600/30",
      icon: Users
    },
    {
      step: 3,
      title: "Aprovação Final",
      role: "Secretaria",
      description: "Secretaria valida e confirma disponibilidade de recursos",
      color: "bg-gradient-to-br from-green-500/20 to-green-600/30",
      icon: Shield
    },
    {
      step: 4,
      title: "Publicação",
      role: "Sistema",
      description: "Evento é publicado e disponibilizado para inscrições",
      color: "bg-gradient-to-br from-[#EC0444]/20 to-[#EC0444]/30",
      icon: Globe
    }
  ];

  const pendingApprovals = [
    {
      id: "EVT-2023-045",
      event: "Workshop de Design Thinking",
      creator: "Profa. Ana Santos",
      department: "Computação",
      submitted: "27/10/2023",
      status: "Revisão Coordenador",
      statusColor: "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30"
    },
    {
      id: "EVT-2023-046",
      event: "Palestra: Mercado Financeiro",
      creator: "Prof. Carlos Mendes",
      department: "Administração",
      submitted: "29/10/2023",
      status: "Aprovação Secretaria",
      statusColor: "bg-blue-500/20 text-blue-600 border border-blue-500/30"
    },
    {
      id: "EVT-2023-047",
      event: "Curso de Excel Avançado",
      creator: "Prof. Ricardo Alves",
      department: "Ciências Contábeis",
      submitted: "01/11/2023",
      status: "Revisão Coordenador",
      statusColor: "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30"
    }
  ];

  const approvalCriteria = [
    {
      title: "Análise do Projeto",
      description: "Avaliação da qualidade, relevância e contribuição acadêmica do evento proposto"
    },
    {
      title: "Verificação de Recursos",
      description: "Análise da disponibilidade de espaços, equipamentos e orçamento necessários"
    },
    {
      title: "Alinhamento Institucional",
      description: "Conformidade com as políticas educacionais e valores da instituição"
    }
  ];

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
                  Fluxo de revisão e aprovação para todos os Atividades institucionais.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Fluxo de Aprovação</h2>
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {approvalFlow.map((step, index) => (
                  <div key={index} className="relative">
                    <Card className={`${step.color} border-border backdrop-blur-sm`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-white/90 text-slate-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                            {step.step}
                          </div>
                          <step.icon className="h-8 w-8 text-foreground" />
                        </div>
                        <CardTitle className="text-foreground text-lg">
                          {step.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-2 font-semibold">{step.role}</p>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
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
            <h2 className="text-xl font-semibold text-foreground mb-4">Aprovações Pendentes</h2>
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left text-foreground p-4 font-medium">ID</th>
                        <th className="text-left text-foreground p-4 font-medium">Evento</th>
                        <th className="text-left text-foreground p-4 font-medium">Criador</th>
                        <th className="text-left text-foreground p-4 font-medium">Departamento</th>
                        <th className="text-left text-foreground p-4 font-medium">Enviado em</th>
                        <th className="text-left text-foreground p-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApprovals.map((approval, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="text-muted-foreground p-4">{approval.id}</td>
                          <td className="text-foreground p-4 font-medium">{approval.event}</td>
                          <td className="text-muted-foreground p-4">{approval.creator}</td>
                          <td className="text-muted-foreground p-4">{approval.department}</td>
                          <td className="text-muted-foreground p-4">{approval.submitted}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${approval.statusColor}`}>
                              {approval.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Critérios de Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {approvalCriteria.map((criteria, index) => (
                  <div key={index} className="text-center p-4 bg-muted rounded-lg">
                    <h3 className="text-foreground font-semibold mb-2">{criteria.title}</h3>
                    <p className="text-muted-foreground text-sm">{criteria.description}</p>
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
