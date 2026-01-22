
import React from 'react';
import { 
  User, 
  Hash, 
  Car, 
  Truck, 
  Calendar, 
  MessageSquare 
} from 'lucide-react';
import { LabelData } from '../types';

interface FormProps {
  data: LabelData;
  onChange: (field: keyof LabelData, value: string) => void;
}

const FormComponent: React.FC<FormProps> = ({ data, onChange }) => {
  const fields: { id: keyof LabelData; label: string; type: string; placeholder: string; icon: any }[] = [
    { id: 'cliente', label: 'Nome do Cliente', type: 'text', placeholder: 'Ex: João Carlos da Silva', icon: User },
    { id: 'os', label: 'O.S / Protocolo', type: 'text', placeholder: 'Ex: 44290', icon: Hash },
    { id: 'placa', label: 'Placa Veicular', type: 'text', placeholder: 'Ex: ABC-1234', icon: Car },
    { id: 'frota', label: 'Número da Frota', type: 'text', placeholder: 'Ex: Unidade 01', icon: Truck },
    { id: 'data', label: 'Data do Serviço', type: 'date', placeholder: '', icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        {fields.map((field) => (
          <div key={field.id} className={field.id === 'cliente' ? 'md:col-span-2' : ''}>
            <label htmlFor={field.id} className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 ml-1">
              {field.label}
            </label>
            <div className="group relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                <field.icon className="w-4 h-4" />
              </div>
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={data[field.id]}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950 border border-slate-800 rounded-[14px] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium text-white placeholder:text-slate-700 uppercase"
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2">
        <label htmlFor="observacao" className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 ml-1">
          Observações Detalhadas
        </label>
        <div className="group relative">
          <div className="absolute left-3.5 top-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <MessageSquare className="w-4 h-4" />
          </div>
          <textarea
            id="observacao"
            placeholder="Pressione ENTER para pular linhas..."
            value={data.observacao}
            onChange={(e) => onChange('observacao', e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950 border border-slate-800 rounded-[14px] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium text-white placeholder:text-slate-700 h-28 resize-none uppercase"
          />
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
