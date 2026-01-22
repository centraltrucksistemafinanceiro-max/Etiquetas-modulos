
import React, { useState, useEffect, Suspense } from 'react';
import { 
  Printer, 
  Trash2, 
  RefreshCcw, 
  History, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Settings2,
  X,
  Type,
  AlignVerticalJustifyStart,
  LineChart,
  Plus,
  QrCode
} from 'lucide-react';
import { LabelData, HistoryItem, LabelSettings } from './types';
import LabelComponent from './components/Label';
import FormComponent from './components/FormComponent';

const initialData: LabelData = {
  cliente: '',
  os: '',
  placa: '',
  frota: '',
  data: new Date().toISOString().split('T')[0],
  observacao: ''
};

const initialSettings: LabelSettings = {
  width: 40,
  height: 40,
  gap: 3,
  paddingTop: 2,
  lineSpacing: 1.2,
  fontSize: 10,
  qrSize: 45
};

const App: React.FC = () => {
  const [data, setData] = useState<LabelData>(initialData);
  const [settings, setSettings] = useState<LabelSettings>(initialSettings);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [viewOnlyData, setViewOnlyData] = useState<LabelData | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get('v');
    if (encodedData) {
      try {
        const decoded = JSON.parse(atob(encodedData));
        setViewOnlyData(decoded);
      } catch (e) {
        console.error("Erro ao decodificar dados do QR Code", e);
      }
    }

    const savedHistory = localStorage.getItem('label_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
    const savedSettings = localStorage.getItem('label_settings');
    if (savedSettings) {
      try { 
        const parsed = JSON.parse(savedSettings);
        // Garantir retrocompatibilidade caso qrSize não exista no storage
        setSettings({ ...initialSettings, ...parsed }); 
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('label_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('label_settings', JSON.stringify(settings));
  }, [settings]);

  const handleInputChange = (field: keyof LabelData, value: string) => {
    setData(prev => ({ ...prev, [field]: value.toUpperCase() }));
  };

  const handleSettingChange = (field: keyof LabelSettings, value: number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const clearForm = () => {
    setData({
      ...initialData,
      data: new Date().toISOString().split('T')[0]
    });
  };

  const saveToHistory = () => {
    const newItem: HistoryItem = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 20));
  };

  const handlePrint = () => {
    saveToHistory();
    window.print();
  };

  const loadFromHistory = (item: HistoryItem) => {
    const { id, timestamp, ...rest } = item;
    setData(rest);
    setShowHistory(false);
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const totalPrintWidth = (settings.width * 2) + settings.gap;

  if (viewOnlyData) {
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
            <LabelComponent data={viewOnlyData} type="main" settings={initialSettings} />
            <LabelComponent data={viewOnlyData} type="meta" settings={initialSettings} />
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-left space-y-3">
             <div className="flex justify-between border-b border-slate-800 pb-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cliente</span>
               <span className="text-sm font-bold text-white">{viewOnlyData.cliente}</span>
             </div>
             <div className="flex justify-between border-b border-slate-800 pb-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">O.S</span>
               <span className="text-sm font-bold text-white">{viewOnlyData.os}</span>
             </div>
             <div className="flex justify-between border-b border-slate-800 pb-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Placa</span>
               <span className="text-sm font-bold text-white">{viewOnlyData.placa}</span>
             </div>
             <div className="pt-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Observações</span>
               <p className="text-xs text-slate-300 leading-relaxed italic">"{viewOnlyData.observacao || 'Sem observações adicionais.'}"</p>
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

      <header className="no-print glass-dark sticky top-0 z-50 border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-900/40">
              <Printer className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">LabelPrinter</h1>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Dark Edition</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="group flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              <History className="w-4 h-4" />
              <span>Histórico</span>
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-900/20 transition-all active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
          </div>
        </div>
      </header>

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

          <div className="bg-slate-900/50 rounded-[24px] shadow-sm border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2 bg-slate-900/80">
              <Settings2 className="w-4 h-4 text-slate-500" />
              <h2 className="font-bold text-white text-sm">Ajustes da Etiqueta</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'LARGURA', key: 'width' },
                  { label: 'ALTURA', key: 'height' },
                  { label: 'ESPAÇO', key: 'gap' }
                ].map(setting => (
                  <div key={setting.key} className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">{setting.label}</label>
                    <input 
                      type="number" 
                      value={settings[setting.key as keyof LabelSettings]} 
                      onChange={(e) => handleSettingChange(setting.key as keyof LabelSettings, Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-semibold"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                {[
                  { label: 'TOPO', key: 'paddingTop', icon: AlignVerticalJustifyStart, step: 0.5 },
                  { label: 'ENTRELINHA', key: 'lineSpacing', icon: LineChart, step: 0.1 },
                  { label: 'FONTE', key: 'fontSize', icon: Type, step: 1 },
                  { label: 'TAMANHO QR', key: 'qrSize', icon: QrCode, step: 1 }
                ].map(setting => (
                  <div key={setting.key} className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <setting.icon className="w-3 h-3" /> {setting.label}
                    </label>
                    <input 
                      type="number" 
                      step={setting.step}
                      value={settings[setting.key as keyof LabelSettings]} 
                      onChange={(e) => handleSettingChange(setting.key as keyof LabelSettings, Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-semibold"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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
              <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl z-50 rounded-[32px] shadow-2xl border border-slate-800 p-8 flex flex-col animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-600/20 p-2 rounded-xl">
                      <History className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="font-bold text-white text-xl tracking-tight">Histórico de Serviços</h2>
                  </div>
                  <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                      <History className="w-12 h-12 mb-4 opacity-10" />
                      <p className="text-sm font-medium italic">Vazio por enquanto...</p>
                    </div>
                  ) : (
                    history.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => loadFromHistory(item)} 
                        className="group p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 cursor-pointer transition-all flex items-center gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-slate-100 truncate">{item.cliente || 'CLIENTE SEM NOME'}</h3>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase mt-1">OS: {item.os || '-'} | PLACA: {item.placa || '-'}</p>
                        </div>
                        <button onClick={(e) => deleteHistoryItem(item.id, e)} className="p-2 text-slate-700 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
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
