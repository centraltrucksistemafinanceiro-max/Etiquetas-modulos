
import React from 'react';
import { Printer, History, LayoutGrid, Package, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  onShowHistory: () => void;
  onPrint: () => void;
  showHistory: boolean;
  activeTab: 'labels' | 'stock' | 'users';
  onTabChange: (tab: 'labels' | 'stock' | 'users') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onShowHistory, 
  onPrint, 
  showHistory, 
  activeTab, 
  onTabChange 
}) => {
  const { profile, logout } = useAuth();

  return (
    <>
      <header className="no-print glass-dark sticky top-0 z-50 border-b border-slate-800/60 px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-900/40">
              <Printer className="text-white w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h1 className="text-sm md:text-lg font-bold text-white tracking-tight leading-none">LabelPrinter</h1>
              <span className="text-[8px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Scania Mobile</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => onTabChange('labels')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'labels' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Etiquetas
              </button>
              <button 
                onClick={() => onTabChange('stock')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'stock' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                Estoque
              </button>
              {profile?.role === 'admin' && (
                <button 
                  onClick={() => onTabChange('users')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                    activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  Usuários
                </button>
              )}
            </nav>

            <div className="flex items-center gap-2 md:gap-3 bg-slate-900/40 border border-slate-800 px-2 md:px-3 py-1.5 rounded-xl md:rounded-2xl">
              <div className="relative">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <UserIcon className="w-3 h-3 md:w-4 md:h-4 text-indigo-400" />
                </div>
                {profile?.role === 'admin' && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 text-[6px] font-black px-0.5 rounded-sm shadow-lg text-black">
                    <Shield className="w-2 h-2" />
                  </div>
                )}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] font-bold text-white leading-tight truncate max-w-[80px]">{profile?.name?.split(' ')[0]}</span>
                <span className="text-[8px] font-black text-slate-500 uppercase">{profile?.role}</span>
              </div>
              <button 
                onClick={logout}
                className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Print/History Buttons - Hidden on Mobile Labels Tab (Moved to floating or bottom) */}
            {activeTab === 'labels' && (
              <div className="hidden md:flex items-center gap-2">
                <button 
                  onClick={onShowHistory}
                  className={`p-2.5 rounded-xl transition-all ${
                    showHistory ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <History className="w-5 h-5" />
                </button>
                <button 
                  onClick={onPrint}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-900/20 transition-all active:scale-[0.98]"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navegação Inferior Mobile */}
      <nav className="lg:hidden no-print fixed bottom-0 left-0 w-full bg-[#020617] border-t border-slate-800/80 z-[100] px-4 py-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          <button 
            onClick={() => onTabChange('labels')}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === 'labels' ? 'text-indigo-400' : 'text-slate-500'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'labels' ? 'bg-indigo-600/10' : ''}`}>
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Etiquetas</span>
          </button>
          
          <button 
            onClick={() => onTabChange('stock')}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === 'stock' ? 'text-indigo-400' : 'text-slate-500'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'stock' ? 'bg-indigo-600/10' : ''}`}>
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">Estoque</span>
          </button>

          {profile?.role === 'admin' && (
            <button 
              onClick={() => onTabChange('users')}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${activeTab === 'users' ? 'text-indigo-400' : 'text-slate-500'}`}
            >
              <div className={`p-2 rounded-xl ${activeTab === 'users' ? 'bg-indigo-600/10' : ''}`}>
                <UserIcon className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">Usuários</span>
            </button>
          )}

          {activeTab === 'labels' && (
            <div className="flex gap-1">
              <button 
                onClick={onShowHistory}
                className={`p-3 rounded-2xl transition-all ${showHistory ? 'text-indigo-400 bg-indigo-600/10' : 'text-slate-500'}`}
              >
                <History className="w-5 h-5" />
              </button>
              <button 
                onClick={onPrint}
                className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-900/40 active:scale-90 transition-all ml-1"
              >
                <Printer className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </nav>
      {/* Spacer para o menu inferior no mobile */}
      <div className="lg:hidden h-20"></div>
    </>
  );
};

export default Header;
