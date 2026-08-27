import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStock } from '../hooks/useStockOpname';

const Home = () => {
  const navigate = useNavigate();
  const { skuCount, getStats } = useStock();
  const stats = getStats();

  return (
    <div className="page-animate">
      <div className="text-center mb-6">
        <h1 className="text-red" style={{ letterSpacing: '-0.5px' }}>SOM</h1>
        <p className="font-bold" style={{ color: 'var(--dark)' }}>Kartika Accessories Ponorogo</p>
        <p style={{ fontSize: '0.8rem' }}>By Hamida</p>
      </div>

      <div className="mt-6 mb-6">
        <h2 style={{ fontSize: '1.8rem', lineHeight: '1.2', marginBottom: '8px' }}>
          Siap melakukan<br/>penghitungan stok?
        </h2>
        <p>Import data SOM, lalu scan barang fisik. Jumlah akan dihitung otomatis.</p>
      </div>

      <button className="btn-primary mb-6" onClick={() => navigate(skuCount > 0 ? '/scan' : '/import')}>
        Mulai Opname &rarr;
      </button>

      <div className="glass-card">
        <h3 className="mb-4" style={{ fontSize: '1rem' }}>Ringkasan Opname</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Total SKU</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--dark)' }}>{stats.total}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Sudah Dihitung</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--dark)' }}>{stats.dihitung}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Sesuai</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1E8E3E' }}>{stats.sesuai}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Selisih</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#D93025' }}>{stats.selisih}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
