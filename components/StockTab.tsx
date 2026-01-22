
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
  PlusCircle
} from 'lucide-react';
import { StockItem, StockHistory, StockConfig } from '../types';

interface StockTabProps {
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
    descricao: '', tipo: 'Motor', frequencia: '40 MHz', aplicacao: '', serial: '',
    quantidade: 1, status: 'Em Estoque', localAtual: '', autorizadoPor: '',
    responsavelManutencao: '', motivoManutencao: '', dataSaida: '', previsaoRetorno: ''
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
    item.tipo.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Cpu className="w-7 h-7 text-indigo-500" />
            Gestão de Módulos SCANIA
          </h2>
          <p className="text-slate-500 text-sm mt-1">Controle dinâmico e rastreabilidade total</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Buscar módulos..."
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
            Cadastrar
          </button>
        </div>
      </div>

      {(modalMode === 'ADD' || modalMode === 'EDIT') && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-[#0f172a] border border-slate-800 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h3 className="text-lg font-bold text-white uppercase">{modalMode === 'ADD' ? 'Novo Módulo' : 'Editar Módulo'}</h3>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Workshop Logic</p>
              </div>
              <button type="button" onClick={() => setModalMode('NONE')} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Autocomplete 
                  label="Descrição" 
                  value={formData.descricao} 
                  onChange={v => setFormData({...formData, descricao: v})} 
                  suggestions={suggestions.descricoes} 
                  placeholder="EX: ECU MOTOR" 
                  required 
                />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Tipo</label>
                    <button type="button" onClick={() => handleAddNewOption('tipo')} className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"><PlusCircle className="w-3 h-3" /> Adicionar</button>
                  </div>
                  <select 
                    value={formData.tipo}
                    onChange={e => setFormData({...formData, tipo: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                  >
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
                    className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-4 py-3 text-sm text-indigo-400 font-bold focus:border-indigo-500 outline-none"
                  >
                    {config.frequencias.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <Autocomplete 
                  label="Aplicação Scania" 
                  value={formData.aplicacao} 
                  onChange={v => setFormData({...formData, aplicacao: v})} 
                  suggestions={suggestions.aplicacoes} 
                  placeholder="EX: SÉRIE R" 
                />
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

              {modalMode === 'ADD' && (
                <div className="space-y-2 p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Status de Entrada</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Em Estoque', 'Emprestado', 'Em Manutenção'].map(st => (
                      <button key={st} type="button" onClick={() => setFormData({...formData, status: st as any})} className={`py-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${formData.status === st ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}>{st}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-800 flex justify-end gap-4 bg-slate-950/30">
              <button type="button" onClick={() => setModalMode('NONE')} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors">Cancelar</button>
              <button type="submit" className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all active:scale-[0.98]">Salvar</button>
            </div>
          </form>
        </div>
      )}

      {modalMode === 'ACTION' && selectedItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <form onSubmit={handleUpdateAction} className="bg-[#0f172a] border border-slate-800 w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div>
                <h3 className="text-lg font-bold text-white uppercase">Mudar Status</h3>
                <p className="text-xs text-indigo-400 font-bold uppercase mt-0.5">{selectedItem.serial}</p>
              </div>
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
                  <Autocomplete label="Local / Com quem" value={actionData.localAtual || selectedItem.localAtual || ''} onChange={v => setActionData({...actionData, localAtual: v})} suggestions={suggestions.locais} placeholder="DESTINO" required />
                  <Autocomplete label="Autorizado por" value={actionData.autorizadoPor || selectedItem.autorizadoPor || ''} onChange={v => setActionData({...actionData, autorizadoPor: v})} suggestions={suggestions.responsaveis} placeholder="NOME" required />
                </div>
              )}

              {(actionData.status || selectedItem.status) === 'Em Manutenção' && (
                <div className="space-y-4 p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                  <Autocomplete label="Técnico / Empresa" value={actionData.responsavelManutencao || selectedItem.responsavelManutencao || ''} onChange={v => setActionData({...actionData, responsavelManutencao: v})} suggestions={suggestions.responsaveis} placeholder="RESPONSÁVEL" required />
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest ml-1">Previsão</label>
                    <input type="date" value={actionData.previsaoRetorno || selectedItem.previsaoRetorno || ''} onChange={e => setActionData({...actionData, previsaoRetorno: e.target.value})} className="w-full bg-slate-950 border border-blue-500/30 rounded-xl px-4 py-3 text-sm text-white outline-none" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-800 flex justify-end gap-4 bg-slate-950/30">
              <button type="button" onClick={() => setModalMode('NONE')} className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors">Cancelar</button>
              <button type="submit" className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">Atualizar</button>
            </div>
          </form>
        </div>
      )}

      {modalMode === 'HISTORY' && selectedItem && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-3">
                <HistoryIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white uppercase">Cadeia de Custódia</h3>
              </div>
              <button onClick={() => setModalMode('NONE')} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStock.map(item => (
          <div key={item.id} className="group relative bg-[#0f172a] border border-slate-800 hover:border-indigo-500/40 rounded-[32px] p-6 transition-all duration-300 hover:shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                item.status === 'Em Estoque' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                item.status === 'Emprestado' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>{item.status}</div>
              <div className="flex items-center gap-1">
                 <button onClick={() => { setSelectedItem(item); setModalMode('EDIT'); setFormData(item); }} className="p-2 text-slate-600 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                 <button onClick={() => { setSelectedItem(item); setModalMode('HISTORY'); }} className="p-2 text-slate-600 hover:text-indigo-400 transition-colors"><HistoryIcon className="w-4 h-4" /></button>
                 <button onClick={() => onDeleteItem(item.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-white font-bold text-lg leading-tight truncate">{item.descricao}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-indigo-400 font-bold text-[10px] uppercase tracking-wider">{item.frequencia}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{item.tipo}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/50">
                 <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1"><Settings className="w-2.5 h-2.5" /> Serial</span>
                    <p className="text-xs font-mono font-bold text-slate-200">{item.serial}</p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1"><ClipboardList className="w-2.5 h-2.5" /> Qtd</span>
                    <p className="text-xs font-bold text-slate-200">{item.quantidade} UN</p>
                 </div>
              </div>

              <button 
                onClick={() => { setSelectedItem(item); setModalMode('ACTION'); setActionData({}); }}
                className="w-full py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-indigo-500/50 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all mt-4"
              >
                Movimentar / Ação
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default StockTab;
