import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileDown, ScanBarcode, ClipboardList, Info } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { path: '/', icon: <Home size={22} />, label: 'Beranda' },
    { path: '/import', icon: <FileDown size={22} />, label: 'Import' },
    { path: '/scan', icon: <ScanBarcode size={26} />, label: 'Scan', isMain: true },
    { path: '/result', icon: <ClipboardList size={22} />, label: 'Hasil' },
    { path: '/info', icon: <Info size={22} />, label: 'Info' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px', /* Selalu ikuti batas ukuran HP */
      height: 'calc(70px + var(--safe-area-bottom))',
      paddingBottom: 'var(--safe-area-bottom)',
      background: 'var(--glass)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop: '1px solid var(--glass-border)',
      borderLeft: '1px solid transparent',
      borderRight: '1px solid transparent',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
      boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.02)'
    }}>
      {navItems.map((item, idx) => (
        <NavLink
          key={idx}
          to={item.path}
          style={({ isActive }) => ({
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: isActive ? 'var(--red)' : 'var(--text-sec)',
            position: 'relative',
            width: '60px',
            WebkitTapHighlightColor: 'transparent'
          })}
        >
          {({ isActive }) => (
            <>
              {item.isMain ? (
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  backgroundColor: 'var(--red)',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 8px 20px rgba(229, 27, 35, 0.35)',
                  border: '3px solid rgba(255,255,255,0.9)',
                  transition: 'transform 0.2s'
                }}>
                  {item.icon}
                </div>
              ) : (
                <div style={{ marginBottom: '4px', transition: 'transform 0.2s', transform: isActive ? 'scale(1.1)' : 'scale(1)' }}>
                  {item.icon}
                </div>
              )}

              {!item.isMain && (
                <span style={{ fontSize: '0.65rem', fontWeight: isActive ? '700' : '500', transition: 'color 0.2s' }}>
                  {item.label}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;