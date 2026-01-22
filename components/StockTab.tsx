
import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Trash2, 
  X,
  Cpu,
  History as HistoryIcon,
  User,
  MapPin,
  Settings,
  Calendar,
  ClipboardList,
  ChevronDown,
  Info,
  Edit,
  PlusCircle,
  ArrowRightLeft,
  Filter,
  Printer
} from 'lucide-react';
import { StockItem, StockHistory, StockConfig, UserProfile } from '../types';

interface StockTabProps {
  profile: UserProfile | null;
  stock: StockItem[];
  config: StockConfig;
  onAddItem: (item: Omit<StockItem, 'id' | 'dataAtualizacao' | 'historico'>) => void;
  updateStatus: (id: string, newStatus: StockItem['status'], extras: Partial<StockItem>) => void;
  onDeleteItem: (id: string) => void;
  onEditItem: (id: string, updates: Partial<StockItem>) => void;
  onAddType: (type: string) => void;
  onAddFrequency: (freq: string) => void;
}

const Autocomplete: React.FC<{
  value: string;
  onChange: (val: string) => void;
  suggestions: string[];
  placeholder: string;
  label: string;
  required?: boolean;
}> = ({ value, onChange, suggestions, placeholder, label, required }) => {
  const [show, setShow] = useState(false);
  const filtered = useMemo(() => {
    if (!value) return [];
    return suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()) && s !== value).slice(0, 5);
  }, [value, suggestions]);

  return (
    <div className="space-y-2 relative">
      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <input 
        required={required}
        value={value}
        onChange={e => onChange(e.target.value.toUpperCase())}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none"
        placeholder={placeholder}
      />
      {show && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          {filtered.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => {
                onChange(s);
                setShow(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const StockTab: React.FC<StockTabProps> = ({ 
  profile,
  stock, 
  config,
  onAddItem, 
  updateStatus, 
  onDeleteItem,
  onEditItem,
  onAddType,
  onAddFrequency
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState<'NONE' | 'ADD' | 'EDIT' | 'ACTION' | 'HISTORY'>('NONE');
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<StockItem, 'id' | 'dataAtualizacao' | 'historico'>>({
    descricao: '', tipo: config.tipos[0] || 'Outros', frequencia: config.frequencias[0] || 'Outra',
    aplicacao: '', serial: '', quantidade: 1, status: 'Em Estoque', localAtual: '',
    autorizadoPor: '', responsavelManutencao: '', motivoManutencao: '', dataSaida: '', previsaoRetorno: ''
  });

  const [actionData, setActionData] = useState<Partial<StockItem>>({});

  const suggestions = useMemo(() => ({
    descricoes: Array.from(new Set(stock.map(s => s.descricao))),
    aplicacoes: Array.from(new Set(stock.map(s => s.aplicacao))),
    locais: Array.from(new Set(stock.map(s => s.localAtual || ''))).filter(Boolean),
    responsaveis: Array.from(new Set([...stock.map(s => s.autorizadoPor || ''), ...stock.map(s => s.responsavelManutencao || '')])).filter(Boolean)
  }), [stock]);

  const filteredStock = stock.filter(item => 
    item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'ADD' && stock.some(s => s.serial === formData.serial)) {
      alert("ERRO: Este Código/Serial já existe no sistema!");
      return;
    }

    if (modalMode === 'ADD') {
      onAddItem({ ...formData, dataSaida: formData.status === 'Em Manutenção' ? new Date().toLocaleDateString('pt-BR') : '' });
    } else if (modalMode === 'EDIT' && selectedItem) {
      onEditItem(selectedItem.id, formData);
    }
    
    setModalMode('NONE');
    resetForm();
  };

  const handleUpdateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const newStatus = actionData.status || selectedItem.status;
    const extras: Partial<StockItem> = {
      ...actionData,
      dataSaida: newStatus === 'Em Manutenção' ? new Date().toLocaleDateString('pt-BR') : actionData.dataSaida
    };

    updateStatus(selectedItem.id, newStatus, extras);
    setModalMode('NONE');
    setActionData({});
  };

  const resetForm = () => {
    setFormData({
      descricao: '', tipo: config.tipos[0] || 'Outros', frequencia: config.frequencias[0] || 'Outra',
      aplicacao: '', serial: '', quantidade: 1, status: 'Em Estoque', localAtual: '',
      autorizadoPor: '', responsavelManutencao: '', motivoManutencao: '', dataSaida: '', previsaoRetorno: ''
    });
  };

  const handleAddNewOption = (field: 'tipo' | 'frequencia') => {
    const newVal = prompt(`Digite o novo ${field === 'tipo' ? 'Tipo' : 'Frequência'}:`);
    if (newVal) {
      const upper = newVal.toUpperCase();
      if (field === 'tipo') onAddType(upper);
      else onAddFrequency(upper);
    }
  };

  const handlePrintStock = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const stockHtml = `
      <html>
        <head>
          <title>Inventário de Módulos Scania</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            h1 { margin: 0; color: #0f172a; font-size: 24px; }
            .meta { color: #64748b; font-size: 14px; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #f8fafc; padding: 12px; border-bottom: 2px solid #e2e8f0; font-size: 10px; text-transform: uppercase; color: #475569; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
            .status-badge { padding: 4px 8px; border-radius: 999px; font-size: 10px; font-weight: bold; text-transform: uppercase; border: 1px solid #e2e8f0; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Inventário de Estoque - Scania</h1>
              <div class="meta">Relatório Geral de Módulos</div>
              <div class="meta">EMITIDO EM: ${new Date().toLocaleString('pt-BR')}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th>Descrição</th>
                <th>Aplicação</th>
                <th>Tipo/Freq</th>
                <th>S/N Serial</th>
                <th>Qtd</th>
                <th>Local/Detalhes</th>
              </tr>
            </thead>
            <tbody>
              ${filteredStock.map(item => `
                <tr>
                  <td><span class="status-badge">${item.status}</span></td>
                  <td><strong>${item.descricao}</strong></td>
                  <td>${item.aplicacao || '-'}</td>
                  <td>${item.tipo} / ${item.frequencia}</td>
                  <td><code>${item.serial}</code></td>
                  <td>${item.quantidade}</td>
                  <td>
                    ${item.status === 'Em Estoque' ? 'Depósito' : 
                      item.status === 'Emprestado' ? `${item.localAtual} (Aut: ${item.autorizadoPor})` :
                      `${item.responsavelManutencao}${item.motivoManutencao ? ` - Motivo: ${item.motivoManutencao}` : ''}`}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.print(); setTimeout(() => window.close(), 500);</script>
        </body>
      </html>
    `;
    printWindow.document.write(stockHtml);
    printWindow.document.close();
  };

  const handlePrintHistory = () => {
    if (!selectedItem) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const historyHtml = `
      <html>
        <head>
          <title>Histórico - ${selectedItem.serial}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            h1 { margin: 0; color: #0f172a; font-size: 24px; }
            .meta { color: #64748b; font-size: 14px; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; background: #f8fafc; padding: 12px; border-bottom: 2px solid #e2e8f0; font-size: 12px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
            .status { font-weight: bold; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Cadeia de Custódia - Módulo Scania</h1>
            <div class="meta">DESCRIÇÃO: ${selectedItem.descricao} | SERIAL: ${selectedItem.serial}</div>
            <div class="meta">EMITIDO EM: ${new Date().toLocaleString('pt-BR')}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Status Anterior</th>
                <th>Novo Status</th>
                <th>Responsável</th>
                <th>Detalhes/Motivo</th>
              </tr>
            </thead>
            <tbody>
              ${selectedItem.historico.map(h => `
                <tr>
                  <td>${new Date(h.data).toLocaleString('pt-BR')}</td>
                  <td>${h.statusAnterior}</td>
                  <td class="status">${h.statusNovo}</td>
                  <td>${h.responsavel || 'SISTEMA'}</td>
                  <td>${h.detalhes || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.print(); setTimeout(() => window.close(), 500);</script>
        </body>
      </html>
    `;
    printWindow.document.write(historyHtml);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Cpu className="w-7 h-7 text-indigo-500" />
            Planilha de Módulos SCANIA
          </h2>
          <p className="text-slate-500 text-sm mt-1">Visão tabular consolidada do inventário</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handlePrintStock}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all no-print"
            title="Imprimir Planilha Completa"
          >
            <Printer className="w-4 h-4" />
          </button>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
            />
          </div>
          <button 
            onClick={() => { resetForm(); setModalMode('ADD'); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Novo Módulo
          </button>
        </div>
      </div>

      {/* PLANILHA (TABLE) */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl print:border-none print:shadow-none print:bg-white">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px] print:min-w-full">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 print:bg-slate-100 print:border-slate-300">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black">Descrição</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black">Tipo / Freq</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black">S/N Serial</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest print:text-black">Local / Detalhes</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right no-print">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-medium print:divide-slate-200">
              {filteredStock.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-500 italic">
                    Nenhum registro encontrado na planilha.
                  </td>
                </tr>
              ) : (
                filteredStock.map(item => (
                  <tr key={item.id} className="group hover:bg-slate-800/30 transition-colors print:bg-white">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter print:border print:text-black ${
                        item.status === 'Em Estoque' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        item.status === 'Emprestado' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {item.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-bold print:text-black">{item.descricao}</span>
                        <span className="text-[10px] text-slate-500 uppercase print:text-slate-600">{item.aplicacao || 'GERAL'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-indigo-400 text-[10px] font-bold uppercase print:text-black">{item.tipo}</span>
                        <span className="text-slate-400 text-[10px] font-bold print:text-slate-600">{item.frequencia}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-300 bg-slate-950 px-2 py-1 rounded border border-slate-800 print:text-black print:bg-none print:border-none">{item.serial}</span>
                    </td>
                    <td className="px-6 py-4 max-w-[250px]">
                      {item.status === 'Emprestado' ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-[10px] text-amber-200">
                            <MapPin className="w-3 h-3 no-print" /> {item.localAtual}
                          </div>
                          <span className="text-[9px] text-slate-500 uppercase ml-5">AUT: {item.autorizadoPor}</span>
                        </div>
                      ) : item.status === 'Em Manutenção' ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-[10px] text-blue-300">
                            <Settings className="w-3 h-3 no-print" /> {item.responsavelManutencao}
                          </div>
                          {item.motivoManutencao && (
                            <span className="text-[10px] text-slate-400 italic ml-5 truncate" title={item.motivoManutencao}>
                              Motive: {item.motivoManutencao}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">No Depósito</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right no-print">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => { setSelectedItem(item); setModalMode('ACTION'); setActionData({}); }}
                          className="p-2 text-slate-500 hover:text-indigo-400 transition-colors"
                          title="Movimentar"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setSelectedItem(item); setModalMode('EDIT'); setFormData(item); }}
                          className="p-2 text-slate-500 hover:text-white transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setSelectedItem(item); setModalMode('HISTORY'); }}
                          className="p-2 text-slate-500 hover:text-indigo-400 transition-colors"
                          title="Histórico"
                        >
                          <HistoryIcon className="w-4 h-4" />
                        </button>
                        {profile?.role === 'admin' && (
                          <button 
                            onClick={() => onDeleteItem(item.id)}
                            className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ADD/EDIT */}
      {(modalMode === 'ADD' || modalMode === 'EDIT') && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-[#0f172a] border border-slate-800 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h3 className="text-lg font-bold text-white uppercase">{modalMode === 'ADD' ? 'Novo Módulo' : 'Editar Módulo'}</h3>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Scania Workshop Logic</p>
              </div>
              <button type="button" onClick={() => setModalMode('NONE')} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Autocomplete label="Descrição" value={formData.descricao} onChange={v => setFormData({...formData, descricao: v})} suggestions={suggestions.descricoes} placeholder="EX: ECU MOTOR" required />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Tipo</label>
                    <button type="button" onClick={() => handleAddNewOption('tipo')} className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><PlusCircle className="w-3 h-3" /> Adicionar</button>
                  </div>
                  <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500">
                    {config.tipos.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Frequência</label>
                    <button type="button" onClick={() => handleAddNewOption('frequencia')} className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><PlusCircle className="w-3 h-3" /> Adicionar</button>
                  </div>
                  <select 
                    value={formData.frequencia} 
                    onChange={e => setFormData({...formData, frequencia: e.target.value})} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  >
                    {config.frequencias.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <Autocomplete label="Aplicação Scania" value={formData.aplicacao} onChange={v => setFormData({...formData, aplicacao: v})} suggestions={suggestions.aplicacoes} placeholder="EX: SÉRIE R" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Código / Serial</label>
                  <input required value={formData.serial} onChange={e => setFormData({...formData, serial: e.target.value.toUpperCase()})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Quantidade</label>
                  <input type="number" min="1" value={formData.quantidade} onChange={e => setFormData({...formData, quantidade: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-indigo-500 outline-none" />
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-slate-800 flex justify-end gap-4 bg-slate-950/30">
              <button type="button" onClick={() => setModalMode('NONE')} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors">Cancelar</button>
              <button type="submit" className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-[0.98]">Salvar</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL ACTION */}
      {modalMode === 'ACTION' && selectedItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <form onSubmit={handleUpdateAction} className="bg-[#0f172a] border border-slate-800 w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-lg font-bold text-white uppercase">Mover Módulo</h3>
              <button type="button" onClick={() => setModalMode('NONE')} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {['Em Estoque', 'Emprestado', 'Em Manutenção'].map(st => (
                  <button key={st} type="button" onClick={() => setActionData({...actionData, status: st as any})} className={`py-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${(actionData.status || selectedItem.status) === st ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}>{st}</button>
                ))}
              </div>
              {(actionData.status || selectedItem.status) === 'Emprestado' && (
                <div className="grid grid-cols-1 gap-4 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                  <Autocomplete label="Local / Destino" value={actionData.localAtual || selectedItem.localAtual || ''} onChange={v => setActionData({...actionData, localAtual: v})} suggestions={suggestions.locais} placeholder="DESTINO" required />
                  <Autocomplete label="Autorizado por" value={actionData.autorizadoPor || selectedItem.autorizadoPor || ''} onChange={v => setActionData({...actionData, autorizadoPor: v})} suggestions={suggestions.responsaveis} placeholder="NOME" required />
                </div>
              )}
              {(actionData.status || selectedItem.status) === 'Em Manutenção' && (
                <div className="space-y-4 p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                  <Autocomplete label="Técnico / Registro" value={actionData.responsavelManutencao || selectedItem.responsavelManutencao || ''} onChange={v => setActionData({...actionData, responsavelManutencao: v})} suggestions={suggestions.responsaveis} placeholder="RESPONSÁVEL" required />
                  <Autocomplete label="Motivo" value={actionData.motivoManutencao || selectedItem.motivoManutencao || ''} onChange={v => setActionData({...actionData, motivoManutencao: v})} suggestions={[]} placeholder="MOTIVO" required />
                </div>
              )}
            </div>
            <div className="p-8 border-t border-slate-800 flex justify-end gap-4 bg-slate-950/30">
              <button type="button" onClick={() => setModalMode('NONE')} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors">Cancelar</button>
              <button type="submit" className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">Atualizar Planilha</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL HISTORY */}
      {modalMode === 'HISTORY' && selectedItem && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-3">
                <HistoryIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white uppercase tracking-tight">Cadeia de Custódia</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrintHistory}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                  title="Imprimir Relatório de Custódia"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button onClick={() => setModalMode('NONE')} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
               <div className="mb-6">
                 <h4 className="text-sm font-bold text-white uppercase">{selectedItem.descricao}</h4>
                 <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">S/N: {selectedItem.serial}</p>
               </div>
               <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                  {selectedItem.historico.map((h, i) => (
                    <div key={i} className="relative pl-10">
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-950 border-2 border-slate-800 flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'}`}></div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{h.statusAnterior}</span>
                          <ChevronDown className="w-3 h-3 text-slate-700" />
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">{h.statusNovo}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 italic">"{h.detalhes}"</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[9px] font-bold text-slate-600 uppercase flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {new Date(h.data).toLocaleDateString('pt-BR')}</span>
                          <span className="text-[9px] font-bold text-slate-600 uppercase flex items-center gap-1"><User className="w-2.5 h-2.5" /> {h.responsavel || 'SIS'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="p-8 border-t border-slate-800 bg-slate-950/30">
               <button onClick={() => setModalMode('NONE')} className="w-full py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-xl transition-all">Fechar</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default StockTab;
