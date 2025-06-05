
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingRating from "@/components/FloatingRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users as UsersIcon, GraduationCap, UserCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      title: "Alunos",
      description: "Estudantes matriculados em cursos da instituição",
      icon: GraduationCap,
      color: "bg-gradient-to-br from-card to-card/80",
      textColor: "text-foreground",
      count: "1,234",
      permissions: [
        "Visualizar Atividades",
        "Inscrever-se em Atividades",
        "Emitir certificados"
      ]
    },
    {
      title: "Professores",
      description: "Docentes responsáveis por disciplinas e projetos",
      icon: UserCheck,
      color: "bg-gradient-to-br from-[#EC0444]/80 to-[#EC0444]/40",
      textColor: "text-white",
      count: "156",
      permissions: [
        "Criar Atividades",
        "Propor projetos",
        "Gerenciar participantes"
      ]
    },
    {
      title: "Coordenadores",
      description: "Responsáveis por coordenar cursos e departamentos",
      icon: UsersIcon,
      color: "bg-gradient-to-br from-card to-card/80",
      textColor: "text-foreground",
      count: "43",
      permissions: [
        "Revisar Atividades",
        "Aprovar projetos",
        "Acompanhar atividades"
      ]
    },
    {
      title: "Secretarias",
      description: "Equipe administrativa de suporte institucional",
      icon: Shield,
      color: "bg-gradient-to-br from-[#EC0444]/80 to-[#EC0444]/40",
      textColor: "text-white",
      count: "28",
      permissions: [
        "Aprovação final",
        "Gerenciar documentação",
        "Emitir relatórios"
      ]
    }
  ];

  const userCharacteristics = [
    {
      title: "Identificação",
      description: "Cada usuário possui identificação única no sistema"
    },
    {
      title: "Matrícula",
      description: "Registro individual para autenticação e rastreabilidade"
    },
    {
      title: "Função/Papel",
      description: "Define permissões e acesso a recursos específicos"
    },
    {
      title: "Departamento",
      description: "Vinculação organizacional dentro da instituição"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
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
                Início / Usuários
              </nav>
              <h1 className="text-3xl font-bold text-foreground">
                Módulo de Usuários
              </h1>
              <p className="text-muted-foreground mt-2">
                Gerencie todos os perfis de usuários do sistema acadêmico
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {userTypes.map((type, index) => (
              <Card
                key={index}
                className={`${type.color} border-border cursor-pointer hover:scale-105 transition-transform duration-200`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-xl ${type.textColor}`}>
                      {type.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className={`text-2xl font-bold ${type.textColor}`}>{type.count}</span>
                      <type.icon className={`h-8 w-8 ${type.textColor}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`mb-4 ${type.textColor === 'text-white' ? 'text-slate-200' : 'text-muted-foreground'}`}>
                    {type.description}
                  </p>
                  <div>
                    <h4 className={`font-semibold mb-2 ${type.textColor === 'text-white' ? 'text-slate-300' : 'text-muted-foreground'}`}>Permissões:</h4>
                    <ul className="space-y-1">
                      {type.permissions.map((permission, idx) => (
                        <li key={idx} className={`text-sm flex items-center ${type.textColor === 'text-white' ? 'text-slate-300' : 'text-muted-foreground'}`}>
                          <span className="w-2 h-2 bg-[#EC0444] rounded-full mr-2"></span>
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-[#EC0444]/80 to-[#EC0444]/40 border-border">
            <CardHeader>
              <CardTitle className="text-white text-xl">
                Características dos Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userCharacteristics.map((char, index) => (
                  <div key={index} className="text-center">
                    <h3 className="text-white font-semibold mb-2">{char.title}</h3>
                    <p className="text-slate-200 text-sm">{char.description}</p>
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

export default Users;
