import Header from "@/components/ui/modal/Header";
import Footer from "@/components/ui/modal/Footer";
import FloatingRating from "@/components/ui/modal/FloatingRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudent = user?.role === "STUDENT";
  const isProfessor = user?.role === "PROFESSOR";

  const modules = [
    {
      title: "Usuários",
      description: "Gerencie estudantes, professores e coordenadores",
      icon: Users,
      path: "/usuarios",
      color: "bg-gradient-to-br from-[#EC0444] to-[#EC0444]/60",
      showForStudent: false,
      showForProfessor: false,
    },
    {
      title: "Atividades",
      description: "Monitorias, pesquisa e projetos de extensão",
      icon: BookOpen,
      path: "/atividades",
      color: "bg-gradient-to-br from-slate-600 to-slate-700",
      showForStudent: true,
    },
    {
      title: "Aprovações",
      description: "Fluxo de revisão e aprovação de atividades",
      icon: CheckCircle,
      path: "/aprovacoes",
      color: "bg-gradient-to-br from-blue-600 to-blue-700",
      showForStudent: true,
    },
    {
      title: "Certificados",
      description: "Geração e validação de certificados",
      icon: Award,
      path: "/certificados",
      color: "bg-gradient-to-br from-green-600 to-green-700",
      showForStudent: true,
    },
  ];

  const filteredModules = modules.filter(
    (module) =>
      (!isStudent && module.showForStudent) ||
      (!isProfessor && module.showForProfessor)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Bem-vindo ao CEPEX System - Centro de Pesquisa e Extensão
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredModules.map((module, index) => (
              <Card
                key={index}
                className={`${module.color} border-border cursor-pointer transition-all duration-200 transform hover:scale-105`}
                onClick={() => navigate(module.path)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <module.icon className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card border-border mt-8">
            <CardHeader>
              <CardTitle className="text-foreground">
                Estatísticas Gerais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#EC0444]">1,234</div>
                  <div className="text-sm text-muted-foreground">
                    Usuários Ativos
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#EC0444]">89</div>
                  <div className="text-sm text-muted-foreground">
                    Atividades Ativas
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#EC0444]">15</div>
                  <div className="text-sm text-muted-foreground">
                    Aprovações Pendentes
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#EC0444]">456</div>
                  <div className="text-sm text-muted-foreground">
                    Certificados Emitidos
                  </div>
                </div>
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

export default Dashboard;
