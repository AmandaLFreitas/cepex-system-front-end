// src/components/ui/modal/CreateProjetoDialog.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, ChevronDown, ChevronUp, Check, Plus, X as XIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface CreateProjetoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Professor {
  id: string; // UUID do professor
  firstName: string;
  lastName: string;
  email: string;
  ra: string;
  cpf: string;
  number?: string;
  active: boolean;
  createdAt: string;
  user: {
    id: string; // UUID do usuário
    login: string;
    email: string;
    status: boolean;
    role: string;
  };
  disciplines?: any[];
}

interface Course {
  id: string;
  name: string;
  semesters: number;
  active: boolean;
}

interface ProjetoFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  leadResearcherIds: string[];
  courseId: string;
  materialUsage: string;
  researchLine: string;
  subjectTheme: string;
  justification: string;
  problemFormulation: string;
  hypothesisFormulation: string;
  generalObjective: string;
  specificObjective: string;
  theoreticalFoundation: string;
  methodologicalApproaches: string;
  projectReferences: string;
}

const CreateProjetoDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateProjetoDialogProps) => {
  const { toast } = useToast();
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isProjectInfoExpanded, setIsProjectInfoExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfessorSelectOpen, setIsProfessorSelectOpen] = useState(false);
  const professorSelectRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<ProjetoFormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "ANALISE",
    leadResearcherIds: [],
    courseId: "",
    materialUsage: "",
    researchLine: "",
    subjectTheme: "",
    justification: "",
    problemFormulation: "",
    hypothesisFormulation: "",
    generalObjective: "",
    specificObjective: "",
    theoreticalFoundation: "",
    methodologicalApproaches: "",
    projectReferences: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [professorsResponse, coursesResponse] = await Promise.all([
          api.get("/professors"),
          api.get("/courses"),
        ]);
        
        console.log("--- DADOS DOS PROFESSORES CARREGADOS ---");
        console.log("Dados brutos:", professorsResponse.data);
        console.table(professorsResponse.data.map((p: Professor) => ({ 
          professorId: p.id, 
          userId: p.user.id, 
          name: `${p.firstName} ${p.lastName}` 
        })));
        
        setProfessors(professorsResponse.data || []);
        setCourses(coursesResponse.data || []);
        
      } catch (error) {
        console.error("Erro detalhado ao carregar dados:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar professores e cursos. Verifique se o backend está rodando.",
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
        startDate: "",
        endDate: "",
        status: "ANALISE",
        leadResearcherIds: [],
        courseId: "",
        materialUsage: "",
        researchLine: "",
        subjectTheme: "",
        justification: "",
        problemFormulation: "",
        hypothesisFormulation: "",
        generalObjective: "",
        specificObjective: "",
        theoreticalFoundation: "",
        methodologicalApproaches: "",
        projectReferences: "",
      });
      setIsProjectInfoExpanded(false);
      fetchData();
    }
  }, [open, toast]);

  useEffect(() => {
    console.log("--- IDs de Professores Selecionados Mudou ---");
    console.log(formData.leadResearcherIds);
  }, [formData.leadResearcherIds]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (professorSelectRef.current && !professorSelectRef.current.contains(event.target as Node)) {
        setIsProfessorSelectOpen(false);
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

  const handleProfessorToggle = (professorId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFormData((prev) => {
      const isCurrentlySelected = prev.leadResearcherIds.includes(professorId);
      const newIds = isCurrentlySelected
        ? prev.leadResearcherIds.filter(id => id !== professorId)
        : [...prev.leadResearcherIds, professorId];
      
      return {
        ...prev,
        leadResearcherIds: newIds
      };
    });
  };

  const removeProfessor = (professorId: string) => {
    setFormData((prev) => ({
      ...prev,
      leadResearcherIds: prev.leadResearcherIds.filter(id => id !== professorId)
    }));
  };

  const handleCourseChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      courseId: value,
    }));
  };

  const getSelectedProfessors = () => {
    return professors.filter(prof => formData.leadResearcherIds.includes(prof.user.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.leadResearcherIds.length === 0 || !formData.courseId) {
        toast({
            title: "Erro de validação",
            description: "Por favor, selecione pelo menos um professor responsável e o curso.",
            variant: "destructive",
        });
        return;
    }

    try {
      const selectedProfessors = getSelectedProfessors();
      
      if (selectedProfessors.length === 0) {
        toast({
          title: "Erro",
          description: "Professores selecionados não encontrados.",
          variant: "destructive",
        });
        return;
      }

      const projetoData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        leadResearcher: {
          id: selectedProfessors[0].user.id
        },
        collaborators: selectedProfessors.slice(1).map(prof => ({
          id: prof.user.id
        })),
        materialUsage: formData.materialUsage,
        researchLine: formData.researchLine,
        subjectTheme: formData.subjectTheme,
        justification: formData.justification,
        problemFormulation: formData.problemFormulation,
        hypothesisFormulation: formData.hypothesisFormulation,
        generalObjective: formData.generalObjective,
        specificObjective: formData.specificObjective,
        theoreticalFoundation: formData.theoreticalFoundation,
        methodologicalApproaches: formData.methodologicalApproaches,
        projectReferences: formData.projectReferences
      };

      await api.post("/research-projects", projetoData);
      toast({
        title: "Sucesso",
        description: "Projeto de pesquisa criado com sucesso!",
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o projeto de pesquisa. Verifique os dados.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                placeholder="Ex: Inteligência Artificial na Educação"
                className="bg-background border-border"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="professors">Professores Responsáveis *</Label>
              
              {/* Professores Selecionados */}
              {formData.leadResearcherIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {getSelectedProfessors().map((professor) => (
                    <Badge key={professor.user.id} variant="secondary" className="flex items-center gap-1">
                      {`${professor.firstName} ${professor.lastName} (${professor.ra})`}
                      <button
                        type="button"
                        onClick={() => removeProfessor(professor.user.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Dropdown de Seleção */}
              <div className="relative" ref={professorSelectRef}>
                <button
                  type="button"
                  onClick={() => setIsProfessorSelectOpen(!isProfessorSelectOpen)}
                  className="w-full p-3 text-left border rounded-md bg-background hover:bg-accent transition-colors flex items-center justify-between"
                  disabled={isLoading}
                >
                  <span className={formData.leadResearcherIds.length === 0 ? "text-muted-foreground" : ""}>
                    {formData.leadResearcherIds.length === 0 
                      ? (isLoading ? "Carregando..." : "Selecione um ou mais professores")
                      : `${formData.leadResearcherIds.length} professor(es) selecionado(s)`
                    }
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isProfessorSelectOpen ? "rotate-180" : ""}`} />
                </button>

                {isProfessorSelectOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {professors.map((professor, index) => {
                      const isSelected = formData.leadResearcherIds.includes(professor.user.id);
                      const professorId = professor.user.id;
                      
                      return (
                        <div
                          key={professorId}
                          id={`professor-${professorId}`}
                          className="w-full p-3 hover:bg-accent flex items-center gap-2 cursor-pointer border-b last:border-b-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Clicou no professor:', professor.firstName, professor.lastName, 'ID:', professorId);
                            handleProfessorToggle(professorId, e);
                          }}
                        >
                          <div className={`w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 ${
                            isSelected 
                              ? "bg-primary border-primary" 
                              : "border-border"
                          }`}>
                            {isSelected && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <span className="flex-1 text-left">{`${professor.firstName} ${professor.lastName} (${professor.ra})`}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground">
                Selecione um ou mais professores responsáveis pelo projeto
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Curso *</Label>
              <Select
                value={formData.courseId}
                onValueChange={handleCourseChange}
                required
                disabled={isLoading}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um curso"} />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} ({course.semesters} semestres)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descreva o projeto de pesquisa"
                className="bg-background border-border min-h-[100px]"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="materialUsage">Utilização de Material</Label>
                <Input
                  id="materialUsage"
                  name="materialUsage"
                  placeholder="Descreva os materiais utilizados"
                  className="bg-background border-border"
                  value={formData.materialUsage}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="researchLine">Linha de Pesquisa</Label>
                <Input
                  id="researchLine"
                  name="researchLine"
                  placeholder="Ex: Inteligência Artificial"
                  className="bg-background border-border"
                  value={formData.researchLine}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data Início *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  className="bg-background border-border"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Data Fim *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  className="bg-background border-border"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Acordeão - Informações do Projeto */}
          <div className="border rounded-lg bg-card">
            <button
              type="button"
              className="w-full p-4 flex items-center justify-between bg-muted hover:bg-muted/80 transition-colors rounded-t-lg"
              onClick={() => setIsProjectInfoExpanded(!isProjectInfoExpanded)}
            >
              <h3 className="text-lg font-semibold text-foreground">Informações do Projeto</h3>
              {isProjectInfoExpanded ? (
                <ChevronUp className="h-5 w-5 text-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-foreground" />
              )}
            </button>
            
            {isProjectInfoExpanded && (
              <div className="p-4 space-y-4 border-t bg-card">
                <div className="space-y-2">
                  <Label htmlFor="subjectTheme">Assunto/Tema</Label>
                  <Input
                    id="subjectTheme"
                    name="subjectTheme"
                    placeholder="Tema principal do projeto"
                    className="bg-background border-border"
                    value={formData.subjectTheme}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="justification">Justificativa</Label>
                  <Textarea
                    id="justification"
                    name="justification"
                    placeholder="Justifique a importância do projeto"
                    className="bg-background border-border min-h-[80px]"
                    value={formData.justification}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problemFormulation">Formulação do Problema</Label>
                  <Textarea
                    id="problemFormulation"
                    name="problemFormulation"
                    placeholder="Descreva o problema que o projeto pretende resolver"
                    className="bg-background border-border min-h-[80px]"
                    value={formData.problemFormulation}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hypothesisFormulation">Formulação da Hipótese</Label>
                  <Textarea
                    id="hypothesisFormulation"
                    name="hypothesisFormulation"
                    placeholder="Apresente a hipótese do projeto"
                    className="bg-background border-border min-h-[80px]"
                    value={formData.hypothesisFormulation}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="generalObjective">Objetivo Geral</Label>
                  <Textarea
                    id="generalObjective"
                    name="generalObjective"
                    placeholder="Objetivo principal do projeto"
                    className="bg-background border-border min-h-[80px]"
                    value={formData.generalObjective}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specificObjective">Objetivo Específico</Label>
                  <Textarea
                    id="specificObjective"
                    name="specificObjective"
                    placeholder="Objetivos específicos do projeto"
                    className="bg-background border-border min-h-[80px]"
                    value={formData.specificObjective}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theoreticalFoundation">Fundamentação Teórica</Label>
                  <Textarea
                    id="theoreticalFoundation"
                    name="theoreticalFoundation"
                    placeholder="Base teórica do projeto"
                    className="bg-background border-border min-h-[80px]"
                    value={formData.theoreticalFoundation}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="methodologicalApproaches">Encaminhamentos Metodológicos</Label>
                  <Textarea
                    id="methodologicalApproaches"
                    name="methodologicalApproaches"
                    placeholder="Metodologia que será utilizada"
                    className="bg-background border-border min-h-[80px]"
                    value={formData.methodologicalApproaches}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectReferences">Referências</Label>
                  <Textarea
                    id="projectReferences"
                    name="projectReferences"
                    placeholder="Referências bibliográficas"
                    className="bg-background border-border min-h-[80px]"
                    value={formData.projectReferences}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-600"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#EC0444] hover:bg-[#EC0444]/90"
              disabled={isLoading}
            >
              {isLoading ? "Carregando..." : "Criar Projeto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjetoDialog;