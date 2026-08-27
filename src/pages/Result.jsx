import React, { useState, useMemo } from 'react';
import { Download, Search } from 'lucide-react';
import { useStock } from '../hooks/useStockOpname';

const Result = () => {
  const { inventory, handleExport } = useStock();

  const [filter, setFilter] = useState('SEMUA');
  const [search, setSearch] = useState('');

  const items = useMemo(() => Object.values(inventory), [inventory]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filter !== 'SEMUA' && item.status !== filter) {
        return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase().trim();

        const kode = String(item.kode || '').toLowerCase();
        const deskripsi = String(item.deskripsi || '').toLowerCase();

        if (!kode.includes(q) && !deskripsi.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [items, filter, search]);

  const filterOptions = [
    'SEMUA',
    'BELUM DIHITUNG',
    'SESUAI',
    'KURANG',
    'LEBIH',
  ];

  const getFilterLabel = (opt) => {
    if (opt === 'SEMUA') return 'Semua';
    if (opt === 'BELUM DIHITUNG') return 'Belum Dihitung';

    return opt.charAt(0) + opt.slice(1).toLowerCase();
  };

  return (
    <div className="result-page page-animate">

      {/* =========================
          HEADER
      ========================= */}
      <div className="result-header">
        <h1 className="result-title">
          Hasil Opname
        </h1>

        <button
          type="button"
          onClick={handleExport}
          className="result-export"
        >
          <Download size={16} strokeWidth={2.5} />
          <span>Export</span>
        </button>
      </div>

      {/* =========================
          SEARCH
      ========================= */}
      <div className="result-search">
        <Search
          size={19}
          color="var(--text-sec)"
          className="result-search-icon"
        />

        <input
          type="text"
          placeholder="Cari kode atau nama barang..."
          className="input-text result-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* =========================
          FILTER
      ========================= */}
      <div className="result-filter-wrapper">
        <div className="result-filter">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setFilter(opt)}
              className={`chip ${filter === opt ? 'active' : ''}`}
            >
              {getFilterLabel(opt)}
            </button>
          ))}
        </div>
      </div>

      {/* =========================
          LIST BARANG
      ========================= */}
      <div className="result-list">

        {filteredItems.length === 0 ? (
          <div className="result-empty">
            <p>
              Tidak ada barang yang sesuai kriteria.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.kode}
              className="glass-card result-card"
            >

              {/* Nama + Status */}
              <div className="result-card-top">

                <div className="result-product">
                  <p className="result-product-name">
                    {item.deskripsi}
                  </p>

                  <p className="result-product-code">
                    {item.kode}
                  </p>
                </div>

                <span
                  className={`badge ${item.status === 'SESUAI'
                      ? 'badge-sesuai'
                      : item.status === 'KURANG'
                        ? 'badge-kurang'
                        : item.status === 'LEBIH'
                          ? 'badge-lebih'
                          : 'badge-belum'
                    }`}
                >
                  {item.status}
                </span>

              </div>

              {/* Statistik */}
              <div className="result-stats">

                <div className="result-stat result-stat-left">
                  <p className="result-stat-label">
                    SISTEM
                  </p>

                  <p className="result-stat-value">
                    {item.stokSistem}
                  </p>
                </div>

                <div className="result-stat result-stat-center">
                  <p className="result-stat-label">
                    FISIK
                  </p>

                  <p className="result-stat-value">
                    {item.stokFisik}
                  </p>
                </div>

                <div className="result-stat result-stat-right">
                  <p className="result-stat-label">
                    SELISIH
                  </p>

                  <p
                    className="result-stat-value"
                    style={{
                      color:
                        item.selisih < 0
                          ? '#D93025'
                          : item.selisih > 0
                            ? '#1A73E8'
                            : '#1E8E3E',
                    }}
                  >
                    {item.selisih > 0
                      ? `+${item.selisih}`
                      : item.selisih}
                  </p>
                </div>

              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default Result;