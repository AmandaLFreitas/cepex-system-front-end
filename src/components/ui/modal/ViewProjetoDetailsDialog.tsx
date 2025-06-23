import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { X, Users, Calendar, Info, BookOpen, User, ClipboardList } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '../use-toast';

interface User {
  id: string;
  login: string;
  firstName?: string;
  lastName?: string;
}

interface AlunoInscrito {
  id: string;
  name: string;
  registration: string;
  email: string;
}

interface Projeto {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  leadResearcher: User;
  collaborators?: User[];
  materialUsage?: string;
  researchLine?: string;
  subjectTheme?: string;
  justification?: string;
  problemFormulation?: string;
  hypothesisFormulation?: string;
  generalObjective?: string;
  specificObjective?: string;
  theoreticalFoundation?: string;
  methodologicalApproaches?: string;
  projectReferences?: string;
}

interface ViewProjetoDetailsDialogProps {
  projeto: Projeto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRoles: string[];
  onStatusChange: () => void;
}

const ViewProjetoDetailsDialog = ({ 
  projeto, 
  open, 
  onOpenChange,
  userRoles,
  onStatusChange
}: ViewProjetoDetailsDialogProps) => {
  const [inscritos, setInscritos] = useState<AlunoInscrito[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const canManageProject = userRoles.some(role => ['ADMIN', 'COORDINATOR', 'SECRETARY'].includes(role));

  useEffect(() => {
    if (projeto) {
      const fetchInscritos = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/research-projects/${projeto.id}/inscricoes`);
          const participantes = response.data.map((inscricao: any) => {
            const user = inscricao.aluno;
            const name = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.login;
            return {
              id: user.id,
              name: name,
              registration: user.ra || 'N/A',
              email: user.email,
            };
          });
          setInscritos(participantes);
        } catch (error) {
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar os alunos inscritos.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchInscritos();
    }
  }, [projeto, toast]);

  const handleChangeStatus = async (newStatus: string) => {
    if (!projeto) return;
    try {
      await api.patch(`/research-projects/${projeto.id}/status`, { status: newStatus });
      toast({
        title: 'Sucesso',
        description: `O status do projeto foi alterado para ${newStatus}.`,
      });
      onStatusChange();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do projeto.',
        variant: 'destructive',
      });
    }
  };

  if (!projeto) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'ABERTO': return { text: 'Aberto', color: 'bg-green-500' };
      case 'ANALISE': return { text: 'Em Análise', color: 'bg-yellow-500' };
      case 'COMPLETO': return { text: 'Concluído', color: 'bg-blue-500' };
      case 'CANCELADO': return { text: 'Cancelado', color: 'bg-red-500' };
      default: return { text: status, color: 'bg-gray-500' };
    }
  };
  
  const renderField = (label: string, value?: string) => (
    value && (
        <div>
            <h4 className="font-semibold text-sm text-foreground">{label}</h4>
            <p className="text-sm text-muted-foreground">{value}</p>
        </div>
    )
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Info className="h-6 w-6 mr-3 text-primary" />
            {projeto.title}
          </DialogTitle>
          <DialogDescription>
            Detalhes completos do projeto de pesquisa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
            <div className="flex justify-between items-center">
                <Badge className={`${getStatusDisplay(projeto.status).color} text-white`}>
                    {getStatusDisplay(projeto.status).text}
                </Badge>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Início: {formatDate(projeto.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Fim: {formatDate(projeto.endDate)}</span>
                    </div>
                </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                {renderField("Descrição", projeto.description)}
                {renderField("Linha de Pesquisa", projeto.researchLine)}
                {renderField("Utilização de Material", projeto.materialUsage)}
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center"><Users className="h-5 w-5 mr-2" />Equipe</h3>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="default">
                        <User className="h-3 w-3 mr-1.5" />
                        Pesquisador Lider: {projeto.leadResearcher.login}
                    </Badge>
                    {projeto.collaborators?.map(colab => (
                         <Badge key={colab.id} variant="secondary">
                            Colaborador: {colab.login}
                        </Badge>
                    ))}
                </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="project-info">
                    <AccordionTrigger>
                        <h3 className="font-semibold text-lg flex items-center"><BookOpen className="h-5 w-5 mr-2" />Informações Detalhadas do Projeto</h3>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 p-4 bg-muted/50 rounded-b-lg">
                        {renderField("Assunto/Tema", projeto.subjectTheme)}
                        {renderField("Justificativa", projeto.justification)}
                        {renderField("Formulação do Problema", projeto.problemFormulation)}
                        {renderField("Hipótese", projeto.hypothesisFormulation)}
                        {renderField("Objetivo Geral", projeto.generalObjective)}
                        {renderField("Objetivos Específicos", projeto.specificObjective)}
                        {renderField("Fundamentação Teórica", projeto.theoreticalFoundation)}
                        {renderField("Encaminhamentos Metodológicos", projeto.methodologicalApproaches)}
                        {renderField("Referências", projeto.projectReferences)}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="enrolled-students">
                    <AccordionTrigger>
                        <h3 className="font-semibold text-lg flex items-center"><ClipboardList className="h-5 w-5 mr-2" />Alunos Inscritos</h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/50 rounded-b-lg">
                        {isLoading ? (
                            <p>Carregando...</p>
                        ) : inscritos.length > 0 ? (
                            <ul className="space-y-2">
                                {inscritos.map(aluno => (
                                    <li key={aluno.id} className="text-sm text-muted-foreground">{aluno.name} ({aluno.email})</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">Nenhum aluno inscrito neste projeto.</p>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

        <DialogFooter className="sm:justify-between gap-2 flex-wrap">
            {canManageProject && (
                <div className="flex gap-2 flex-wrap">
                    {projeto.status === 'ANALISE' && (
                        <Button onClick={() => handleChangeStatus('ABERTO')} className="bg-green-600 hover:bg-green-700">Aprovar Projeto</Button>
                    )}
                    {projeto.status !== 'CANCELADO' && projeto.status !== 'COMPLETO' && (
                         <Button onClick={() => handleChangeStatus('CANCELADO')} variant="destructive">Cancelar Projeto</Button>
                    )}
                     {projeto.status === 'ABERTO' && (
                        <Button onClick={() => handleChangeStatus('COMPLETO')} className="bg-blue-600 hover:bg-blue-700">Concluir Projeto</Button>
                    )}
                </div>
            )}

            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                <X className="h-4 w-4 mr-2" />
                Fechar
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProjetoDetailsDialog; 