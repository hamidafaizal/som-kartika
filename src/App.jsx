import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Import from './pages/Import';
import Scan from './pages/Scan';
import Result from './pages/Result';
import Info from './pages/Info';
import { StockProvider } from './hooks/useStockOpname';
import Toast from './components/Toast';

function App() {
  return (
    <StockProvider>
      <div className="app-container">
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/import" element={<Import />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/result" element={<Result />} />
            <Route path="/info" element={<Info />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <BottomNav />
        <Toast />
      </div>
    </StockProvider>
  );
}

export default App;
