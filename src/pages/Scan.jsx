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
            
            // Anti double scan: 1.5s cooldown for same barcode
            if (text === lastScanText.current && (now - lastScanTime.current) < 1500) {
              return;
            }
            
            lastScanText.current = text;
            lastScanTime.current = now;
            
            // Beep sound
            try { navigator.vibrate && navigator.vibrate(100); } catch(e){}
            
            scanBarcode(text);
          }
        });

      } catch (err) {
        console.error("Camera error:", err);
        if (isComponentMounted) {
          setHasPermission(false);
        }
      }
    };

    if (!isManualMode) {
      startCamera();
    }

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="mb-4">
        <h1 style={{ fontSize: '1.25rem' }}>Scan Barcode</h1>
      </div>

      {!isManualMode && (
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'var(--dark)', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {hasPermission === false ? (
            <div className="text-center text-white" style={{ padding: '20px' }}>
              <CameraOff size={48} style={{ margin: '0 auto', marginBottom: '16px', opacity: 0.5 }} />
              <p className="mb-2 text-white">Kamera tidak tersedia atau akses ditolak.</p>
              <button className="btn-primary mt-4" style={{ width: 'auto', display: 'inline-block' }} onClick={() => setHasPermission(null)}>Coba Lagi</button>
            </div>
          ) : (
            <>
              <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay playsInline muted />
              
              {/* Scanner Overlay */}
              <div style={{ position: 'absolute', inset: 0, border: '40px solid rgba(0,0,0,0.5)' }}></div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '120px', border: '2px solid var(--red)', borderRadius: '12px' }}>
                <div style={{ width: '100%', height: '2px', backgroundColor: 'var(--red)', position: 'absolute', top: '50%', boxShadow: '0 0 8px var(--red)' }}></div>
              </div>
              <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', color: 'white', fontSize: '0.85rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                Arahkan barcode ke kamera
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-4 text-center">
        <button 
          onClick={() => setIsManualMode(!isManualMode)} 
          style={{ background: 'none', border: 'none', color: 'var(--red)', fontWeight: 'bold', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          {isManualMode ? <Camera size={18} /> : <Keyboard size={18} />}
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
          <button type="submit" className="btn-primary mt-2">SCAN</button>
        </form>
      )}

      {/* Result Card */}
      {lastScannedItem && (
        <div className="glass-card mt-6" style={{ borderLeft: '4px solid var(--red)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#1E8E3E', fontWeight: 'bold' }}>✓ Barang ditemukan</span>
            <span className={`badge ${
              lastScannedItem.status === 'SESUAI' ? 'badge-sesuai' : 
              lastScannedItem.status === 'KURANG' ? 'badge-kurang' : 'badge-lebih'
            }`}>
              {lastScannedItem.status} {lastScannedItem.selisih !== 0 && Math.abs(lastScannedItem.selisih)}
            </span>
          </div>
          <p className="font-bold text-dark" style={{ lineHeight: '1.2' }}>{lastScannedItem.deskripsi}</p>
          <p style={{ fontSize: '0.85rem', marginBottom: '12px', fontFamily: 'monospace' }}>{lastScannedItem.kode}</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '8px', color: 'var(--text-sec)', fontWeight: '500' }}>Sistem</th>
                <th style={{ padding: '8px', color: 'var(--text-sec)', fontWeight: '500' }}>Fisik</th>
                <th style={{ padding: '8px', color: 'var(--text-sec)', fontWeight: '500' }}>Selisih</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>{lastScannedItem.stokSistem}</td>
                <td style={{ padding: '8px', fontWeight: 'bold', color: 'var(--red)' }}>{lastScannedItem.stokFisik}</td>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>
                  {lastScannedItem.selisih > 0 ? `+${lastScannedItem.selisih}` : lastScannedItem.selisih}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Scan;
