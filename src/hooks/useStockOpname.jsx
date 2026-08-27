import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadSession, saveSession, clearSession } from '../utils/storage';
import { readSomFile, exportToExcel } from '../utils/excel';

const StockContext = createContext(null);

export const StockProvider = ({ children }) => {
  const [inventory, setInventory] = useState({});
  const [fileName, setFileName] = useState('');
  const [skuCount, setSkuCount] = useState(0);
  const [toastConfig, setToastConfig] = useState({ show: false, message: '', type: 'info' });
  const [lastScannedItem, setLastScannedItem] = useState(null);

  // Load on mount
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setInventory(saved.inventory || {});
      setFileName(saved.fileName || '');
      setSkuCount(saved.skuCount || 0);
    }
  }, []);

  // Save on change
  useEffect(() => {
    if (Object.keys(inventory).length > 0) {
      saveSession({ inventory, fileName, skuCount });
    }
  }, [inventory, fileName, skuCount]);

  const showToast = (message, type = 'info') => {
    setToastConfig({ show: true, message, type });
    setTimeout(() => {
      setToastConfig(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const importFile = async (file) => {
    try {
      const result = await readSomFile(file);
      setInventory(result.data);
      setFileName(result.filename);
      setSkuCount(result.count);
      showToast('File berhasil diimport!', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Gagal import file', 'error');
      return false;
    }
  };

  const scanBarcode = useCallback((barcode) => {
    setInventory(prev => {
      const code = String(barcode).trim();
      const item = prev[code];
      
      if (!item) {
        showToast(`Barang tidak ditemukan: ${code}`, 'error');
        return prev;
      }

      const newFisik = item.stokFisik + 1;
      const newSelisih = newFisik - item.stokSistem;
      let newStatus = 'SESUAI';
      if (newSelisih < 0) newStatus = 'KURANG';
      if (newSelisih > 0) newStatus = 'LEBIH';

      const updatedItem = {
        ...item,
        stokFisik: newFisik,
        selisih: newSelisih,
        status: newStatus
      };

      setLastScannedItem(updatedItem);
      
      return {
        ...prev,
        [code]: updatedItem
      };
    });
  }, []);

  const getStats = () => {
    const items = Object.values(inventory);
    const total = items.length;
    const dihitung = items.filter(i => i.status !== 'BELUM DIHITUNG').length;
    const sesuai = items.filter(i => i.status === 'SESUAI').length;
    const selisih = items.filter(i => i.selisih !== 0 && i.status !== 'BELUM DIHITUNG').length;
    
    return { total, dihitung, sesuai, selisih };
  };

  const resetSession = () => {
    setInventory({});
    setFileName('');
    setSkuCount(0);
    setLastScannedItem(null);
    clearSession();
    showToast('Session direset', 'success');
  };

  const handleExport = () => {
    if (Object.keys(inventory).length === 0) {
      showToast('Tidak ada data untuk diexport', 'error');
      return;
    }
    exportToExcel(inventory);
    showToast('Export berhasil!', 'success');
  };

  return (
    <StockContext.Provider value={{
      inventory, fileName, skuCount, lastScannedItem,
      importFile, scanBarcode, getStats, resetSession, handleExport,
      toastConfig
    }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext);
