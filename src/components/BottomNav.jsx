import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileDown, ScanBarcode, ClipboardList, Info } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Beranda' },
    { path: '/import', icon: <FileDown size={24} />, label: 'Import' },
    { path: '/scan', icon: <ScanBarcode size={28} />, label: 'Scan', isMain: true },
    { path: '/result', icon: <ClipboardList size={24} />, label: 'Hasil' },
    { path: '/info', icon: <Info size={24} />, label: 'Info' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'calc(70px + var(--safe-area-bottom))',
      paddingBottom: 'var(--safe-area-bottom)',
      background: 'var(--glass)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--glass-border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
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
            position: 'relative'
          })}
        >
          {({ isActive }) => (
            <>
              {item.isMain ? (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  backgroundColor: 'var(--red)',
                  color: 'white',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 4px 16px rgba(229, 27, 35, 0.4)',
                  border: '4px solid white'
                }}>
                  {item.icon}
                </div>
              ) : (
                <div style={{ marginBottom: '4px' }}>{item.icon}</div>
              )}
              
              {!item.isMain && (
                <span style={{ fontSize: '0.7rem', fontWeight: isActive ? '700' : '500' }}>
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
