
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
            {profile?.role === 'admin' && (
              <button 
                onClick={() => onTabChange('users')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Usuários
              </button>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-indigo-400" />
              </div>
              {profile?.role === 'admin' && (
                <div className="absolute -top-1 -right-1 bg-amber-500 text-[8px] font-black px-1 rounded-sm shadow-lg text-black">
                  <Shield className="w-2 h-2" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-white leading-tight truncate max-w-[100px]">{profile?.name}</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{profile?.role}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {activeTab === 'labels' && (
            <div className="flex items-center gap-2">
              <button 
                onClick={onShowHistory}
                className={`group flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  showHistory ? 'text-white bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Histórico</span>
              </button>
              <button 
                onClick={onPrint}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-900/20 transition-all active:scale-[0.98]"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Imprimir</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
