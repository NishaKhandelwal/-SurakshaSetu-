import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route goes to Login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* The Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* If they type a random URL, send them back to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;