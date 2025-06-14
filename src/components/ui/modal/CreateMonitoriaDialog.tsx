
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface CreateMonitoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateMonitoriaDialog = ({ open, onOpenChange }: CreateMonitoriaDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Criar Nova Monitoria</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="text-sm text-muted-foreground mb-6">
          Preencha os dados para criar uma nova monitoria acadêmica.
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Ex: Monitoria Desenvolvimento Desktop"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disciplina">Disciplina *</Label>
              <Input
                id="disciplina"
                placeholder="Ex: Programação Desktop"
                className="bg-slate-700 border-slate-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva os objetivos e conteúdo da monitoria"
              className="bg-slate-700 border-slate-600 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professor">Professor *</Label>
              <Input
                id="professor"
                placeholder="Ex: Prof. Dr. João Silva"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="curso">Curso *</Label>
              <Input
                id="curso"
                placeholder="Ex: Ciência da Computação"
                className="bg-slate-700 border-slate-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vagas">Vagas *</Label>
              <Input
                id="vagas"
                type="number"
                placeholder="5"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carga-horaria">Carga Horária *</Label>
              <Input
                id="carga-horaria"
                type="number"
                placeholder="20"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="flex items-center space-x-2 mt-8">
              <Checkbox id="remota" />
              <Label htmlFor="remota">Monitoria Remota</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="local">Local *</Label>
            <Input
              id="local"
              placeholder="Ex: Laboratório de Informática - Sala 201"
              className="bg-slate-700 border-slate-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data-inicio">Data Início *</Label>
              <Input
                id="data-inicio"
                type="date"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-fim">Data Fim *</Label>
              <Input
                id="data-fim"
                type="date"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inscricoes-ate">Inscrições até *</Label>
              <Input
                id="inscricoes-ate"
                type="date"
                className="bg-slate-700 border-slate-600"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-600"
          >
            Cancelar
          </Button>
          <Button className="bg-[#EC0444] hover:bg-[#EC0444]/90">
            Criar Monitoria
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMonitoriaDialog;
