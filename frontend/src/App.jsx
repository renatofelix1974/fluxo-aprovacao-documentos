import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadDocument from './pages/UploadDocument';
import DocumentStatus from './pages/DocumentStatus';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordForm from './pages/ResetPasswordForm'; // Importação da nova página

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadDocument />} />
        <Route path="/status" element={<DocumentStatus />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-form" element={<ResetPasswordForm />} /> {/* Nova rota */}
      </Routes>
    </Router>
  );
}

export default App;
