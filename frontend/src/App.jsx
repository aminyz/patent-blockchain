import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <ParticleBackground />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;