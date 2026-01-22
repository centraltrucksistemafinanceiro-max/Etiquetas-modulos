
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
import { HistoryItem, LabelData } from '../types';

export const useLabelStore = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync Labels from Firebase
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

  const addToHistory = async (data: LabelData) => {
    try {
      const newItem = {
        ...data,
        timestamp: Date.now()
      };
      await addDoc(collection(db, 'label_history'), newItem);
    } catch (e) {
      console.error("Erro ao salvar etiqueta:", e);
    }
  };

  const deleteFromHistory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'label_history', id));
    } catch (e) {
      console.error("Erro ao deletar etiqueta:", e);
    }
  };

  const clearHistory = async () => {
    // Note: Firestore doesn't provide a single 'clear' call for collections. 
    // You have to delete each document.
    if (confirm("Deseja realmente apagar todo o histórico de etiquetas do banco de dados?")) {
      try {
        history.forEach(async (item) => {
          await deleteDoc(doc(db, 'label_history', item.id));
        });
      } catch (e) {
        console.error("Erro ao limpar histórico:", e);
      }
    }
  };

  return {
    history,
    loading,
    addToHistory,
    deleteFromHistory,
    clearHistory
  };
};
