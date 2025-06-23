export interface Monitoria {
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
  course?: {
    id: string;
    name: string;
  };
  subject?: {
    id: string;
    name: string;
  };
  professor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface MonitoriaStatistics {
  monitoriasAbertas: number;
  monitoresAtivos: number;
  candidatosPendentes: number;
}
