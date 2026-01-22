
import React from 'react';
import { CheckCircle2, Plus } from 'lucide-react';
import { LabelData, LabelSettings } from '../types';
import LabelComponent from './Label';

interface ViewOnlyModeProps {
  data: LabelData;
  initialSettings: LabelSettings;
}

const ViewOnlyMode: React.FC<ViewOnlyModeProps> = ({ data, initialSettings }) => {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-indigo-600 p-3 rounded-2xl mb-4 shadow-xl shadow-indigo-900/40">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Etiqueta Digital Validada</h1>
        <p className="text-slate-400 text-sm">Informações oficiais do sistema de serviço</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="flex justify-center gap-3">
          <LabelComponent data={data} type="main" settings={initialSettings} />
          <LabelComponent data={data} type="meta" settings={initialSettings} />
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-left space-y-3">
           <div className="flex justify-between border-b border-slate-800 pb-2">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cliente</span>
             <span className="text-sm font-bold text-white">{data.cliente}</span>
           </div>
           <div className="flex justify-between border-b border-slate-800 pb-2">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">O.S</span>
             <span className="text-sm font-bold text-white">{data.os}</span>
           </div>
           <div className="flex justify-between border-b border-slate-800 pb-2">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Placa</span>
             <span className="text-sm font-bold text-white">{data.placa}</span>
           </div>
           <div className="pt-2">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Observações</span>
             <p className="text-xs text-slate-300 leading-relaxed italic">"{data.observacao || 'Sem observações adicionais.'}"</p>
           </div>
        </div>

        <button 
          onClick={() => window.location.href = window.location.pathname}
          className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Criar Nova Etiqueta
        </button>
      </div>

      <footer className="mt-12 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
        LabelPrinter Cloud Verification System
      </footer>
    </div>
  );
};

export default ViewOnlyMode;
