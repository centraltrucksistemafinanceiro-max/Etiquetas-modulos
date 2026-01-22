
export interface LabelData {
  cliente: string;
  os: string;
  placa: string;
  frota: string;
  data: string;
  observacao: string;
  stockItemId?: string; // ID do módulo vinculado no estoque
}

export interface LabelSettings {
  width: number; // em mm
  height: number; // em mm
  gap: number; // em mm
  paddingTop: number; // em mm
  lineSpacing: number; // multiplicador
  fontSize: number; // base em mm/px
  qrSize: number; // porcentagem (0-100)
}

export interface HistoryItem extends LabelData {
  id: string;
  timestamp: number;
}

export interface StockHistory {
  statusAnterior: string;
  statusNovo: string;
  data: number;
  responsavel?: string;
  detalhes?: string;
}

export interface StockConfig {
  tipos: string[];
  frequencias: string[];
}

export interface StockItem {
  id: string;
  descricao: string;
  tipo: string;
  frequencia: string;
  aplicacao: string;
  serial: string;
  quantidade: number;
  status: 'Em Estoque' | 'Emprestado' | 'Em Manutenção';
  
  // Campos Dinâmicos
  localAtual?: string;
  autorizadoPor?: string;
  responsavelManutencao?: string;
  motivoManutencao?: string;
  dataSaida?: string;
  previsaoRetorno?: string;
  
  historico: StockHistory[];
  dataAtualizacao: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}
