import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, ChevronDown, X as XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface CreateExtensionProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface User {
  id: string;
  login: string;
  name?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface ExtensionProjectFormData {
  title: string;
  description: string;
  location: string;
  targetBeneficiaries: string;
  startDate: string;
  endDate: string;
  status: string;
  coordinatorId: string;
  teamIds: string[];
}

const CreateExtensionProjectDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateExtensionProjectDialogProps) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTeamSelectOpen, setIsTeamSelectOpen] = useState(false);
  const teamSelectRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<ExtensionProjectFormData>({
    title: "",
    description: "",
    location: "",
    targetBeneficiaries: "",
    startDate: "",
    endDate: "",
    status: "ANALISE",
    coordinatorId: "",
    teamIds: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/users");
        setUsers(response.data || []);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar usuários. Verifique se o backend está rodando.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      setFormData({
        title: "",
        description: "",
        location: "",
        targetBeneficiaries: "",
        startDate: "",
        endDate: "",
        status: "ANALISE",
        coordinatorId: "",
        teamIds: [],
      });
      setIsTeamSelectOpen(false);
      fetchData();
    }
  }, [open, toast]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (teamSelectRef.current && !teamSelectRef.current.contains(event.target as Node)) {
        setIsTeamSelectOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeamToggle = (userId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFormData((prev) => {
      const isCurrentlySelected = prev.teamIds.includes(userId);
      const newIds = isCurrentlySelected
        ? prev.teamIds.filter(id => id !== userId)
        : [...prev.teamIds, userId];
      
      return {
        ...prev,
        teamIds: newIds
      };
    });
  };

  const removeTeamMember = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      teamIds: prev.teamIds.filter(id => id !== userId)
    }));
  };

  const getSelectedTeamMembers = () => {
    return users.filter(user => formData.teamIds.includes(user.id));
  };

  const getCoordinatorName = () => {
    const coordinator = users.find(user => user.id === formData.coordinatorId);
    return coordinator ? (coordinator.name || coordinator.login) : "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.coordinatorId) {
      toast({
        title: "Erro de validação",
        description: "Por favor, selecione um coordenador.",
        variant: "destructive",
      });
      return;
    }

    try {
      const coordinator = users.find(user => user.id === formData.coordinatorId);
      const teamMembers = getSelectedTeamMembers();
      
      if (!coordinator) {
        toast({
          title: "Erro",
          description: "Coordenador selecionado não encontrado.",
          variant: "destructive",
        });
        return;
      }

      const projetoData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        targetBeneficiaries: formData.targetBeneficiaries,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : null,
        status: formData.status,
        coordinator: {
          id: coordinator.id
        },
        team: teamMembers.map(member => ({
          id: member.id
        }))
      };

      await api.post("/extension-projects", projetoData);
      toast({
        title: "Sucesso",
        description: "Projeto de extensão criado com sucesso!",
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o projeto de extensão. Verifique os dados.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Criar Novo Projeto de Extensão</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <DialogDescription className="text-sm text-muted-foreground mb-6">
          Preencha os dados para criar um novo projeto de extensão.
        </DialogDescription>

        {isLoading && (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informações Básicas</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ex: Oficinas de Programação para Jovens"
                className="bg-background border-border"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descreva o projeto de extensão..."
                className="bg-background border-border"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Localização *</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Ex: Centro Comunitário"
                  className="bg-background border-border"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetBeneficiaries">Público Alvo</Label>
                <Input
                  id="targetBeneficiaries"
                  name="targetBeneficiaries"
                  placeholder="Ex: Jovens de 14-18 anos"
                  className="bg-background border-border"
                  value={formData.targetBeneficiaries}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="bg-background border-border"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Fim</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="bg-background border-border"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-background border-border">
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
                <Label htmlFor="coordinator">Coordenador *</Label>
                <Select 
                  value={formData.coordinatorId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, coordinatorId: value }))}
                >
                  <SelectTrigger className="bg-background border-border">
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
              <Label htmlFor="team">Equipe</Label>
              
              {/* Membros Selecionados */}
              {formData.teamIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {getSelectedTeamMembers().map((member) => (
                    <Badge key={member.id} variant="secondary" className="flex items-center gap-1">
                      {member.name || member.login}
                      <button
                        type="button"
                        onClick={() => removeTeamMember(member.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Dropdown de Seleção */}
              <div className="relative" ref={teamSelectRef}>
                <button
                  type="button"
                  onClick={() => setIsTeamSelectOpen(!isTeamSelectOpen)}
                  className="w-full p-3 text-left border rounded-md bg-background hover:bg-accent transition-colors flex items-center justify-between"
                  disabled={isLoading}
                >
                  <span className={formData.teamIds.length === 0 ? "text-muted-foreground" : ""}>
                    {formData.teamIds.length === 0 
                      ? (isLoading ? "Carregando..." : "Selecione membros da equipe (opcional)")
                      : `${formData.teamIds.length} membro(s) selecionado(s)`
                    }
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isTeamSelectOpen ? "rotate-180" : ""}`} />
                </button>

                {isTeamSelectOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {users.map((user) => {
                      const isSelected = formData.teamIds.includes(user.id);
                      
                      return (
                        <div
                          key={user.id}
                          className="w-full p-3 hover:bg-accent flex items-center gap-2 cursor-pointer border-b last:border-b-0"
                          onClick={(e) => handleTeamToggle(user.id, e)}
                        >
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                            isSelected ? 'bg-primary border-primary' : 'border-border'
                          }`}>
                            {isSelected && <XIcon className="h-3 w-3 text-primary-foreground" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{user.name || user.login}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Projeto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExtensionProjectDialog; 