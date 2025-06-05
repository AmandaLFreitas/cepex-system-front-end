
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingRating from "@/components/FloatingRating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, Plus, Users, Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreateMonitoriaDialog from "@/components/CreateMonitoriaDialog";

const Monitorias = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const monitorias = [
    {
      id: 1,
      disciplina: "Cálculo I",
      professor: "Prof. João Silva",
      monitores: "Maria Santos",
      horario: "Segunda e Quarta - 14:00 às 16:00",
      local: "Sala 205",
      vagasMonitor: "1/2",
      candidatos: 2,
      status: "Aberta"
    },
    {
      id: 2,
      disciplina: "Física Geral",
      professor: "Prof. Ana Costa",
      monitores: "Pedro Oliveira, Julia Santos",
      horario: "Terça e Quinta - 16:00 às 18:00",
      local: "Lab. Física",
      vagasMonitor: "2/2",
      candidatos: 0,
      status: "Completa"
    },
    {
      id: 3,
      disciplina: "Programação",
      professor: "Prof. Carlos Lima",
      monitores: "Julia Ferreira",
      horario: "Sexta - 14:00 às 17:00",
      local: "Lab. Informática",
      vagasMonitor: "1/2",
      candidatos: 1,
      status: "Aberta"
    }
  ];

  const stats = [
    { number: 2, label: "Monitorias Abertas", color: "text-blue-500" },
    { number: 4, label: "Monitores Ativos", color: "text-green-500" },
    { number: 3, label: "Candidatos Pendentes", color: "text-purple-500" }
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
                  Início / Atividades / Monitorias
                </nav>
                <h1 className="text-3xl font-bold text-foreground">
                  Monitorias
                </h1>
                <p className="text-muted-foreground mt-2">
                  Acompanhamento e suporte acadêmico
                </p>
              </div>
            </div>
            <Button 
              className="bg-[#EC0444] hover:bg-[#EC0444]/90"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Monitoria
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por disciplina, professor ou monitor..."
                className="pl-10"
              />
            </div>
            <Select defaultValue="todos">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="aberta">Aberta</SelectItem>
                <SelectItem value="completa">Completa</SelectItem>
                <SelectItem value="encerrada">Encerrada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {monitorias.map((monitoria) => (
              <Card key={monitoria.id} className="bg-card border-border">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-foreground">
                      {monitoria.disciplina}
                    </CardTitle>
                    <span className={`px-2 py-1 rounded text-xs ${
                      monitoria.status === 'Aberta' ? 'bg-green-500 text-white' : 
                      monitoria.status === 'Completa' ? 'bg-blue-500 text-white' : 
                      'bg-gray-500 text-white'
                    }`}>
                      {monitoria.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span><strong>Professor:</strong> {monitoria.professor}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span><strong>Monitores:</strong> {monitoria.monitores}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span><strong>Horário:</strong> {monitoria.horario}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span><strong>Local:</strong> {monitoria.local}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Vagas para Monitor:</strong> {monitoria.vagasMonitor}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Candidatos:</strong> {monitoria.candidatos}
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    {monitoria.status === 'Aberta' ? (
                      <Button className="w-full bg-[#EC0444] hover:bg-[#EC0444]/90">
                        Candidatar-se a Monitor
                      </Button>
                    ) : (
                      <div className="text-center py-3 bg-muted rounded">
                        <span className="text-sm text-muted-foreground">Vagas Preenchidas</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card border-border text-center">
                <CardContent className="p-6">
                  <Users className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                  <div className={`text-4xl font-bold ${stat.color}`}>{stat.number}</div>
                  <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingRating />
      <CreateMonitoriaDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
};

export default Monitorias;
