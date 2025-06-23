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
import { X, Trash2, Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { Monitoria } from "@/types/monitoria";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface EditMonitoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monitoria: Monitoria | null;
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

interface EditMonitoriaFormData {
  id: string;
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

const EditMonitoriaDialog = ({
  open,
  onOpenChange,
  monitoria,
  onSuccess,
}: EditMonitoriaDialogProps) => {
  const { toast } = useToast();
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<EditMonitoriaFormData>({
    id: "",
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
    selectionType: "",
    selectionDate: "",
    selectionTime: "",
    divulgationDate: "",
    statusMonitoria: "",
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
        const [disciplinesResponse, coursesResponse, professorsResponse] =
          await Promise.all([
            api.get("/disciplines"),
            api.get("/courses"),
            api.get("/professors"),
          ]);
        setDisciplines(disciplinesResponse.data);
        setCourses(coursesResponse.data);
        setProfessors(professorsResponse.data);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados.",
          variant: "destructive",
        });
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, toast]);

  useEffect(() => {
    if (monitoria) {
      setFormData({
        id: monitoria.id,
        title: monitoria.title,
        description: monitoria.description,
        remote: monitoria.remote,
        location: monitoria.location,
        vacancies: monitoria.vacancies,
        workload: monitoria.workload,
        inicialDate: monitoria.inicialDate,
        finalDate: monitoria.finalDate,
        inicialIngressDate: monitoria.inicialIngressDate,
        finalIngressDate: monitoria.finalIngressDate,
        selectionType: monitoria.selectionType,
        selectionDate: monitoria.selectionDate,
        selectionTime: monitoria.selectionTime,
        divulgationDate: monitoria.divulgationDate,
        statusMonitoria: monitoria.statusMonitoria,
        course: monitoria.course || { id: "", name: "" },
        subject: monitoria.subject || { id: "", name: "" },
        professor: monitoria.professor || {
          id: "",
          firstName: "",
          lastName: "",
        },
      });
    }
  }, [monitoria]);

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
    const discipline = disciplines.find((d) => d.id === value);
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
      // Preparar dados para envio (apenas IDs das entidades relacionadas)
      const updateData = {
        title: formData.title,
        description: formData.description,
        remote: formData.remote,
        location: formData.location,
        vacancies: formData.vacancies,
        workload: formData.workload,
        inicialDate: formData.inicialDate,
        finalDate: formData.finalDate,
        inicialIngressDate: formData.inicialIngressDate,
        finalIngressDate: formData.finalIngressDate,
        selectionType: formData.selectionType,
        selectionDate: formData.selectionDate,
        selectionTime: formData.selectionTime,
        divulgationDate: formData.divulgationDate,
        statusMonitoria: formData.statusMonitoria,
        courseId: formData.course.id,
        subjectId: formData.subject.id,
        professorId: formData.professor.id,
      };

      await api.put(`/monitorias/${formData.id}`, updateData);
      toast({
        title: "Sucesso",
        description: "Monitoria atualizada com sucesso!",
      });
      setIsEditing(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao atualizar monitoria:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a monitoria.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/monitorias/${formData.id}`);
      toast({
        title: "Sucesso",
        description: "Monitoria deletada com sucesso!",
      });
      setShowDeleteDialog(false);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao deletar monitoria:", error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a monitoria.",
        variant: "destructive",
      });
    }
  };

  if (!monitoria) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>
              {isEditing ? "Editar Monitoria" : "Detalhes da Monitoria"}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowDeleteDialog(true)}
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    name="title"
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
                    <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Disciplina *</Label>
                  <Select
                    value={formData.subject.id}
                    onValueChange={handleDisciplineChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplines.map((discipline) => (
                        <SelectItem key={discipline.id} value={discipline.id}>
                          {discipline.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="professor">Professor *</Label>
                  <Select
                    value={formData.professor.id}
                    onValueChange={handleProfessorChange}
                    required
                  >
                    <SelectTrigger>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="selectionType">Tipo de Seleção *</Label>
                  <Select
                    value={formData.selectionType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, selectionType: value }))
                    }
                    required
                  >
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label htmlFor="statusMonitoria">Status *</Label>
                  <Select
                    value={formData.statusMonitoria}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        statusMonitoria: value,
                      }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDENTE">Pendente</SelectItem>
                      <SelectItem value="APROVADA">Aprovada</SelectItem>
                      <SelectItem value="REJEITADA">Rejeitada</SelectItem>
                      <SelectItem value="CANCELADA">Cancelada</SelectItem>
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
                  value={formData.divulgationDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#EC0444] hover:bg-[#EC0444]/90"
                >
                  Salvar Alterações
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Título</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.title}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.statusMonitoria}
                  </p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Descrição</Label>
                <p className="text-sm text-muted-foreground">
                  {monitoria.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Curso</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.course?.name}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Disciplina</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.subject?.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Professor</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.professor
                      ? `${monitoria.professor.firstName} ${monitoria.professor.lastName}`
                      : "Não definido"}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Tipo de Seleção</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.selectionType}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="font-semibold">Vagas</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.vacancies}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Carga Horária</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.workload}h
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Remota</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.remote ? "Sim" : "Não"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Local</Label>
                <p className="text-sm text-muted-foreground">
                  {monitoria.location}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Data Início</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.inicialDate}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Data Fim</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.finalDate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Inscrições até</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.inicialIngressDate}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">
                    Data Final de Inscrições
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.finalIngressDate}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Data da Seleção</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.selectionDate}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Horário da Seleção</Label>
                  <p className="text-sm text-muted-foreground">
                    {monitoria.selectionTime}
                  </p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Data de Divulgação</Label>
                <p className="text-sm text-muted-foreground">
                  {monitoria.divulgationDate}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a monitoria "{monitoria.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EditMonitoriaDialog;
