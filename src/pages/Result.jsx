import React, { useState, useMemo } from 'react';
import { Download, Search } from 'lucide-react';
import { useStock } from '../hooks/useStockOpname';

const Result = () => {
  const { inventory, handleExport, getStats } = useStock();
  const stats = getStats();
  
  const [filter, setFilter] = useState('SEMUA');
  const [search, setSearch] = useState('');

  const items = useMemo(() => Object.values(inventory), [inventory]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Apply Filter
      if (filter !== 'SEMUA') {
        if (item.status !== filter) return false;
      }
      
      // Apply Search
      if (search) {
        const q = search.toLowerCase();
        if (!item.kode.toLowerCase().includes(q) && !item.deskripsi.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [items, filter, search]);

  const filterOptions = ['SEMUA', 'BELUM DIHITUNG', 'SESUAI', 'KURANG', 'LEBIH'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="mb-4">
        <h1 style={{ fontSize: '1.25rem', marginBottom: 0 }}>Hasil Opname</h1>
        <button 
          onClick={handleExport}
          style={{ background: 'none', border: 'none', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <Download size={18} /> Export
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', msOverflowStyle: 'none', scrollbarWidth: 'none' }} className="mb-2 hide-scroll">
        {filterOptions.map(opt => (
          <button 
            key={opt}
            onClick={() => setFilter(opt)}
            style={{ 
              whiteSpace: 'nowrap',
              padding: '6px 12px', 
              borderRadius: '20px', 
              border: '1px solid var(--glass-border)',
              backgroundColor: filter === opt ? 'var(--dark)' : 'white',
              color: filter === opt ? 'white' : 'var(--text-sec)',
              fontWeight: '500',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            {opt === 'SEMUA' ? 'Semua' : opt === 'BELUM DIHITUNG' ? 'Belum Dihitung' : opt.charAt(0) + opt.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative' }} className="mb-6">
        <Search size={18} color="var(--text-sec)" style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Search kode / nama barang..." 
          className="input-text"
          style={{ paddingLeft: '38px', borderRadius: '12px' }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredItems.length === 0 ? (
          <div className="text-center py-6">
            <p>Tidak ada barang yang sesuai kriteria.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.kode} className="glass-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <p className="font-bold text-dark" style={{ flex: 1, paddingRight: '12px', lineHeight: '1.3', fontSize: '0.9rem' }}>{item.deskripsi}</p>
                <span className={`badge ${
                  item.status === 'SESUAI' ? 'badge-sesuai' : 
                  item.status === 'KURANG' ? 'badge-kurang' : 
                  item.status === 'LEBIH' ? 'badge-lebih' : 'badge-belum'
                }`}>
                  {item.status}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-sec)', marginBottom: '12px' }}>{item.kode}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                <div className="text-center" style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-sec)' }}>SISTEM</p>
                  <p className="font-bold">{item.stokSistem}</p>
                </div>
                <div className="text-center" style={{ flex: 1, borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-sec)' }}>FISIK</p>
                  <p className="font-bold text-dark">{item.stokFisik}</p>
                </div>
                <div className="text-center" style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-sec)' }}>SELISIH</p>
                  <p className={`font-bold ${item.selisih < 0 ? 'text-kurang' : item.selisih > 0 ? 'text-lebih' : 'text-sesuai'}`}>
                    {item.selisih > 0 ? `+${item.selisih}` : item.selisih}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Scroll Hiding CSS embed */}
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Result;
