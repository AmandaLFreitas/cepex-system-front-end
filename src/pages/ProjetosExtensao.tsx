import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingRating from "@/components/FloatingRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, Plus, Users, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreateProjetoDialog from "@/components/CreateProjetoDialog";
import { useToast } from "@/components/ui/use-toast";

const ProjetosExtensao = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [participacoes, setParticipacao] = useState<number[]>([2]); // Projeto 2 já inscrito
  const { toast } = useToast();

  const handleParticipacao = (projetoId: number, titulo: string) => {
    if (participacoes.includes(projetoId)) {
      setParticipacao(participacoes.filter(id => id !== projetoId));
      toast({
        title: "Participação cancelada",
        description: `Você cancelou sua participação no projeto de extensão ${titulo}`,
      });
    } else {
      setParticipacao([...participacoes, projetoId]);
      toast({
        title: "Participação realizada",
        description: `Você se inscreveu no projeto de extensão ${titulo}`,
      });
    }
  };

  const projetos = [
    {
      id: 1,
      titulo: "Inteligência Artificial em Sistemas de Saúde",
      professor: "Prof. Dr. Carlos Silva",
      departamento: "Computação",
      descricao: "Desenvolvimento de algoritmos de IA para diagnóstico médico assistido.",
      inicio: "31/01/2025",
      participantes: 1,
      status: "Ativo",
      inscrito: false
    },
    {
      id: 2,
      titulo: "Sustentabilidade em Materiais de Construção",
      professor: "Prof. Dra. Ana Santos",
      departamento: "Engenharia Civil",
      descricao: "Pesquisa sobre materiais sustentáveis para construção civil.",
      inicio: "28/02/2025",
      participantes: 4,
      status: "Ativo",
      inscrito: true
    },
    {
      id: 3,
      titulo: "Biotecnologia Aplicada à Agricultura",
      professor: "Prof. Dr. João Costa",
      departamento: "Biotecnologia",
      descricao: "Desenvolvimento de soluções biotecnológicas para agricultura sustentável.",
      inicio: "14/02/2025",
      participantes: 2,
      status: "Ativo",
      inscrito: false
    }
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
                onClick={() => navigate("/atividades")}
                className="text-muted-foreground hover:text-foreground mr-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <nav className="text-sm text-muted-foreground mb-2">
                  Início / Atividades / Projetos de Extensão
                </nav>
                <h1 className="text-3xl font-bold text-foreground">
                  Projetos de Extensão
                </h1>
                <p className="text-muted-foreground mt-2">
                  Iniciação científica e desenvolvimento acadêmico
                </p>
              </div>
            </div>
            <Button 
              className="bg-[#EC0444] hover:bg-[#EC0444]/90"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Projeto
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por título, orientador ou área..."
                className="pl-10"
              />
            </div>
            <Select defaultValue="todas">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as áreas</SelectItem>
                <SelectItem value="computacao">Computação</SelectItem>
                <SelectItem value="engenharia">Engenharia</SelectItem>
                <SelectItem value="biotecnologia">Biotecnologia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {projetos.map((projeto) => (
              <Card key={projeto.id} className="bg-card border-border">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-foreground mb-2">
                      {projeto.titulo}
                    </CardTitle>
                    <span className="px-2 py-1 rounded text-xs bg-green-500 text-white">
                      {projeto.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{projeto.professor}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>{projeto.departamento}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {projeto.descricao}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Início: {projeto.inicio}</span>
                    </div>
                    <span>{projeto.participantes} participantes</span>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      className={`w-full ${
                        participacoes.includes(projeto.id)
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-[#EC0444] hover:bg-[#EC0444]/90'
                      }`}
                      onClick={() => handleParticipacao(projeto.id, projeto.titulo)}
                    >
                      {participacoes.includes(projeto.id) 
                        ? 'Cancelar Participação' 
                        : 'Inscrever-se'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingRating />
      <CreateProjetoDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
};

export default ProjetosExtensao;
