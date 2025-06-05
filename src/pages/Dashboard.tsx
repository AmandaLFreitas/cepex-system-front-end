
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, Award } from "lucide-react";

const Dashboard = () => {
  const mainCards = [
    {
      title: "Usuários",
      description: "Gerencie alunos, professores, coordenadores e secretarias",
      icon: Users,
      color: "bg-slate-700",
      href: "/usuarios"
    },
    {
      title: "Atividades",
      description: "Crie e gerencie diversos tipos de Atividades acadêmicos",
      icon: FileText,
      color: "bg-gradient-to-br from-pink-600 to-pink-700",
      href: "/atividades"
    },
    {
      title: "Aprovações",
      description: "Fluxo de revisão e aprovação de Atividades",
      icon: CheckCircle,
      color: "bg-slate-700",
      href: "/aprovacoes"
    },
    {
      title: "Certificados",
      description: "Geração e validação de certificados de participação",
      icon: Award,
      color: "bg-gradient-to-br from-pink-600 to-pink-700",
      href: "/certificados"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col">
      <Header />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              CEPEX <span className="text-pink-500">SYSTEM</span>
            </h1>
            <p className="text-slate-300 text-lg">
              Plataforma integrada para gerenciamento de Atividades e processos acadêmicos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {mainCards.map((card, index) => (
              <Card
                key={index}
                className={`${card.color} border-slate-600 cursor-pointer hover:scale-105 transition-transform duration-200`}
                onClick={() => window.location.href = card.href}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">
                      {card.title}
                    </CardTitle>
                    <card.icon className="h-8 w-8 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white text-xl">
                Gestão acadêmica simplificada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-center">
                Nossa plataforma fornece ferramentas intuitivas para todos os perfis da instituição, facilitando
                a criação, aprovação e participação em processos acadêmicos.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
