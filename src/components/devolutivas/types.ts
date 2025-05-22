// Supostamente em um arquivo como src/types/index.ts ou similar

/**
 * Informações básicas do usuário, frequentemente usadas para exibição.
 */
export interface UserBasicInfo {
  id: string;
  name?: string | null;
  // email?: string | null; // Adicione se necessário
}

/**
 * Tipo para usuários que são avaliadores (professores),
 * usado para seleção em listas suspensas.
 */
export interface AvaliadorParaSelecao {
  id: string;
  name?: string | null;
  email?: string | null; // Pode ser útil para exibição
}

/**
 * Dados de uma sessão de devolutiva agendada para o frontend.
 * Assume-se que as datas já foram convertidas para objetos Date.
 */
export interface DevolutivaAgendamentoFrontend {
  id: string;
  workshopId: string;
  agendadorId: string;
  agendador?: UserBasicInfo | null; // Usuário que agendou
  avaliadorId: string;
  avaliador?: UserBasicInfo | null; // Avaliador designado
  dataAgendada: Date;       // Quando a sessão de devolutiva está agendada
  criadoEm: Date;         // Quando o registro de agendamento foi criado
  // atualizadoEm?: Date; // Adicione se você rastrear atualizações do agendamento
}

/**
 * Dados do progresso de um usuário em um workshop para o frontend.
 * Assume-se que as datas já foram convertidas para objetos Date.
 */
export interface ProgressoWorkshopFrontend {
  id: string;
  usuarioId: string; // No seu schema Prisma, você usou 'usuarioId'
  usuario: UserBasicInfo; // Usuário (aluno)
  workshopId: string;
  done: boolean;
  truedone: boolean;
  startedAt?: Date | null;
  doneAt?: Date | null;
  truedoneAt?: Date | null;
}

/**
 * Dados para a tabela existente `Devolutiva` (conteúdo/resultado da devolutiva) para o frontend.
 * Esta é uma entidade separada de DevolutivaAgendamento.
 * Assume-se que as datas já foram convertidas para objetos Date.
 */
export interface DevolucaoConteudoFrontend { // Nome alterado para clareza
  id: string;
  workshopId: string;
  alunoId: string;
  aluno?: UserBasicInfo | null;
  tipo: string; // Ou seu enum TipoDevolutiva, se você o importar
  arquivo_url: string;
  status: string; // Ou seu enum StatusDevolutiva
  duracao_video?: number | null;
  // avaliacao?: AvaliacaoFrontend[]; // Se você também carregar as avaliações
}

/**
 * Representação de um workshop no frontend, incluindo dados relacionados.
 */
export interface WorkshopFrontend {
  id: string;
  nome: string;
  capacitacaoId: string; // Se usado na UI
  link_video?: string | null;
  // Outros campos do Workshop do Prisma que você usa na UI

  // Dados relacionados carregados do backend:
  DevolutivaAgendamento?: DevolutivaAgendamentoFrontend[]; // Novos agendamentos
  devolutivas?: DevolucaoConteudoFrontend[];             // Registros existentes da tabela Devolutiva (se você nomeou a relação como 'devolutivas' no include do Prisma)
  progressoWorkshop?: ProgressoWorkshopFrontend[];
  // AvaliacaoWorkshop?: AvaliacaoWorkshopFrontend[]; // Se usado
}

/**
 * Representação de uma capacitação no frontend.
 */
export interface CapacitacaoFrontend {
  id: string;
  nome: string;
  link_video?: string | null; // Se usado diretamente
  formacaoId: string; // Se usado diretamente
  done: boolean; // Se usado diretamente
  // Outros campos da Capacitacao do Prisma

  workshops: WorkshopFrontend[];
}

/**
 * Representação de uma formação no frontend.
 */
export interface FormacaoFrontend {
  id: string;
  nome: string;
  done: boolean;
  image_link: string | null; // Alterado: não é mais opcional com '?', mas pode ser null
  descricao: string | null;  // Alterado: não é mais opcional com '?', mas pode ser null
  capacitacoes: CapacitacaoFrontend[]; // CapacitacaoFrontend deve ser definida consistentemente
}


// Você também pode querer definir tipos para `AvaliacaoFrontend` e `AvaliacaoWorkshopFrontend`,
// se planeja exibir esses dados. Por exemplo:

/*
export interface AvaliacaoFrontend {
  id: string;
  devolutivaId: string;
  avaliadorId: string;
  avaliador?: UserBasicInfo | null;
  nota: number; // Prisma Decimal é convertido para número ou string dependendo das configurações
  comentario?: string | null;
}

export interface AvaliacaoWorkshopFrontend {
  id: string;
  usuarioId: string;
  usuario?: UserBasicInfo | null;
  workshopId: string;
  rating: number;
  feedback?: string | null;
}
*/
export interface RawUserBasicInfo {
  id: string;
  name?: string | null;
}

export interface RawDevolutivaAgendamento {
  id: string;
  workshopId: string;
  agendadorId: string;
  agendador?: RawUserBasicInfo | null;
  avaliadorId: string;
  avaliador?: RawUserBasicInfo | null;
  dataAgendada: string; // Data como string
  criadoEm: string;     // Data como string
}

export interface RawWorkshop {
  id: string;
  nome: string;
  capacitacaoId: string;
  link_video?: string | null;
  devolutivasAgendadas?: RawDevolutivaAgendamento[];

}

export interface RawCapacitacao {
  id:         string;     
  nome:       string;    
  link_video: string;
  formacaoId: string;
  done:       boolean;    
  workshops: RawWorkshop[];
}

export interface RawFormacao { // Exporte se definir em types.ts
  id: string;
  nome: string;
  done: boolean;
  image_link: string | null;
  descricao: string | null;
  capacitacoes: RawCapacitacao[];
}

export interface AgendamentoInfo { 
  temAgendamento: boolean;
  agendamento?: DevolutivaAgendamentoFrontend;
  podeAgendar: boolean;
  statusExibicao: 'agendada' | 'nenhum' | 'enviada';
  dataExibicao?: Date;
}