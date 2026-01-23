
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
import Login from './components/Login';

// Importação dinâmica (Lazy Loading) para componentes pesados
// Isso reduz o tamanho do download inicial
const StockTab = React.lazy(() => import('./components/StockTab'));
const UserManagement = React.lazy(() => import('./components/UserManagement'));
const ViewOnlyMode = React.lazy(() => import('./components/ViewOnlyMode'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
    <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
  </div>
);

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
    handleSelectModule,
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
    if (!data.stockItemId) {
      alert("ERRO: Vincule um Módulo do Estoque antes de imprimir a etiqueta.");
      return;
    }

    // Abrimos a janela IMEDIATAMENTE antes do await para evitar bloqueio de pop-up pelo navegador
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert("Por favor, habilite as janelas pop-up para permitir a impressão das etiquetas.");
      return;
    }

    // Salvamos no histórico (Firebase agora gera o ID)
    await saveToHistory(profile);
    
    const printArea = document.querySelector('.print-area-content');
    if (!printArea) {
      printWindow.close();
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Etiquetas Scania</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { 
              size: ${totalPrintWidth}mm ${settings.height}mm; 
              margin: 0; 
            }
            body { margin: 0; padding: 0; background: white; }
            .print-container { 
              display: flex; 
              flex-direction: row; 
              gap: ${settings.gap}mm; 
              width: ${totalPrintWidth}mm;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printArea.innerHTML}
          </div>
          <script>
            // Pequeno delay para renderização total (Tailwind + QR Code)
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 500);
            }, 1000);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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

  // 1. Loading inicial de Autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Central Stock & Tag</p>
      </div>
    );
  }

  // 2. Modo Visualização (Acesso Público via QR Code)
  if (viewOnlyData) {
    return (
      <React.Suspense fallback={<LoadingFallback />}>
        <ViewOnlyMode data={viewOnlyData} initialSettings={initialSettings} />
      </React.Suspense>
    );
  }

  // 3. Se não está logado, vai para Login imediatamente
  if (!user) {
    return <Login />;
  }

  // 4. Se logado, espera carregar os dados específicos (Histórico, etc)
  if (labelLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen flex flex-col antialiased bg-[#020617] text-slate-100">

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
                  <FormComponent 
                    data={data} 
                    stock={stock}
                    onChange={handleInputChange} 
                    onSelectModule={handleSelectModule} 
                  />
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
          <React.Suspense fallback={<LoadingFallback />}>
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
          </React.Suspense>
        ) : (
          profile?.role === 'admin' && (
            <React.Suspense fallback={<LoadingFallback />}>
              <UserManagement />
            </React.Suspense>
          )
        )}
      </main>

      <footer className="no-print py-8 border-t border-slate-900 text-center">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Central Stock & Tag • Precision Inventory</p>
      </footer>

      {activeTab === 'labels' && (
        <div className="hidden print-area-content">
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
