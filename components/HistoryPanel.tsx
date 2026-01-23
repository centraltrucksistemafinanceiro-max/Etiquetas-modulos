
import React from 'react';
import { History, X, Trash2, User, Clock } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onClose: () => void;
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClose, onLoad, onDelete }) => {
  return (
    <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl z-50 rounded-[32px] shadow-2xl border border-slate-800 p-8 flex flex-col animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 p-2 rounded-xl">
            <History className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="font-bold text-white text-xl tracking-tight">Histórico de Serviços</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-600">
            <History className="w-12 h-12 mb-4 opacity-10" />
            <p className="text-sm font-medium italic">Vazio por enquanto...</p>
          </div>
        ) : (
          history.map(item => (
            <div 
              key={item.id} 
              onClick={() => onLoad(item)} 
              className="group p-5 rounded-3xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 cursor-pointer transition-all flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-100 truncate">{item.cliente || 'SEM NOME'}</h3>
                  <span className="px-2 py-0.5 bg-slate-800 text-[8px] font-black text-slate-500 rounded-md uppercase">OS: {item.os}</span>
                  {item.shortId && (
                    <span className="px-2 py-0.5 bg-indigo-900/40 text-[8px] font-black text-indigo-400 rounded-md uppercase">#{item.shortId}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <User className="w-3 h-3 text-indigo-400" /> {item.createdBy || 'SIS'}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-600" /> {new Date(item.timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <button onClick={(e) => onDelete(item.id, e)} className="p-2 text-slate-700 hover:text-red-500/50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
