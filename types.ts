
export interface LabelData {
  cliente: string;
  os: string;
  placa: string;
  frota: string;
  data: string;
  observacao: string;
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
