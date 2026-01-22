
import React from 'react';
import { Settings2, AlignVerticalJustifyStart, LineChart, Type, QrCode } from 'lucide-react';
import { LabelSettings } from '../types';

interface SettingsPanelProps {
  settings: LabelSettings;
  onChange: (field: keyof LabelSettings, value: number) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange }) => {
  return (
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
                onChange={(e) => onChange(setting.key as keyof LabelSettings, Number(e.target.value))}
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
                onChange={(e) => onChange(setting.key as keyof LabelSettings, Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 text-white rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-semibold"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
