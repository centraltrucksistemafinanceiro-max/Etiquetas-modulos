
import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { StockItem, StockHistory, StockConfig } from '../types';

const DEFAULT_CONFIG: StockConfig = {
  tipos: ['Motor', 'ABS', 'EBS', 'Retarder', 'Outros'],
  frequencias: ['Sem Frequência', '40 MHz', '80 MHz', '120 MHz', 'Outra']
};

export const useStockStore = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [config, setConfig] = useState<StockConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  // Sync Stock from Firebase
  useEffect(() => {
    const q = query(collection(db, 'stock'), orderBy('dataAtualizacao', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as StockItem[];
      setStock(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync Config from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'stockConfig'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(docSnap.data() as StockConfig);
      } else {
        // Initialize config in Firebase if it doesn't exist
        setDoc(doc(db, 'settings', 'stockConfig'), DEFAULT_CONFIG);
      }
    });

    return () => unsubscribe();
  }, []);

  const addStockItem = async (item: Omit<StockItem, 'id' | 'dataAtualizacao' | 'historico'>) => {
    try {
      const newItem = {
        ...item,
        dataAtualizacao: Date.now(),
        historico: [{
          statusAnterior: 'NOVO',
          statusNovo: item.status,
          data: Date.now(),
          detalhes: 'Item cadastrado no sistema'
        }]
      };
      await addDoc(collection(db, 'stock'), newItem);
    } catch (e) {
      console.error("Erro ao adicionar item:", e);
      alert("Erro ao salvar no Firebase. Verifique sua conexão.");
    }
  };

  const updateStatus = async (id: string, newStatus: StockItem['status'], extras: Partial<StockItem>) => {
    try {
      const item = stock.find(s => s.id === id);
      if (!item) return;

      const historyEntry: StockHistory = {
        statusAnterior: item.status,
        statusNovo: newStatus,
        data: Date.now(),
        responsavel: extras.autorizadoPor || extras.responsavelManutencao || 'Sistema',
        detalhes: extras.motivoManutencao || `Alteração de status para ${newStatus}`
      };

      const itemRef = doc(db, 'stock', id);
      await updateDoc(itemRef, {
        ...extras,
        status: newStatus,
        historico: [historyEntry, ...item.historico],
        dataAtualizacao: Date.now()
      });
    } catch (e) {
      console.error("Erro ao atualizar status:", e);
    }
  };

  const deleteStockItem = async (id: string) => {
    try {
      if (confirm("Tem certeza que deseja excluir permanentemente este item do banco de dados?")) {
        await deleteDoc(doc(db, 'stock', id));
      }
    } catch (e) {
      console.error("Erro ao deletar item:", e);
    }
  };

  const editStockItem = async (id: string, updates: Partial<StockItem>) => {
    try {
      const itemRef = doc(db, 'stock', id);
      await updateDoc(itemRef, {
        ...updates,
        dataAtualizacao: Date.now()
      });
    } catch (e) {
      console.error("Erro ao editar item:", e);
    }
  };

  const addType = async (type: string) => {
    if (!config.tipos.includes(type)) {
      const newConfig = { ...config, tipos: [...config.tipos, type] };
      await setDoc(doc(db, 'settings', 'stockConfig'), newConfig);
    }
  };

  const addFrequency = async (freq: string) => {
    if (!config.frequencias.includes(freq)) {
      const newConfig = { ...config, frequencias: [...config.frequencias, freq] };
      await setDoc(doc(db, 'settings', 'stockConfig'), newConfig);
    }
  };

  return {
    stock,
    config,
    loading,
    addStockItem,
    updateStatus,
    deleteStockItem,
    editStockItem,
    addType,
    addFrequency
  };
};
