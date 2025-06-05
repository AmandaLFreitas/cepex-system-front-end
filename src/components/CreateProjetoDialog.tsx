
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface CreateProjetoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateProjetoDialog = ({ open, onOpenChange }: CreateProjetoDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Criar Novo Projeto de Pesquisa</DialogTitle>
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
          Preencha os dados para criar um novo projeto de pesquisa acadêmica.
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              placeholder="Ex: Inteligência Artificial na Educação"
              className="bg-slate-700 border-slate-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professor">Professor Responsável *</Label>
            <Input
              id="professor"
              placeholder="Ex: Prof. Dr. João Silva"
              className="bg-slate-700 border-slate-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivos">Objetivos *</Label>
            <Textarea
              id="objetivos"
              placeholder="Descreva os objetivos do projeto de pesquisa"
              className="bg-slate-700 border-slate-600 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metodologia">Metodologia *</Label>
            <Textarea
              id="metodologia"
              placeholder="Descreva a metodologia que será utilizada"
              className="bg-slate-700 border-slate-600 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cronograma">Cronograma *</Label>
            <Input
              id="cronograma"
              placeholder="Ex: 12 meses - Início: Janeiro 2024"
              className="bg-slate-700 border-slate-600"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="orcamento" />
            <Label htmlFor="orcamento">Projeto com orçamento</Label>
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
            Criar Projeto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjetoDialog;
