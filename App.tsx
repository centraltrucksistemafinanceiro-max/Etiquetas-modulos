
import React, { useState } from 'react';
import { FileText, RefreshCcw } from 'lucide-react';
import { HistoryItem } from './types';
import { initialSettings } from './constants/defaults';
import { useLabelStore } from './hooks/useLabelStore';
import { useStockStore } from './hooks/useStockStore';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LabelComponent from './components/Label';
import FormComponent from './components/FormComponent';
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import PreviewSection from './components/PreviewSection';
import ViewOnlyMode from './components/ViewOnlyMode';
import StockTab from './components/StockTab';
import Login from './components/Login';
import UserManagement from './components/UserManagement';

const AppContent: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'labels' | 'stock' | 'users'>('labels');
  const { user, profile, loading: authLoading } = useAuth();
  
  const {
    data,
    settings,
    history,
    viewOnlyData,
    lastSavedId,
    loading: labelLoading,
    handleInputChange,
    handleSettingChange,
    clearForm,
    saveToHistory,
    loadFromHistory,
    deleteHistoryItem
  } = useLabelStore();

  const {
    stock,
    config,
    addStockItem,
    updateStatus,
    deleteStockItem,
    editStockItem,
    addType,
    addFrequency
  } = useStockStore();

  const handlePrint = async () => {
    await saveToHistory();
    // Pequeno delay para garantir que o ID do Firebase foi propagado para o QR Code no DOM
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    loadFromHistory(item);
    setShowHistory(false);
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryItem(id);
  };

  const totalPrintWidth = (settings.width * 2) + settings.gap;

  // View Only Mode (Public Access via QR Code)
  if (viewOnlyData) {
    return <ViewOnlyMode data={viewOnlyData} initialSettings={initialSettings} />;
  }

  // Loading state for initial AUTH check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Scania Inventory Cloud</p>
      </div>
    );
  }

  // Login Required for System Access
  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#020617] text-slate-100">
      <style>
        {`
          @media print {
            @page {
              size: ${totalPrintWidth}mm ${settings.height}mm;
              margin: 0;
            }
            .print-area {
              display: flex !important;
              flex-direction: row !important;
              gap: ${settings.gap}mm !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
            }
          }
        `}
      </style>

      <Header 
        onShowHistory={() => setShowHistory(!showHistory)} 
        onPrint={handlePrint} 
        showHistory={showHistory}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 no-print">
        {activeTab === 'labels' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/50 rounded-[24px] shadow-sm border border-slate-800 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                  <h2 className="font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Dados do Serviço
                  </h2>
                  <button onClick={clearForm} className="p-2 text-slate-500 hover:text-indigo-400 transition-colors">
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6">
                  <FormComponent data={data} onChange={handleInputChange} />
                </div>
              </div>

              <SettingsPanel settings={settings} onChange={handleSettingChange} />
            </div>

            <PreviewSection 
              data={data} 
              settings={settings} 
              showHistory={showHistory} 
              history={history}
              lastSavedId={lastSavedId || undefined}
              onCloseHistory={() => setShowHistory(false)}
              onLoadFromHistory={handleLoadFromHistory}
              onDeleteHistoryItem={handleDeleteHistoryItem}
            />
          </div>
        ) : activeTab === 'stock' ? (
          <StockTab 
            profile={profile}
            stock={stock}
            config={config}
            onAddItem={addStockItem}
            updateStatus={updateStatus}
            onDeleteItem={deleteStockItem}
            onEditItem={editStockItem}
            onAddType={addType}
            onAddFrequency={addFrequency}
          />
        ) : (
          profile?.role === 'admin' && <UserManagement />
        )}
      </main>

      <footer className="no-print py-8 border-t border-slate-900 text-center">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Designed for High Precision Industrial Printing</p>
      </footer>

      {activeTab === 'labels' && (
        <div className="print-only print-area">
          <LabelComponent id={lastSavedId || undefined} data={data} type="main" settings={settings} isPrint />
          <LabelComponent id={lastSavedId || undefined} data={data} type="meta" settings={settings} isPrint />
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
