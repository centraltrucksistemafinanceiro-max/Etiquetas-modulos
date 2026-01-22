
import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';
import { HistoryItem, LabelData, LabelSettings } from '../types';
import { initialData, initialSettings } from '../constants/defaults';

export const useLabelStore = () => {
  // Local Form State
  const [data, setData] = useState<LabelData>(initialData);
  const [settings, setSettings] = useState<LabelSettings>(initialSettings);
  const [viewOnlyData, setViewOnlyData] = useState<LabelData | null>(null);
  
  // History State (Synced with Firebase)
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync History from Firebase
  useEffect(() => {
    const q = query(collection(db, 'label_history'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as HistoryItem[];
      setHistory(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Form Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingChange = (name: keyof LabelSettings, value: number) => {
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setData(initialData);
  };

  const loadFromHistory = (item: HistoryItem) => {
    const { id, timestamp, ...labelData } = item;
    setData(labelData);
  };

  // Firebase Actions
  const saveToHistory = async () => {
    try {
      const newItem = {
        ...data,
        timestamp: Date.now()
      };
      await addDoc(collection(db, 'label_history'), newItem);
    } catch (e) {
      console.error("Erro ao salvar etiqueta no Firebase:", e);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'label_history', id));
    } catch (e) {
      console.error("Erro ao deletar etiqueta do Firebase:", e);
    }
  };

  const clearHistory = async () => {
    if (confirm("Deseja realmente apagar todo o histórico de etiquetas do banco de dados?")) {
      try {
        // We have to delete each document individually in a loop or batch
        for (const item of history) {
          await deleteDoc(doc(db, 'label_history', item.id));
        }
      } catch (e) {
        console.error("Erro ao limpar histórico:", e);
      }
    }
  };

  return {
    data,
    settings,
    history,
    loading,
    viewOnlyData,
    handleInputChange,
    handleSettingChange,
    clearForm,
    saveToHistory,
    loadFromHistory,
    deleteHistoryItem,
    clearHistory
  };
};
