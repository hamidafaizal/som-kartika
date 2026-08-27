
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStock } from '../hooks/useStockOpname';

const Home = () => {
  const navigate = useNavigate();
  const { skuCount, getStats } = useStock();
  const stats = getStats();

  return (
    <div className="page-animate" style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>

      {/* Header */}
      <div className="mb-6" style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%' }}>
        <img
          src="/logo.png"
          alt="Logo Stock Opname Mandiri"
          style={{ width: 'clamp(56px, 16vw, 72px)', height: 'auto', flexShrink: 0 }}
        />
        <div>
          <h1 className="title-main" style={{ fontSize: 'clamp(19px, 5.5vw, 23px)' }}>Stock Opname Mandiri</h1>
          <h2 className="title-sub" style={{ fontSize: 'clamp(13px, 4vw, 15px)', marginTop: '3px' }}>Kartika Accessories Ponorogo</h2>
          <p className="title-credit" style={{ marginTop: '2px' }}>By Hamida</p>
        </div>
      </div>

      <button className="btn-primary mb-6" onClick={() => navigate(skuCount > 0 ? '/scan' : '/import')}>
        Mulai Opname &rarr;
      </button>

      {/* Glass Summary Section */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 className="mb-4" style={{ fontSize: '1.05rem', fontWeight: '750', color: 'var(--dark)' }}>Ringkasan Opname</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 16px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', color: 'var(--text-sec)', marginBottom: '4px' }}>TOTAL SKU</p>
            <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--dark)', lineHeight: '1.1' }}>{stats.total}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', color: 'var(--text-sec)', marginBottom: '4px' }}>SUDAH DIHITUNG</p>
            <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--dark)', lineHeight: '1.1' }}>{stats.dihitung}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', color: 'var(--text-sec)', marginBottom: '4px' }}>SESUAI</p>
            <p style={{ fontSize: '28px', fontWeight: '800', color: '#1E8E3E', lineHeight: '1.1' }}>{stats.sesuai}</p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', color: 'var(--text-sec)', marginBottom: '4px' }}>SELISIH</p>
            <p style={{ fontSize: '28px', fontWeight: '800', color: '#D93025', lineHeight: '1.1' }}>{stats.selisih}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
