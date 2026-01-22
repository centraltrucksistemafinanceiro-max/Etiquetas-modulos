
import React from 'react';
import { CheckCircle2, Plus, Smartphone, Database, ShieldCheck, Printer } from 'lucide-react';
import { LabelData, LabelSettings } from '../types';
import LabelComponent from './Label';

interface ViewOnlyModeProps {
  data: LabelData;
  initialSettings: LabelSettings;
}

const ViewOnlyMode: React.FC<ViewOnlyModeProps> = ({ data, initialSettings }) => {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center p-6 md:p-12 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header / Status */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="bg-indigo-600 p-4 rounded-[2rem] mb-6 shadow-2xl shadow-indigo-900/40 relative">
          <ShieldCheck className="w-10 h-10 text-white" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-[#020617] animate-pulse"></div>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Etiqueta Digital Validada</h1>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-900/80 border border-slate-800 rounded-full">
            <Database className="w-3 h-3 text-indigo-400" />
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Sincronizado com Nuvem Scania</p>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Visual Preview Section */}
        <div className="flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
          <div className="relative group">
            <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex flex-col sm:flex-row justify-center gap-6 p-10 bg-slate-950/50 border border-slate-800 rounded-[40px] backdrop-blur-sm shadow-2xl overflow-hidden">
                {/* Simulated Thermal Paper Effect */}
                <div className="flex flex-col gap-6 scale-110 sm:scale-125 md:scale-150 py-8">
                    <LabelComponent data={data} type="main" settings={initialSettings} />
                    <LabelComponent data={data} type="meta" settings={initialSettings} />
                </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <p className="text-sm font-medium">Visualização idêntica à etiqueta física aplicada</p>
          </div>
        </div>

        {/* Detailed Data Section */}
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-400">
          <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Database className="w-32 h-32" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-8 border-l-4 border-indigo-500 pl-4">Informações do Registro</h2>
            
            <div className="space-y-6">
              <div className="space-y-1 group">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-1">Proprietário / Cliente</span>
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-lg font-bold text-white group-hover:border-indigo-500/50 transition-colors">
                    {data.cliente || 'NÃO INFORMADO'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nº Ordem Serviço</span>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-mono font-bold text-indigo-300">
                      # {data.os || '---'}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Placa Veículo</span>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-white uppercase tracking-tighter">
                      {data.placa || '---'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Frota / ID</span>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-slate-300">
                      ID: {data.frota || '---'}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Data de Emissão</span>
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-slate-300">
                      {data.data ? data.data.split('-').reverse().join('/') : '---'}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Observações Técnicas</span>
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-6 text-sm text-slate-400 leading-relaxed italic border-l-4 border-l-amber-500/50">
                    "{data.observacao || 'Nenhuma observação técnica adicional registrada para este serviço.'}"
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => window.location.href = window.location.origin}
                className="flex items-center justify-center gap-3 py-4 bg-slate-900 border border-slate-800 text-white font-bold rounded-[20px] hover:bg-slate-800 transition-all active:scale-95 text-xs uppercase tracking-widest"
            >
                <Plus className="w-5 h-5 text-indigo-400" />
                Novo Registro
            </button>
            <button 
                onClick={() => window.print()}
                className="flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white font-bold rounded-[20px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/20 active:scale-95 text-xs uppercase tracking-widest"
            >
                <Printer className="w-5 h-5" />
                Imprimir Cópia
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-20 py-10 w-full border-t border-slate-900 flex flex-col items-center gap-2">
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">LabelPrinter Cloud Verification System</p>
        <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">© 2024 Scania Workshop Official Network</p>
      </footer>
    </div>
  );
};

export default ViewOnlyMode;
