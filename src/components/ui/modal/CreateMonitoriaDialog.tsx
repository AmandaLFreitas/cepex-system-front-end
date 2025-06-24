import React, { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateMonitoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Discipline {
  id: string;
  name: string;
  active: boolean;
}

interface Course {
  id: string;
  name: string;
  semesters: number;
  active: boolean;
}

interface Professor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ra: string;
  cpf: string;
  number: string;
  active: boolean;
  department: string;
}

interface MonitoriaFormData {
  title: string;
  description: string;
  remote: boolean;
  location: string;
  vacancies: number;
  workload: number;
  inicialDate: string;
  finalDate: string;
  inicialIngressDate: string;
  finalIngressDate: string;
  selectionType: string;
  selectionDate: string;
  selectionTime: string;
  divulgationDate: string;
  statusMonitoria: string;
  course: {
    id: string;
    name: string;
  };
  subject: {
    id: string;
    name: string;
  };
  professor: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

const CreateMonitoriaDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateMonitoriaDialogProps) => {
  const { toast } = useToast();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [filteredDisciplines, setFilteredDisciplines] = useState<Discipline[]>(
    []
  );
  const [formData, setFormData] = useState<MonitoriaFormData>({
    title: "",
    description: "",
    remote: false,
    location: "",
    vacancies: 0,
    workload: 0,
    inicialDate: "",
    finalDate: "",
    inicialIngressDate: "",
    finalIngressDate: "",
    selectionType: "ENTREVISTA",
    selectionDate: "",
    selectionTime: "",
    divulgationDate: "",
    statusMonitoria: "PENDENTE",
    course: {
      id: "",
      name: "",
    },
    subject: {
      id: "",
      name: "",
    },
    professor: {
      id: "",
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesResponse, professorsResponse] = await Promise.all([
          api.get("/courses"),
          api.get("/professors"),
        ]);
        setCourses(coursesResponse.data);
        setProfessors(professorsResponse.data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os cursos e professores.",
          variant: "destructive",
        });
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, toast]);

  // Buscar disciplinas quando o curso for selecionado
  useEffect(() => {
    const fetchDisciplines = async () => {
      if (formData.course.id) {
        try {
          const response = await api.get(
            `/disciplines?courseId=${formData.course.id}`
          );
          setFilteredDisciplines(
            response.data.filter((d: Discipline) => d.active)
          );
        } catch (error) {
          toast({
            title: "Erro",
            description: "Não foi possível carregar as disciplinas do curso.",
            variant: "destructive",
          });
        }
      } else {
        setFilteredDisciplines([]);
      }
    };

    fetchDisciplines();
  }, [formData.course.id, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      remote: checked,
    }));
  };

  const handleDisciplineChange = (value: string) => {
    const discipline = filteredDisciplines.find((d) => d.id === value);
    if (discipline) {
      setFormData((prev) => ({
        ...prev,
        subject: {
          id: discipline.id,
          name: discipline.name,
        },
      }));
    }
  };

  const handleCourseChange = (value: string) => {
    const course = courses.find((c) => c.id === value);
    if (course) {
      setFormData((prev) => ({
        ...prev,
        course: {
          id: course.id,
          name: course.name,
        },
        subject: {
          id: "",
          name: "",
        },
      }));
    }
  };

  const handleProfessorChange = (value: string) => {
    const professor = professors.find((p) => p.id === value);
    if (professor) {
      setFormData((prev) => ({
        ...prev,
        professor: {
          id: professor.id,
          firstName: professor.firstName,
          lastName: professor.lastName,
        },
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Garantir que o status seja sempre PENDENTE
      const monitoriaData = {
        ...formData,
        statusMonitoria: "PENDENTE",
      };

      await api.post("/monitorias", monitoriaData);
      toast({
        title: "Sucesso",
        description: "Monitoria criada com sucesso! Aguardando aprovação.",
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a monitoria.",
        variant: "destructive",
      });
    }
  };

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ex: Monitoria Desenvolvimento Desktop"
                className="bg-background border-border"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Curso *</Label>
              <Select
                value={formData.course.id}
                onValueChange={handleCourseChange}
                required
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Disciplina *</Label>
              <Select
                value={formData.subject.id}
                onValueChange={handleDisciplineChange}
                required
                disabled={!formData.course.id}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue
                    placeholder={
                      !formData.course.id
                        ? "Selecione um curso primeiro"
                        : "Selecione uma disciplina"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredDisciplines.map((discipline) => (
                    <SelectItem key={discipline.id} value={discipline.id}>
                      {discipline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva os objetivos e conteúdo da monitoria"
              className="bg-background border-border min-h-[100px]"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="professor">Professor *</Label>
              <Select
                value={formData.professor.id}
                onValueChange={handleProfessorChange}
                required
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecione um professor" />
                </SelectTrigger>
                <SelectContent>
                  {professors.map((professor) => (
                    <SelectItem key={professor.id} value={professor.id}>
                      {`${professor.firstName} ${professor.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="selectionType">Tipo de Seleção *</Label>
              <Select
                value={formData.selectionType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, selectionType: value }))
                }
                required
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Selecione o tipo de seleção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENTREVISTA">Entrevista</SelectItem>
                  <SelectItem value="ANALISE_HISTORICO">
                    Análise de Histórico
                  </SelectItem>
                  <SelectItem value="ENTREVISTA_ANALISE_HISTORICO">
                    Entrevista e Análise de Histórico
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vacancies">Vagas *</Label>
              <Input
                id="vacancies"
                name="vacancies"
                type="number"
                placeholder="5"
                className="bg-background border-border"
                value={formData.vacancies}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workload">Carga Horária *</Label>
              <Input
                id="workload"
                name="workload"
                type="number"
                placeholder="20"
                className="bg-background border-border"
                value={formData.workload}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2 mt-8">
              <Checkbox
                id="remote"
                checked={formData.remote}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="remote">Monitoria Remota</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local *</Label>
            <Input
              id="location"
              name="location"
              placeholder="Ex: Laboratório de Informática - Sala 201"
              className="bg-background border-border"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inicialDate">Data Início *</Label>
              <Input
                id="inicialDate"
                name="inicialDate"
                type="date"
                className="bg-background border-border"
                value={formData.inicialDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalDate">Data Fim *</Label>
              <Input
                id="finalDate"
                name="finalDate"
                type="date"
                className="bg-background border-border"
                value={formData.finalDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inicialIngressDate">Inscrições até *</Label>
              <Input
                id="inicialIngressDate"
                name="inicialIngressDate"
                type="date"
                className="bg-background border-border"
                value={formData.inicialIngressDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="finalIngressDate">
                Data Final de Inscrições *
              </Label>
              <Input
                id="finalIngressDate"
                name="finalIngressDate"
                type="date"
                className="bg-background border-border"
                value={formData.finalIngressDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="selectionDate">Data da Seleção *</Label>
              <Input
                id="selectionDate"
                name="selectionDate"
                type="date"
                className="bg-background border-border"
                value={formData.selectionDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selectionTime">Horário da Seleção *</Label>
              <Input
                id="selectionTime"
                name="selectionTime"
                type="time"
                className="bg-background border-border"
                value={formData.selectionTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="divulgationDate">Data de Divulgação *</Label>
            <Input
              id="divulgationDate"
              name="divulgationDate"
              type="date"
              className="bg-background border-border"
              value={formData.divulgationDate}
              onChange={handleInputChange}
              required
            />
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
            >
              Criar Monitoria
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMonitoriaDialog;
