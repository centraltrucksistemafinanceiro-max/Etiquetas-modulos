
import React from 'react';
import { 
  User, 
  Hash, 
  Car, 
  Truck, 
  Calendar, 
  MessageSquare,
  Search,
  Package,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { LabelData, StockItem } from '../types';

interface FormProps {
  data: LabelData;
  stock: StockItem[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectModule: (item: StockItem) => void;
}

const FormComponent: React.FC<FormProps> = ({ data, stock, onChange, onSelectModule }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showResults, setShowResults] = React.useState(false);

  const filteredStock = React.useMemo(() => {
    if (!searchTerm) return [];
    return stock.filter(item => 
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, stock]);

  const selectedModule = React.useMemo(() => {
    return stock.find(s => s.id === data.stockItemId);
  }, [stock, data.stockItemId]);

  const fields: { id: keyof LabelData; label: string; type: string; placeholder: string; icon: any }[] = [
    { id: 'cliente', label: 'Nome do Cliente', type: 'text', placeholder: 'Ex: João Carlos da Silva', icon: User },
    { id: 'os', label: 'O.S / Protocolo', type: 'text', placeholder: 'Ex: 44290', icon: Hash },
    { id: 'placa', label: 'Placa Veicular', type: 'text', placeholder: 'Ex: ABC-1234', icon: Car },
    { id: 'frota', label: 'Número da Frota', type: 'text', placeholder: 'Ex: Unidade 01', icon: Truck },
    { id: 'data', label: 'Data do Serviço', type: 'date', placeholder: '', icon: Calendar },
  ];

  return (
    <div className="space-y-8">
      {/* VINCULAÇÃO COM ESTOQUE */}
      <div className="space-y-4">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
          1. Vincular Módulo do Estoque (Obrigatório)
        </label>
        
        {selectedModule ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between group animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white uppercase">{selectedModule.descricao}</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">SERIAL: {selectedModule.serial}</span>
              </div>
            </div>
            <button 
              onClick={() => onSelectModule({ id: '' } as any)} 
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-slate-400 hover:text-white hover:bg-slate-800 transition-all uppercase tracking-widest"
            >
              Trocar Módulo
            </button>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Pesquisar módulo por Nome ou Serial..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="w-full pl-11 pr-4 py-4 text-sm bg-slate-950 border-2 border-dashed border-slate-800 rounded-[18px] outline-none focus:border-indigo-500/50 transition-all font-medium text-white placeholder:text-slate-700"
            />
            {showResults && filteredStock.length > 0 && (
              <div className="absolute top-[110%] left-0 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {filteredStock.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectModule(item);
                      setSearchTerm('');
                      setShowResults(false);
                    }}
                    className="w-full p-4 flex items-center gap-4 hover:bg-slate-850 text-left border-b border-slate-800/50 last:border-0 transition-colors"
                  >
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white uppercase">{item.descricao}</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase flex gap-4">
                        <span>SN: {item.serial}</span>
                        <span>•</span>
                        <span>Status: {item.status}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {!selectedModule && searchTerm === '' && (
              <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">Vincule um módulo antes de imprimir</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="h-px bg-slate-800/50 w-full"></div>

      {/* DADOS DA ETIQUETA */}
      <div className="space-y-6">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
          2. Detalhes do Serviço
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {fields.map((field) => (
            <div key={field.id} className={field.id === 'cliente' ? 'md:col-span-2' : ''}>
              <label htmlFor={field.id} className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                {field.label}
              </label>
              <div className="group relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <field.icon className="w-4 h-4" />
                </div>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={data[field.id] as string}
                  onChange={onChange}
                  className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950 border border-slate-800 rounded-[14px] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium text-white placeholder:text-slate-700 uppercase"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-2">
          <label htmlFor="observacao" className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2 ml-1">
            Observações Detalhadas
          </label>
          <div className="group relative">
            <div className="absolute left-3.5 top-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
              <MessageSquare className="w-4 h-4" />
            </div>
            <textarea
              id="observacao"
              name="observacao"
              placeholder="Pressione ENTER para pular linhas..."
              value={data.observacao}
              onChange={onChange}
              className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950 border border-slate-800 rounded-[14px] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium text-white placeholder:text-slate-700 h-28 resize-none uppercase"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormComponent;
