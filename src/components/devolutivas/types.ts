export type WorkshopStatus = 'agendada' | 'enviada' | null;

export interface Workshop {
  id: string;
  nome: string;
  status: WorkshopStatus;
  data?: Date;
}

export interface Capacitacao {
  id: string;
  nome: string;
  workshops: Workshop[];
}

export interface Formacao {
  id: string;
  nome: string;
  capacitacoes: Capacitacao[];
}

export interface Professor {
  id: string;
  nome: string;
}

export interface WorkshopStatusData {
  status: WorkshopStatus;
  data?: Date;
}

export interface StatusRecord {
  [workshopId: string]: WorkshopStatusData;
}