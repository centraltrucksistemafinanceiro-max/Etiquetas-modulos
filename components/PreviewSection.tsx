
import React, { Suspense } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { LabelData, LabelSettings, HistoryItem } from '../types';
import LabelComponent from './Label';
import HistoryPanel from './HistoryPanel';

interface PreviewSectionProps {
  data: LabelData;
  settings: LabelSettings;
  showHistory: boolean;
  history: HistoryItem[];
  onCloseHistory: () => void;
  onLoadFromHistory: (item: HistoryItem) => void;
  onDeleteHistoryItem: (id: string, e: React.MouseEvent) => void;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ 
  data, 
  settings, 
  showHistory, 
  history, 
  onCloseHistory, 
  onLoadFromHistory, 
  onDeleteHistoryItem 
}) => {
  return (
    <div className="lg:col-span-7 flex flex-col h-full min-h-[500px] relative">
      <div className="sticky top-28 space-y-6">
        <div className="bg-slate-950 rounded-[32px] shadow-2xl p-8 overflow-hidden relative border border-slate-800">
           <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full"></div>
           
           <div className="flex justify-between items-center mb-10 relative z-10">
             <div>
                <h2 className="font-bold text-white text-xl">Preview das Etiquetas</h2>
                <p className="text-slate-500 text-xs mt-1">Aparência física do papel térmico</p>
             </div>
             <div className="px-4 py-2 bg-indigo-900/20 border border-indigo-500/20 rounded-2xl flex items-center gap-3 backdrop-blur-md">
               <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
               <span className="text-indigo-300 text-[11px] font-bold tracking-tight uppercase">
                MODO IMPRESSÃO: ON
               </span>
             </div>
           </div>

           <div className="flex justify-center items-center py-12 px-4 bg-slate-900/40 rounded-[24px] border border-slate-800 inner-shadow overflow-x-auto min-h-[400px]">
              <Suspense fallback={<div className="text-slate-500 italic">Carregando prévia...</div>}>
                <div 
                  className="flex flex-row transition-all duration-300 ease-out origin-center" 
                  style={{ gap: `${settings.gap}mm` }}
                >
                  <LabelComponent data={data} type="main" settings={settings} />
                  <LabelComponent data={data} type="meta" settings={settings} />
                </div>
              </Suspense>
           </div>

           <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
             <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-white block mb-0.5">Fidelidade Total</strong>
                  O preview utiliza milímetros reais para garantir precisão no corte.
                </div>
             </div>
             <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-white block mb-0.5">Nota de Impressão</strong>
                  Lembre-se de remover cabeçalhos/rodapés na tela de impressão do Windows.
                </div>
             </div>
           </div>
        </div>

        {showHistory && (
          <HistoryPanel 
            history={history} 
            onClose={onCloseHistory} 
            onLoad={onLoadFromHistory} 
            onDelete={onDeleteHistoryItem} 
          />
        )}
      </div>
    </div>
  );
};

export default PreviewSection;
