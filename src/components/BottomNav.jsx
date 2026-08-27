
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileDown, ScanBarcode, ClipboardList, Info } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { path: '/', icon: <Home size={22} strokeWidth={2.5} />, label: 'Beranda' },
    { path: '/import', icon: <FileDown size={22} strokeWidth={2.5} />, label: 'Import' },
    { path: '/scan', icon: <ScanBarcode size={26} strokeWidth={2.5} />, label: 'Scan', isMain: true },
    { path: '/result', icon: <ClipboardList size={22} strokeWidth={2.5} />, label: 'Hasil' },
    { path: '/info', icon: <Info size={22} strokeWidth={2.5} />, label: 'Info' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(16px + var(--safe-area-bottom))',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: '430px', 
      height: '68px',
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.9)',
      borderRadius: '26px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
      padding: '0 8px'
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
            justifyContent: 'center',
            color: isActive ? 'var(--red)' : '#999999',
            position: 'relative',
            width: '60px',
            height: '100%',
            WebkitTapHighlightColor: 'transparent'
          })}
        >
          {({ isActive }) => (
            <>
              {item.isMain ? (
                <div style={{
                  position: 'absolute',
                  top: '-20px', /* Floating above the nav */
                  left: '50%',
                  transform: isActive ? 'translateX(-50%) scale(0.95)' : 'translateX(-50%) scale(1)',
                  backgroundColor: 'var(--red)',
                  color: 'white',
                  width: '58px',
                  height: '58px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 10px 24px rgba(229, 27, 35, 0.35)',
                  border: '4px solid rgba(255,255,255,0.8)',
                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  {item.icon}
                </div>
              ) : (
                <div style={{ 
                  marginBottom: '4px', 
                  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)', 
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  opacity: isActive ? 1 : 0.8
                }}>
                  {item.icon}
                </div>
              )}
              
              {!item.isMain && (
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: isActive ? '700' : '500', 
                  transition: 'color 0.2s' 
                }}>
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
