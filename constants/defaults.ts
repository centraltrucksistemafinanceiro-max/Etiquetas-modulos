
import { LabelData, LabelSettings } from '../types';

export const initialData: LabelData = {
  cliente: '',
  os: '',
  placa: '',
  frota: '',
  data: new Date().toISOString().split('T')[0],
  observacao: '',
  stockItemId: ''
};

export const initialSettings: LabelSettings = {
  width: 40,
  height: 40,
  gap: 3,
  paddingTop: 3,
  lineSpacing: 1.2,
  fontSize: 11,
  qrSize: 48
};
