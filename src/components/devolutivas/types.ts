export interface Workshop {
  id: string;
  nome: string;
  status: 'agendada' | 'enviada' | null;
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