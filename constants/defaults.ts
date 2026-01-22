
import { LabelData, LabelSettings } from '../types';

export const initialData: LabelData = {
  cliente: '',
  os: '',
  placa: '',
  frota: '',
  data: new Date().toISOString().split('T')[0],
  observacao: ''
};

export const initialSettings: LabelSettings = {
  width: 40,
  height: 40,
  gap: 3,
  paddingTop: 2,
  lineSpacing: 1.2,
  fontSize: 10,
  qrSize: 45
};
