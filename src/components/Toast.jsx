import React from 'react';
import { useStock } from '../hooks/useStockOpname';

const Toast = () => {
  const { toastConfig } = useStock();
  
  if (!toastConfig.show) return null;

  const bg = toastConfig.type === 'error' ? '#D93025' : toastConfig.type === 'success' ? '#1E8E3E' : '#17181D';

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: bg,
      color: 'white',
      padding: '12px 24px',
      borderRadius: '30px',
      zIndex: 9999,
      fontWeight: '500',
      fontSize: '0.9rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease'
    }}>
      {toastConfig.message}
    </div>
  );
};

export default Toast;
