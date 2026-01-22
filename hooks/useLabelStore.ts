
import { useState, useEffect } from 'react';
import { LabelData, LabelSettings, HistoryItem } from '../types';
import { initialData, initialSettings } from '../constants/defaults';

export const useLabelStore = () => {
  const [data, setData] = useState<LabelData>(initialData);
  const [settings, setSettings] = useState<LabelSettings>(initialSettings);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [viewOnlyData, setViewOnlyData] = useState<LabelData | null>(null);

  useEffect(() => {
    // Load data from URL
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

    // Load from LocalStorage
    const savedHistory = localStorage.getItem('label_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
    const savedSettings = localStorage.getItem('label_settings');
    if (savedSettings) {
      try { 
        const parsed = JSON.parse(savedSettings);
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

  const loadFromHistory = (item: HistoryItem) => {
    const { id, timestamp, ...rest } = item;
    setData(rest);
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return {
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
  };
};
