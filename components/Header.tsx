
import React from 'react';
import { Printer, History, LayoutGrid, Package } from 'lucide-react';

interface HeaderProps {
  onShowHistory: () => void;
  onPrint: () => void;
  showHistory: boolean;
  activeTab: 'labels' | 'stock';
  onTabChange: (tab: 'labels' | 'stock') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onShowHistory, 
  onPrint, 
  showHistory, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <header className="no-print glass-dark sticky top-0 z-50 border-b border-slate-800/60 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-900/40">
              <Printer className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">LabelPrinter</h1>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Dark Edition</span>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => onTabChange('labels')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'labels' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Etiquetas
            </button>
            <button 
              onClick={() => onTabChange('stock')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'stock' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              Estoque
            </button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {activeTab === 'labels' && (
            <>
              <button 
                onClick={onShowHistory}
                className={`group flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  showHistory ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Histórico</span>
              </button>
              <button 
                onClick={onPrint}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-900/20 transition-all active:scale-[0.98]"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
