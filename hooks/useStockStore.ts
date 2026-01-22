
import { useState, useEffect } from 'react';
import { StockItem, StockHistory, StockConfig } from '../types';

const DEFAULT_CONFIG: StockConfig = {
  tipos: ['Motor', 'ABS', 'EBS', 'Retarder', 'Outros'],
  frequencias: ['40 MHz', '80 MHz', '120 MHz', 'Outra']
};

export const useStockStore = () => {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [config, setConfig] = useState<StockConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const savedStock = localStorage.getItem('label_stock_v2');
    if (savedStock) {
      try {
        setStock(JSON.parse(savedStock));
      } catch (e) {
        console.error("Erro ao carregar estoque:", e);
      }
    }

    const savedConfig = localStorage.getItem('label_stock_config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error("Erro ao carregar configurações de estoque:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('label_stock_v2', JSON.stringify(stock));
  }, [stock]);

  useEffect(() => {
    localStorage.setItem('label_stock_config', JSON.stringify(config));
  }, [config]);

  const addStockItem = (item: Omit<StockItem, 'id' | 'dataAtualizacao' | 'historico'>) => {
    const newItem: StockItem = {
      ...item,
      id: crypto.randomUUID(),
      dataAtualizacao: Date.now(),
      historico: [{
        statusAnterior: 'NOVO',
        statusNovo: item.status,
        data: Date.now(),
        detalhes: 'Item cadastrado no sistema'
      }]
    };
    setStock(prev => [...prev, newItem]);
  };

  const updateStatus = (id: string, newStatus: StockItem['status'], extras: Partial<StockItem>) => {
    setStock(prev => prev.map(item => {
      if (item.id === id) {
        const historyEntry: StockHistory = {
          statusAnterior: item.status,
          statusNovo: newStatus,
          data: Date.now(),
          responsavel: extras.autorizadoPor || extras.responsavelManutencao || 'Sistema',
          detalhes: extras.motivoManutencao || `Alteração de status para ${newStatus}`
        };

        return {
          ...item,
          ...extras,
          status: newStatus,
          historico: [historyEntry, ...item.historico],
          dataAtualizacao: Date.now()
        };
      }
      return item;
    }));
  };

  const deleteStockItem = (id: string) => {
    setStock(prev => prev.filter(item => item.id !== id));
  };

  const editStockItem = (id: string, updates: Partial<StockItem>) => {
    setStock(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, dataAtualizacao: Date.now() }
        : item
    ));
  };

  const addType = (type: string) => {
    if (!config.tipos.includes(type)) {
      setConfig(prev => ({ ...prev, tipos: [...prev.tipos, type] }));
    }
  };

  const addFrequency = (freq: string) => {
    if (!config.frequencias.includes(freq)) {
      setConfig(prev => ({ ...prev, frequencias: [...prev.frequencias, freq] }));
    }
  };

  return {
    stock,
    config,
    addStockItem,
    updateStatus,
    deleteStockItem,
    editStockItem,
    addType,
    addFrequency
  };
};
