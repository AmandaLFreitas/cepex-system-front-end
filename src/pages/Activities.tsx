
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingRating from "@/components/FloatingRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, BookOpen, Heart, Plus, UserPlus, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Activities = () => {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const activityTypes = [
    {
      id: "monitorias",
      title: "Monitorias",
      description: "Apoio acadêmico em disciplinas específicas com estudantes monitores",
      icon: Users,
      color: "bg-slate-600 hover:bg-slate-700",
      detailText: "Estudantes monitores auxiliam colegas em disciplinas específicas"
    },
    {
      id: "pesquisa",
      title: "Projetos de Pesquisa",
      description: "Iniciação científica e projetos de pesquisa acadêmica",
      icon: BookOpen,
      color: "bg-slate-600 hover:bg-slate-700",
      detailText: "Projetos de iniciação científica e desenvolvimento acadêmico"
    },
    {
      id: "extensao",
      title: "Projetos de Extensão",
      description: "Projetos que conectam a universidade à comunidade",
      icon: Heart,
      color: "bg-slate-600 hover:bg-slate-700",
      detailText: "Projetos que conectam a universidade com a comunidade"
    }
  ];

  const sampleActivities = {
    monitorias: [
      { id: 1, name: "Monitoria de Cálculo I", professor: "Prof. João Silva", spots: 5 },
      { id: 2, name: "Monitoria de Programação", professor: "Prof. Maria Santos", spots: 3 },
      { id: 3, name: "Monitoria de Química Geral", professor: "Prof. Ana Costa", spots: 4 }
    ],
    pesquisa: [
      { id: 1, name: "Inteligência Artificial em Saúde", professor: "Prof. Carlos Lima", spots: 2 },
      { id: 2, name: "Sustentabilidade Urbana", professor: "Prof. Lucia Ferreira", spots: 3 },
      { id: 3, name: "Biotecnologia Aplicada", professor: "Prof. Roberto Souza", spots: 1 }
    ],
    extensao: [
      { id: 1, name: "Projeto Educação Digital", professor: "Prof. Fernanda Oliveira", spots: 6 },
      { id: 2, name: "Saúde na Comunidade", professor: "Prof. Pedro Alves", spots: 4 },
      { id: 3, name: "Arte e Cultura Local", professor: "Prof. Juliana Rocha", spots: 5 }
    ]
  };

  const renderActivityDetails = (activityId: string) => {
    const activities = sampleActivities[activityId as keyof typeof sampleActivities] || [];

    return (
      <div className="mt-6">
        <Tabs defaultValue="disponivel" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="disponivel">Disponível</TabsTrigger>
            <TabsTrigger value="criar">Criar</TabsTrigger>
            <TabsTrigger value="minhas">Minhas Atividades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="disponivel" className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Atividades Disponíveis</h3>
            {activities.map((activity) => (
              <Card key={activity.id} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-foreground">{activity.name}</h4>
                      <p className="text-sm text-muted-foreground">{activity.professor}</p>
                      <p className="text-xs text-muted-foreground">{activity.spots} vagas disponíveis</p>
                    </div>
                    <Button className="bg-[#EC0444] hover:bg-[#EC0444]/90">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Inscrever-se
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="criar" className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Criar Nova Atividade</h3>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <Button className="w-full bg-[#EC0444] hover:bg-[#EC0444]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Nova Atividade
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="minhas" className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Minhas Atividades</h3>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-foreground">Monitoria de Cálculo I</h4>
                    <p className="text-sm text-muted-foreground">Status: Inscrito</p>
                  </div>
                  <Button variant="outline" className="border-[#EC0444] text-[#EC0444] hover:bg-[#EC0444] hover:text-white">
                    <UserMinus className="h-4 w-4 mr-2" />
                    Desinscrever-se
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

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

          {!selectedActivity ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {activityTypes.map((type, index) => (
                <Card
                  key={index}
                  className={`${type.color} border-border cursor-pointer transition-all duration-200 transform hover:scale-105`}
                  onClick={() => setSelectedActivity(type.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="text-center">
                      <type.icon className="h-16 w-16 text-white mx-auto mb-4" />
                      <CardTitle className="text-white text-xl">
                        {type.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-200 text-center">
                      {type.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <Button
                variant="ghost"
                onClick={() => setSelectedActivity(null)}
                className="mb-4 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para tipos de atividades
              </Button>
              
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    {activityTypes.find(t => t.id === selectedActivity)?.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderActivityDetails(selectedActivity)}
                </CardContent>
              </Card>
            </div>
          )}

          {!selectedActivity && (
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
                        <h3 className="text-foreground font-semibold text-lg">{info.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{info.detailText}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
      <FloatingRating />
    </div>
  );
};

export default Activities;
