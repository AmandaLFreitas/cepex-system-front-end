
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Users, Shield, Globe } from "lucide-react";
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
      color: "bg-blue-600"
    },
    {
      step: 2,
      title: "Revisão Inicial",
      role: "Coordenador",
      description: "Coordenador analisa viabilidade acadêmica e adequação",
      color: "bg-purple-600"
    },
    {
      step: 3,
      title: "Aprovação Final",
      role: "Secretaria",
      description: "Secretaria valida e confirma disponibilidade de recursos",
      color: "bg-green-600"
    },
    {
      step: 4,
      title: "Publicação",
      role: "Sistema",
      description: "Evento é publicado e disponibilizado para inscrições",
      color: "bg-pink-600"
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
      statusColor: "bg-yellow-600"
    },
    {
      id: "EVT-2023-046",
      event: "Palestra: Mercado Financeiro",
      creator: "Prof. Carlos Mendes",
      department: "Administração",
      submitted: "29/10/2023",
      status: "Aprovação Secretaria",
      statusColor: "bg-blue-600"
    },
    {
      id: "EVT-2023-047",
      event: "Curso de Excel Avançado",
      creator: "Prof. Ricardo Alves",
      department: "Ciências Contábeis",
      submitted: "01/11/2023",
      status: "Revisão Coordenador",
      statusColor: "bg-yellow-600"
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
    <div className="min-h-screen bg-slate-800 flex flex-col">
      <Header />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="text-slate-300 hover:text-white mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold text-white">
                Módulo de Aprovações
              </h1>
            </div>
            <p className="text-slate-300">
              Fluxo de revisão e aprovação para todos os Atividades institucionais.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Fluxo de Aprovação</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {approvalFlow.map((step, index) => (
                <Card key={index} className={`${step.color} border-slate-600`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-white text-slate-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {step.step}
                      </span>
                      <CardTitle className="text-white text-sm">
                        {step.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-slate-200 mb-2 font-semibold">{step.role}</p>
                    <p className="text-xs text-slate-200">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Aprovações Pendentes</h2>
            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-600">
                      <tr>
                        <th className="text-left text-white p-4 font-medium">ID</th>
                        <th className="text-left text-white p-4 font-medium">Evento</th>
                        <th className="text-left text-white p-4 font-medium">Criador</th>
                        <th className="text-left text-white p-4 font-medium">Departamento</th>
                        <th className="text-left text-white p-4 font-medium">Enviado em</th>
                        <th className="text-left text-white p-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApprovals.map((approval, index) => (
                        <tr key={index} className="border-b border-slate-600">
                          <td className="text-slate-300 p-4">{approval.id}</td>
                          <td className="text-white p-4 font-medium">{approval.event}</td>
                          <td className="text-slate-300 p-4">{approval.creator}</td>
                          <td className="text-slate-300 p-4">{approval.department}</td>
                          <td className="text-slate-300 p-4">{approval.submitted}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs text-white ${approval.statusColor}`}>
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

          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Critérios de Aprovação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {approvalCriteria.map((criteria, index) => (
                  <div key={index} className="text-center">
                    <h3 className="text-white font-semibold mb-2">{criteria.title}</h3>
                    <p className="text-slate-300 text-sm">{criteria.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Approvals;
