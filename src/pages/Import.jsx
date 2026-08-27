
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
    setTimeout(async () => {
      await importFile(file);
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 100);
  };

  return (
    <div className="page-animate">
      <h1 className="page-title mb-1">Import File SOM</h1>
      <p className="page-desc mb-6">Masukkan file SOM untuk memulai stock opname.</p>

      <div 
        className="glass-card text-center mb-6"
        style={{ 
          border: '2px dashed rgba(229, 27, 35, 0.3)', 
          cursor: 'pointer',
          padding: '40px 20px',
          backgroundColor: 'rgba(255,255,255,0.4)',
          transition: 'background 0.2s'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud size={56} color="var(--red)" strokeWidth={1.5} style={{ margin: '0 auto', marginBottom: '16px' }} />
        <h3 className="mb-2" style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--dark)' }}>Masukkan file SOM</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-sec)' }}>Format .XLS, .XLSX atau CSV</p>
        
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />

        <div className="mt-6">
          <button className="btn-secondary" disabled={loading}>
            {loading ? 'Memproses...' : 'Pilih File'}
          </button>
        </div>
      </div>

      {fileName && (
        <div className="glass-card mb-6" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px' }}>
          <div style={{ background: 'rgba(30, 142, 62, 0.1)', padding: '10px', borderRadius: '14px' }}>
            <FileCheck size={28} color="#1E8E3E" />
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p className="font-bold text-dark" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem' }}>{fileName}</p>
            <p style={{ fontSize: '0.8rem', color: '#1E8E3E', marginTop: '4px', fontWeight: '600' }}>✓ {skuCount} SKU ditemukan</p>
          </div>
        </div>
      )}

      {!fileName && (
        <div className="glass-card mb-6" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', backgroundColor: 'rgba(217, 48, 37, 0.05)' }}>
           <AlertCircle size={24} color="#D93025" style={{ flexShrink: 0 }} />
           <p style={{ fontSize: '0.85rem', color: '#D93025', lineHeight: '1.4' }}>Belum ada file SOM yang di-import. Harap import file terlebih dahulu.</p>
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
