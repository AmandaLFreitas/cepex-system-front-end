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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Save, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '../use-toast';

interface User {
  id: string;
  login: string;
  firstName?: string;
  lastName?: string;
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

interface EditProjetoDialogProps {
  projeto: Projeto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditProjetoDialog = ({ 
  projeto, 
  open, 
  onOpenChange,
  onSuccess
}: EditProjetoDialogProps) => {
  const [formData, setFormData] = useState<Partial<Projeto>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (projeto) {
      setFormData({
        title: projeto.title,
        description: projeto.description,
        startDate: projeto.startDate ? projeto.startDate.split('T')[0] : '',
        endDate: projeto.endDate ? projeto.endDate.split('T')[0] : '',
        status: projeto.status,
        materialUsage: projeto.materialUsage || '',
        researchLine: projeto.researchLine || '',
        subjectTheme: projeto.subjectTheme || '',
        justification: projeto.justification || '',
        problemFormulation: projeto.problemFormulation || '',
        hypothesisFormulation: projeto.hypothesisFormulation || '',
        generalObjective: projeto.generalObjective || '',
        specificObjective: projeto.specificObjective || '',
        theoreticalFoundation: projeto.theoreticalFoundation || '',
        methodologicalApproaches: projeto.methodologicalApproaches || '',
        projectReferences: projeto.projectReferences || '',
      });
    }
  }, [projeto]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projeto) return;

    setIsLoading(true);
    try {
      await api.put(`/research-projects/${projeto.id}`, formData);
      toast({
        title: 'Sucesso',
        description: 'Projeto atualizado com sucesso!',
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o projeto.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!projeto) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Save className="h-6 w-6 mr-3 text-primary" />
            Editar Projeto de Pesquisa
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do projeto de pesquisa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status || ''} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABERTO">Aberto</SelectItem>
                  <SelectItem value="ANALISE">Em Análise</SelectItem>
                  <SelectItem value="COMPLETO">Concluído</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="researchLine">Linha de Pesquisa</Label>
              <Input
                id="researchLine"
                value={formData.researchLine || ''}
                onChange={(e) => handleInputChange('researchLine', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjectTheme">Assunto/Tema</Label>
              <Input
                id="subjectTheme"
                value={formData.subjectTheme || ''}
                onChange={(e) => handleInputChange('subjectTheme', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="materialUsage">Utilização de Material</Label>
            <Textarea
              id="materialUsage"
              value={formData.materialUsage || ''}
              onChange={(e) => handleInputChange('materialUsage', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification">Justificativa</Label>
            <Textarea
              id="justification"
              value={formData.justification || ''}
              onChange={(e) => handleInputChange('justification', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemFormulation">Formulação do Problema</Label>
            <Textarea
              id="problemFormulation"
              value={formData.problemFormulation || ''}
              onChange={(e) => handleInputChange('problemFormulation', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hypothesisFormulation">Hipótese</Label>
            <Textarea
              id="hypothesisFormulation"
              value={formData.hypothesisFormulation || ''}
              onChange={(e) => handleInputChange('hypothesisFormulation', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="generalObjective">Objetivo Geral</Label>
            <Textarea
              id="generalObjective"
              value={formData.generalObjective || ''}
              onChange={(e) => handleInputChange('generalObjective', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificObjective">Objetivos Específicos</Label>
            <Textarea
              id="specificObjective"
              value={formData.specificObjective || ''}
              onChange={(e) => handleInputChange('specificObjective', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theoreticalFoundation">Fundamentação Teórica</Label>
            <Textarea
              id="theoreticalFoundation"
              value={formData.theoreticalFoundation || ''}
              onChange={(e) => handleInputChange('theoreticalFoundation', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="methodologicalApproaches">Encaminhamentos Metodológicos</Label>
            <Textarea
              id="methodologicalApproaches"
              value={formData.methodologicalApproaches || ''}
              onChange={(e) => handleInputChange('methodologicalApproaches', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectReferences">Referências</Label>
            <Textarea
              id="projectReferences"
              value={formData.projectReferences || ''}
              onChange={(e) => handleInputChange('projectReferences', e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter className="sm:justify-between gap-2 flex-wrap">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjetoDialog; 