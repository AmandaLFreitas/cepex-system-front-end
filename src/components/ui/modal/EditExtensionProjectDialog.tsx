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
import { Save, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '../use-toast';

interface User {
  id: string;
  login: string;
  name?: string;
  email?: string;
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
}

interface EditExtensionProjectDialogProps {
  projeto: ExtensionProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditExtensionProjectDialog = ({
  projeto,
  open,
  onOpenChange,
  onSuccess
}: EditExtensionProjectDialogProps) => {
  const [formData, setFormData] = useState<Partial<ExtensionProject>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (projeto) {
      setFormData({
        title: projeto.title,
        description: projeto.description,
        location: projeto.location,
        targetBeneficiaries: projeto.targetBeneficiaries,
        startDate: projeto.startDate ? projeto.startDate.split('T')[0] : '',
        endDate: projeto.endDate ? projeto.endDate.split('T')[0] : '',
        status: projeto.status,
        coordinator: projeto.coordinator,
        team: projeto.team || [],
      });
    }
  }, [projeto]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (field: string, value: any) => {
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
      // Preparar dados para envio - apenas IDs
      const dataToSend = {
        ...formData,
        coordinator: formData.coordinator ? { id: formData.coordinator.id } : null,
        team: formData.team ? formData.team.map(member => ({ id: member.id })) : []
      };

      await api.put(`/extension-projects/${projeto.id}`, dataToSend);
      toast({
        title: 'Sucesso',
        description: 'Projeto de extensão atualizado com sucesso!',
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o projeto de extensão.',
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
            Editar Projeto de Extensão
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do projeto de extensão.
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
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetBeneficiaries">Público Alvo</Label>
              <Input
                id="targetBeneficiaries"
                value={formData.targetBeneficiaries || ''}
                onChange={(e) => handleInputChange('targetBeneficiaries', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinator">Coordenador</Label>
              <Select 
                value={formData.coordinator?.id || ''} 
                onValueChange={(value) => {
                  const selectedUser = users.find(u => u.id === value);
                  handleInputChange('coordinator', selectedUser);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o coordenador" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.login}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExtensionProjectDialog; 