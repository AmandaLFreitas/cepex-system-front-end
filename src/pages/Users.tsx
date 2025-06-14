import { useEffect, useState } from "react";
import Header from "@/components/ui/modal/Header";
import Footer from "@/components/ui/modal/Footer";
import FloatingRating from "@/components/ui/modal/FloatingRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Users as UsersIcon,
  GraduationCap,
  UserCheck,
  Shield,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface UserCount {
  STUDENT: number;
  PROFESSOR: number;
  COORDINATOR: number;
  SECRETARY: number;
}

const Users = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userCounts, setUserCounts] = useState<UserCount>({
    STUDENT: 0,
    PROFESSOR: 0,
    COORDINATOR: 0,
    SECRETARY: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await api.get("/users");
        setUserCounts(response.data);
      } catch (error) {
        toast({
          title: "Erro!",
          description: "Não foi possível carregar os dados dos usuários.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCounts();
  }, [toast]);

  const userTypes = [
    {
      title: "Alunos",
      description: "Estudantes matriculados em cursos da instituição",
      icon: GraduationCap,
      color: "bg-gradient-to-br from-slate-600 to-slate-700",
      textColor: "text-white",
      count: userCounts.STUDENT,
      permissions: [
        "Visualizar Atividades",
        "Inscrever-se em Atividades",
        "Emitir certificados",
      ],
    },
    {
      title: "Professores",
      description: "Docentes responsáveis por disciplinas e projetos",
      icon: UserCheck,
      color: "bg-gradient-to-br from-[#EC0444] to-[#EC0444]/60",
      textColor: "text-white",
      count: userCounts.PROFESSOR,
      permissions: [
        "Criar Atividades",
        "Propor projetos",
        "Gerenciar participantes",
      ],
    },
    {
      title: "Coordenadores",
      description: "Responsáveis por coordenar cursos e departamentos",
      icon: UsersIcon,
      color: "bg-gradient-to-br from-slate-600 to-slate-700",
      textColor: "text-white",
      count: userCounts.COORDINATOR,
      permissions: [
        "Revisar Atividades",
        "Aprovar projetos",
        "Acompanhar atividades",
      ],
    },
    {
      title: "Secretarias",
      description: "Equipe administrativa de suporte institucional",
      icon: Shield,
      color: "bg-gradient-to-br from-[#EC0444] to-[#EC0444]/60",
      textColor: "text-white",
      count: userCounts.SECRETARY,
      permissions: [
        "Aprovação final",
        "Gerenciar documentação",
        "Emitir relatórios",
      ],
    },
  ];

  const userCharacteristics = [
    {
      title: "Identificação",
      description: "Cada usuário possui identificação única no sistema",
    },
    {
      title: "Matrícula",
      description: "Registro individual para autenticação e rastreabilidade",
    },
    {
      title: "Função/Papel",
      description: "Define permissões e acesso a recursos específicos",
    },
    {
      title: "Departamento",
      description: "Vinculação organizacional dentro da instituição",
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
            <Button
              onClick={() => navigate("/usuarios/cadastrar")}
              className="bg-[#EC0444] hover:bg-[#EC0444]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
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
                      <span className={`text-2xl font-bold ${type.textColor}`}>
                        {isLoading ? "..." : type.count}
                      </span>
                      <type.icon className={`h-8 w-8 ${type.textColor}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p
                    className={`mb-4 ${
                      type.textColor === "text-white"
                        ? "text-slate-200"
                        : "text-muted-foreground"
                    }`}
                  >
                    {type.description}
                  </p>
                  <div>
                    <h4
                      className={`font-semibold mb-2 ${
                        type.textColor === "text-white"
                          ? "text-slate-300"
                          : "text-muted-foreground"
                      }`}
                    >
                      Permissões:
                    </h4>
                    <ul className="space-y-1">
                      {type.permissions.map((permission, idx) => (
                        <li
                          key={idx}
                          className={`text-sm flex items-center ${
                            type.textColor === "text-white"
                              ? "text-slate-300"
                              : "text-muted-foreground"
                          }`}
                        >
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

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                Características dos Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userCharacteristics.map((char, index) => (
                  <div
                    key={index}
                    className="text-center p4 bg-muted rounded-lg"
                  >
                    <h3 className="text-foreground font-semibold mb-2">
                      {char.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {char.description}
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

export default Users;
