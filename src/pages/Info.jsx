import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useStock } from '../hooks/useStockOpname';

const Info = () => {
  const { resetSession } = useStock();

  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua data opname saat ini? Data yang belum di-export akan hilang.")) {
      resetSession();
    }
  };

  return (
    <div>
      <h1 className="mb-6">Informasi Aplikasi</h1>

      <div className="glass-card mb-6 text-center">
        <h2 className="text-red" style={{ fontSize: '1.25rem', letterSpacing: '-0.5px' }}>SOM</h2>
        <p className="font-bold text-dark mb-1">Kartika Accessories Ponorogo</p>
        <p style={{ fontSize: '0.85rem' }}>By Hamida</p>
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '0.8rem' }}>Versi 1.0.0 (PWA)</p>
          <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Data tersimpan aman di browser perangkat ini secara lokal.</p>
        </div>
      </div>

      <div className="glass-card mb-6" style={{ borderColor: '#FCE8E6', backgroundColor: '#FFF3F3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <AlertTriangle color="#D93025" size={20} />
          <h3 style={{ color: '#D93025', fontSize: '1rem' }}>Mulai Opname Baru</h3>
        </div>
        <p style={{ fontSize: '0.85rem', marginBottom: '16px', color: '#555' }}>
          Tindakan ini akan menghapus semua progress hitungan saat ini dan mengosongkan data SOM. Pastikan Anda telah melakukan Export Excel sebelumnya.
        </p>
        <button 
          onClick={handleReset}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: 'white', 
            border: '1px solid #D93025', 
            color: '#D93025', 
            borderRadius: '12px',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Trash2 size={18} /> Hapus Data & Mulai Baru
        </button>
      </div>
    </div>
  );
};

export default Info;
