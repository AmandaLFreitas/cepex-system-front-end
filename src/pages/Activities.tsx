
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, BookOpen, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Activities = () => {
  const navigate = useNavigate();

  const activityTypes = [
    {
      title: "Monitorias",
      description: "Apoio acadêmico em disciplinas específicas com estudantes monitores",
      icon: Users,
      color: "bg-blue-600",
      detailText: "Estudantes monitores auxiliam colegas em disciplinas específicas"
    },
    {
      title: "Projetos de Pesquisa",
      description: "Iniciação científica e projetos de pesquisa acadêmica",
      icon: BookOpen,
      color: "bg-green-600",
      detailText: "Projetos de iniciação científica e desenvolvimento acadêmico"
    },
    {
      title: "Projetos de Extensão",
      description: "Projetos que conectam a universidade à comunidade",
      icon: Heart,
      color: "bg-purple-600",
      detailText: "Projetos que conectam a universidade com a comunidade"
    }
  ];

  const academicInfo = [
    {
      title: "Monitorias",
      description: "Estudantes monitores auxiliam colegas em disciplinas específicas",
      icon: Users,
      iconColor: "text-red-400"
    },
    {
      title: "Pesquisa",
      description: "Projetos de iniciação científica e desenvolvimento acadêmico",
      icon: BookOpen,
      iconColor: "text-red-400"
    },
    {
      title: "Extensão",
      description: "Projetos que conectam a universidade com a comunidade",
      icon: Heart,
      iconColor: "text-red-400"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col">
      <Header />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-slate-300 hover:text-white mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <nav className="text-sm text-slate-400 mb-2">
                Início / Atividades
              </nav>
              <h1 className="text-3xl font-bold text-white">
                Módulo de Atividades
              </h1>
              <p className="text-slate-300 mt-2">
                Gerencie monitorias, projetos de pesquisa e extensão
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {activityTypes.map((type, index) => (
              <Card
                key={index}
                className={`${type.color} border-slate-600 cursor-pointer hover:scale-105 transition-transform duration-200`}
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

          <Card className="bg-slate-700 border-slate-600 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-xl">
                Sobre as Atividades Acadêmicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {academicInfo.map((info, index) => (
                  <div key={index} className="bg-slate-800 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <info.icon className={`h-8 w-8 ${info.iconColor} mr-3`} />
                      <h3 className="text-white font-semibold text-lg">{info.title}</h3>
                    </div>
                    <p className="text-slate-300">{info.description}</p>
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

export default Activities;
