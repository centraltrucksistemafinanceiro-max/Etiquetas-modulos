
import React, { useState } from 'react';
import { FileText, RefreshCcw } from 'lucide-react';
import { HistoryItem } from './types';
import { initialSettings } from './constants/defaults';
import { useLabelStore } from './hooks/useLabelStore';
import LabelComponent from './components/Label';
import FormComponent from './components/FormComponent';
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import PreviewSection from './components/PreviewSection';
import ViewOnlyMode from './components/ViewOnlyMode';

const App: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);
  const {
    data,
    settings,
    history,
    viewOnlyData,
    handleInputChange,
    handleSettingChange,
    clearForm,
    saveToHistory,
    loadFromHistory,
    deleteHistoryItem
  } = useLabelStore();

  const handlePrint = () => {
    saveToHistory();
    window.print();
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

  if (viewOnlyData) {
    return <ViewOnlyMode data={viewOnlyData} initialSettings={initialSettings} />;
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
      />

      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
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
          onCloseHistory={() => setShowHistory(false)}
          onLoadFromHistory={handleLoadFromHistory}
          onDeleteHistoryItem={handleDeleteHistoryItem}
        />
      </main>

      <footer className="no-print py-8 border-t border-slate-900 text-center">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Designed for High Precision Industrial Printing</p>
      </footer>

      <div className="print-only print-area">
        <LabelComponent data={data} type="main" settings={settings} isPrint />
        <LabelComponent data={data} type="meta" settings={settings} isPrint />
      </div>
    </div>
  );
};

export default App;
