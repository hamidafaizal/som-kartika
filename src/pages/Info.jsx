
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
    <div className="page-animate">
      <h1 className="page-title mb-6">Informasi Aplikasi</h1>

      <div className="glass-card mb-6 text-center" style={{ padding: '32px 20px' }}>
        <img 
          src="/logo.png" 
          alt="Logo SOM" 
          style={{ width: '80px', height: 'auto', marginBottom: '16px' }} 
        />
        <h2 className="title-main" style={{ fontSize: '24px' }}>SOM</h2>
        <p className="title-sub" style={{ fontSize: '16px' }}>Kartika Accessories Ponorogo</p>
        <p className="title-credit mb-4">By Hamida</p>
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--dark)' }}>Versi 2.0 (PWA UI/UX Edition)</p>
          <p style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-sec)', lineHeight: '1.5' }}>
            Data tersimpan aman di browser perangkat ini secara lokal menggunakan IndexedDB/localStorage.
          </p>
        </div>
      </div>

      <div className="glass-card mb-6" style={{ 
        border: '1px solid rgba(217, 48, 37, 0.2)', 
        backgroundColor: 'rgba(255, 243, 243, 0.7)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <AlertTriangle color="#D93025" size={22} strokeWidth={2.5} />
          <h3 style={{ color: '#D93025', fontSize: '1.05rem', fontWeight: '750' }}>Mulai Opname Baru</h3>
        </div>
        <p style={{ fontSize: '0.85rem', marginBottom: '20px', color: 'var(--text-sec)', lineHeight: '1.5' }}>
          Tindakan ini akan menghapus semua progress hitungan saat ini dan mengosongkan data SOM. Pastikan Anda telah melakukan Export Excel sebelumnya.
        </p>
        <button 
          onClick={handleReset}
          style={{ 
            width: '100%', padding: '14px', backgroundColor: '#FFF', 
            border: '1px solid rgba(217, 48, 37, 0.3)', color: '#D93025', 
            borderRadius: '16px', fontWeight: '700', fontSize: '0.95rem',
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(217, 48, 37, 0.05)',
            transition: 'transform 0.15s'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Trash2 size={18} strokeWidth={2.5} /> Hapus Data & Mulai Baru
        </button>
      </div>
    </div>
  );
};

export default Info;
