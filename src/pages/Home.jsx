import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStock } from '../hooks/useStockOpname';

const Home = () => {
  const navigate = useNavigate();
  const { skuCount, getStats } = useStock();
  const stats = getStats();

  return (
    <div className="page-animate">
      <div className="text-center mb-6 mt-4">
        <img
          src="/logo.png"
          alt="Logo SOM"
          style={{ width: '120px', height: 'auto', marginBottom: '16px' }}
        />
        <h1 className="text-red" style={{ letterSpacing: '-0.5px' }}>SOM</h1>
        <p className="font-bold" style={{ color: 'var(--dark)' }}>Kartika Accessories Ponorogo</p>
        <p style={{ fontSize: '0.8rem' }}>By Hamida</p>
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