import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileCheck, AlertCircle } from 'lucide-react';
import { useStock } from '../hooks/useStockOpname';

const Import = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { importFile, fileName, skuCount } = useStock();
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    // slight delay to allow UI to show loading state if large file
    setTimeout(async () => {
      await importFile(file);
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 100);
  };

  return (
    <div>
      <h1 className="mb-2">Import File SOM</h1>
      <p className="mb-6">Masukkan file SOM untuk memulai stock opname.</p>

      <div 
        className="glass-card text-center mb-6"
        style={{ border: '2px dashed var(--glass-border)', cursor: 'pointer' }}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud size={48} color="var(--red)" style={{ margin: '0 auto', marginBottom: '16px' }} />
        <h3 className="mb-2">Masukkan file SOM</h3>
        <p style={{ fontSize: '0.85rem' }}>Format .XLS, .XLSX atau CSV</p>
        
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />

        <div className="mt-4">
          <button className="btn-secondary" style={{ padding: '10px' }} disabled={loading}>
            {loading ? 'Memproses...' : 'Pilih File'}
          </button>
        </div>
      </div>

      {fileName && (
        <div className="glass-card mb-6" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileCheck size={32} color="#1E8E3E" />
          <div>
            <p className="font-bold text-dark" style={{ wordBreak: 'break-all' }}>{fileName}</p>
            <p style={{ fontSize: '0.85rem', color: '#1E8E3E' }}>✓ File berhasil dibaca ({skuCount} SKU)</p>
          </div>
        </div>
      )}

      {!fileName && (
        <div className="glass-card mb-6" style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#FFF3F3' }}>
           <AlertCircle size={24} color="#D93025" />
           <p style={{ fontSize: '0.85rem', color: '#D93025' }}>Belum ada file SOM yang di-import. Harap import file terlebih dahulu.</p>
        </div>
      )}

      <button 
        className="btn-primary" 
        disabled={!fileName || skuCount === 0}
        onClick={() => navigate('/scan')}
      >
        Lanjut ke Scan &rarr;
      </button>
    </div>
  );
};

export default Import;
