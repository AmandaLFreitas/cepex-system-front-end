import React, { useState } from "react";
import Header from "@/components/ui/modal/Header";
import Footer from "@/components/ui/modal/Footer";
import FloatingRating from "@/components/ui/modal/FloatingRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Activities = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inscricoes, setInscricoes] = useState<string[]>([]);

  const handleInscricao = (tipo: string) => {
    if (inscricoes.includes(tipo)) {
      setInscricoes(inscricoes.filter((item) => item !== tipo));
      toast({
        title: "Desinscrição realizada",
        description: `Você se desinscreveu de ${tipo}`,
      });
    } else {
      setInscricoes([...inscricoes, tipo]);
      toast({
        title: "Inscrição realizada",
        description: `Você se inscreveu em ${tipo}`,
      });
    }
  };

  const activityTypes = [
    {
      id: "monitorias",
      title: "Monitorias",
      description:
        "Apoio acadêmico em disciplinas específicas com estudantes monitores",
      icon: Users,
      color: "bg-gradient-to-br from-[#EC0444]/50 to-[#EC0444]/50",
      detailText:
        "Estudantes monitores auxiliam colegas em disciplinas específicas",
      route: "/monitorias",
    },
    {
      id: "pesquisa",
      title: "Projetos de Pesquisa",
      description: "Iniciação científica e projetos de pesquisa acadêmica",
      icon: BookOpen,
      color: "bg-gradient-to-br from-blue-500/50 to-blue-600/50",
      detailText:
        "Projetos de iniciação científica e desenvolvimento acadêmico",
      route: "/projetos-pesquisa",
    },
    {
      id: "extensao",
      title: "Projetos de Extensão",
      description: "Projetos que conectam a universidade à comunidade",
      icon: Heart,
      color: "bg-gradient-to-br from-green-500/50 to-green-600/50",
      detailText: "Projetos que conectam a universidade com a comunidade",
      route: "/projetos-extensao",
    },
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
                Início / Atividades
              </nav>
              <h1 className="text-3xl font-bold text-foreground">
                Módulo de Atividades
              </h1>
              <p className="text-muted-foreground mt-2">
                Gerencie monitorias, projetos de pesquisa e extensão
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {activityTypes.map((type, index) => (
              <Card
                onClick={() => navigate(type.route)}
                key={index}
                className={`${type.color} border-border cursor-pointer transition-all duration-200 transform hover:scale-105`}
              >
                <CardHeader className="pb-4">
                  <div className="text-center">
                    <type.icon className="h-16 w-16 text-foreground mx-auto mb-4" />
                    <CardTitle className="text-foreground text-xl">
                      {type.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground text-center">
                    {type.description}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => navigate(type.route)}
                      className="w-full bg-[#EC0444] hover:bg-[#EC0444]/90"
                    >
                      Acessar {type.title}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-card border-border mb-8">
            <CardHeader>
              <CardTitle className="text-foreground text-xl">
                Sobre as Atividades Acadêmicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activityTypes.map((info, index) => (
                  <div key={index} className="bg-muted p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <info.icon className="h-8 w-8 text-[#EC0444] mr-3" />
                      <h3 className="text-foreground font-semibold text-lg">
                        {info.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">{info.detailText}</p>
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

export default Activities;
