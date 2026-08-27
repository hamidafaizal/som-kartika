
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CameraOff, Keyboard } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useStock } from '../hooks/useStockOpname';

const Scan = () => {
  const navigate = useNavigate();
  const { skuCount, scanBarcode, lastScannedItem } = useStock();
  
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [manualInput, setManualInput] = useState('');
  const [isManualMode, setIsManualMode] = useState(false);
  
  const codeReader = useRef(new BrowserMultiFormatReader());
  const lastScanText = useRef('');
  const lastScanTime = useRef(0);

  useEffect(() => {
    if (skuCount === 0) {
      navigate('/import');
      return;
    }

    let isComponentMounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (!isComponentMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          if (result && isComponentMounted) {
            const text = result.getText();
            const now = Date.now();
            
            if (text === lastScanText.current && (now - lastScanTime.current) < 1500) return;
            
            lastScanText.current = text;
            lastScanTime.current = now;
            
            try { navigator.vibrate && navigator.vibrate(100); } catch(e){}
            
            scanBarcode(text);
          }
        });

      } catch (err) {
        console.error("Camera error:", err);
        if (isComponentMounted) setHasPermission(false);
      }
    };

    if (!isManualMode) startCamera();

    return () => {
      isComponentMounted = false;
      codeReader.current.reset();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, [skuCount, navigate, scanBarcode, isManualMode]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      scanBarcode(manualInput.trim());
      setManualInput('');
    }
  };

  if (skuCount === 0) return null;

  return (
    <div className="page-animate" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mb-4">
        <h1 className="page-title mb-1">Scan Barcode</h1>
      </div>

      {/* Camera / Scanner Area */}
      {!isManualMode && (
        <div style={{ 
          position: 'relative', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          backgroundColor: '#000', 
          height: 'clamp(280px, 45vh, 400px)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
        }}>
          {hasPermission === false ? (
            <div className="text-center text-white" style={{ padding: '20px' }}>
              <CameraOff size={48} strokeWidth={1.5} style={{ margin: '0 auto', marginBottom: '16px', opacity: 0.5 }} />
              <p className="mb-2 text-white">Kamera tidak tersedia atau akses ditolak.</p>
              <button className="btn-secondary mt-4" style={{ width: 'auto', display: 'inline-flex' }} onClick={() => setHasPermission(null)}>Coba Lagi</button>
            </div>
          ) : (
            <>
              <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay playsInline muted />
              
              {/* Minimal Scanner Overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }}></div>
              <div style={{ 
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                width: '75%', height: '140px', 
                border: '2px solid rgba(255,255,255,0.7)', borderRadius: '16px',
                boxShadow: '0 0 0 4000px rgba(0,0,0,0.4)' /* Darkens outside */
              }}>
                {/* Red Laser Line */}
                <div style={{ width: '100%', height: '2px', backgroundColor: 'var(--red)', position: 'absolute', top: '50%', boxShadow: '0 0 12px var(--red)' }}></div>
              </div>
              <div style={{ 
                position: 'absolute', bottom: '24px', width: '100%', textAlign: 'center', 
                color: 'white', fontSize: '0.85rem', fontWeight: '500', 
                textShadow: '0 2px 4px rgba(0,0,0,0.8)' 
              }}>
                <span style={{ background: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
                  Arahkan barcode ke kamera
                </span>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-4 text-center">
        <button 
          onClick={() => setIsManualMode(!isManualMode)} 
          style={{ 
            background: 'none', border: 'none', color: 'var(--red)', 
            fontWeight: '700', fontSize: '0.95rem', display: 'inline-flex', 
            alignItems: 'center', gap: '8px', cursor: 'pointer',
            padding: '8px 16px', borderRadius: '20px'
          }}
        >
          {isManualMode ? <Camera size={20} /> : <Keyboard size={20} />}
          {isManualMode ? 'Gunakan Kamera' : 'Input Barcode Manual'}
        </button>
      </div>

      {isManualMode && (
        <form onSubmit={handleManualSubmit} className="mt-4">
          <input 
            type="text" 
            className="input-text" 
            placeholder="Masukkan barcode lalu Enter..." 
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-primary mt-3">SCAN</button>
        </form>
      )}

      {/* Result Card - Compact & Glass */}
      {lastScannedItem && (
        <div className="glass-card mt-6 page-animate" style={{ borderLeft: '4px solid var(--red)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#1E8E3E', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>✓ Berhasil Discan</span>
            <span className={`badge ${
              lastScannedItem.status === 'SESUAI' ? 'badge-sesuai' : 
              lastScannedItem.status === 'KURANG' ? 'badge-kurang' : 'badge-lebih'
            }`}>
              {lastScannedItem.status} {lastScannedItem.selisih !== 0 && Math.abs(lastScannedItem.selisih)}
            </span>
          </div>
          
          <p className="font-bold text-dark" style={{ lineHeight: '1.3', fontSize: '1.05rem', marginBottom: '4px' }}>{lastScannedItem.deskripsi}</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-sec)', fontFamily: 'monospace' }}>{lastScannedItem.kode}</p>

          <div style={{ 
            display: 'flex', justifyContent: 'space-between', 
            marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)' 
          }}>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-sec)', fontWeight: '700', marginBottom: '4px' }}>Sistem</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--dark)' }}>{lastScannedItem.stokSistem}</p>
            </div>
            <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid rgba(0,0,0,0.06)', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-sec)', fontWeight: '700', marginBottom: '4px' }}>Fisik</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--red)' }}>{lastScannedItem.stokFisik}</p>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-sec)', fontWeight: '700', marginBottom: '4px' }}>Selisih</p>
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: lastScannedItem.selisih < 0 ? '#D93025' : lastScannedItem.selisih > 0 ? '#1A73E8' : '#1E8E3E' }}>
                {lastScannedItem.selisih > 0 ? `+${lastScannedItem.selisih}` : lastScannedItem.selisih}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scan;
