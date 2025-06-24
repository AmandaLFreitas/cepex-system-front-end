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
  name?: string;
  email?: string;
}

interface AlunoInscrito {
  id: string;
  name: string;
  registration: string;
  email: string;
}

interface ExtensionProject {
  id: string;
  title: string;
  description: string;
  location: string;
  targetBeneficiaries: string;
  startDate: string;
  endDate: string;
  status: string;
  coordinator: User;
  team?: User[];
  inscritosCount?: number;
}

interface ViewExtensionProjectDetailsDialogProps {
  projeto: ExtensionProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRoles: string[];
  onStatusChange?: () => void;
}

const ViewExtensionProjectDetailsDialog = ({
  projeto,
  open,
  onOpenChange,
  userRoles,
  onStatusChange
}: ViewExtensionProjectDetailsDialogProps) => {
  const [inscritos, setInscritos] = useState<AlunoInscrito[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const canManageProject = userRoles.some(role => ['ADMIN', 'COORDINATOR', 'SECRETARY'].includes(role));

  useEffect(() => {
    if (projeto) {
      const fetchInscritos = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/extension-projects/${projeto.id}/inscricoes`);
          const participantes = response.data.map((inscricao: any) => {
            const user = inscricao.aluno;
            const name = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.name || user.login);
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
            Detalhes completos do projeto de extensão.
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
                {renderField("Localização", projeto.location)}
                {renderField("Público Alvo", projeto.targetBeneficiaries)}
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center"><Users className="h-5 w-5 mr-2" />Equipe</h3>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="default">
                        <User className="h-3 w-3 mr-1.5" />
                        Coordenador: {projeto.coordinator?.name || projeto.coordinator?.login}
                    </Badge>
                    {projeto.team?.map(colab => (
                         <Badge key={colab.id} variant="secondary">
                            Colaborador: {colab.name || colab.login}
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
                        {renderField("Título", projeto.title)}
                        {renderField("Descrição", projeto.description)}
                        {renderField("Localização", projeto.location)}
                        {renderField("Público Alvo", projeto.targetBeneficiaries)}
                        <div>
                            <h4 className="font-semibold text-sm text-foreground">Período de Execução</h4>
                            <p className="text-sm text-muted-foreground">
                                De {formatDate(projeto.startDate)} até {formatDate(projeto.endDate)}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-foreground">Status</h4>
                            <Badge className={`${getStatusDisplay(projeto.status).color} text-white`}>
                                {getStatusDisplay(projeto.status).text}
                            </Badge>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="team">
                    <AccordionTrigger>
                        <h3 className="font-semibold text-lg flex items-center"><Users className="h-5 w-5 mr-2" />Equipe do Projeto</h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/50 rounded-b-lg">
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-semibold text-sm text-foreground mb-2">Coordenador</h4>
                                <div className="p-3 bg-background rounded border">
                                    <p className="text-sm font-medium text-foreground">{projeto.coordinator?.name || projeto.coordinator?.login}</p>
                                    <p className="text-xs text-muted-foreground">{projeto.coordinator?.email}</p>
                                </div>
                            </div>
                            
                            {projeto.team && projeto.team.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-sm text-foreground mb-2">Colaboradores ({projeto.team.length})</h4>
                                    <div className="space-y-2">
                                        {projeto.team.map((colab) => (
                                            <div key={colab.id} className="p-3 bg-background rounded border">
                                                <p className="text-sm font-medium text-foreground">{colab.name || colab.login}</p>
                                                <p className="text-xs text-muted-foreground">{colab.email}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="enrolled-students">
                    <AccordionTrigger>
                        <h3 className="font-semibold text-lg flex items-center">
                            <ClipboardList className="h-5 w-5 mr-2" />
                            Alunos Inscritos ({inscritos.length})
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/50 rounded-b-lg">
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground">Carregando...</p>
                        ) : inscritos.length > 0 ? (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-foreground">
                                    Total de alunos inscritos: {inscritos.length}
                                </p>
                                <div className="grid gap-2">
                                    {inscritos.map((aluno, index) => (
                                        <div key={aluno.id} className="flex items-center justify-between p-2 bg-background rounded border">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{aluno.name}</p>
                                                <p className="text-xs text-muted-foreground">RA: {aluno.registration} | {aluno.email}</p>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                #{index + 1}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Nenhum aluno inscrito neste projeto.</p>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

        <DialogFooter className="sm:justify-between gap-2 flex-wrap">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                <X className="h-4 w-4 mr-2" />
                Fechar
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewExtensionProjectDetailsDialog; 