
export interface LabelData {
  cliente: string;
  os: string;
  placa: string;
  frota: string;
  data: string;
  observacao: string;
  stockItemId?: string;
  createdBy?: string; // Nome do usuário que criou
}

export interface LabelSettings {
  width: number;
  height: number;
  gap: number;
  paddingTop: number;
  lineSpacing: number;
  fontSize: number;
  qrSize: number;
}

export interface HistoryItem extends LabelData {
  id: string;
  timestamp: number;
  createdByEmail?: string;
}

export interface StockHistory {
  statusAnterior: string;
  statusNovo: string;
  data: number;
  responsavel?: string;
  responsavelUid?: string;
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
  createdBy?: string;
  updatedBy?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}
