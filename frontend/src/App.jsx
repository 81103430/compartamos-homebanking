import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AhorrosPage from './pages/AhorrosPage';
import CreditosPage from './pages/CreditosPage';
import TransferenciasPage from './pages/TransferenciasPage';
import PerfilPage from './pages/PerfilPage';
import PagosPage from './pages/PagosPage';
import SolicitudCreditoPage from './pages/SolicitudCreditoPage';
import BandejaPage from './pages/BandejaPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/ahorros" element={
          <ProtectedRoute><AhorrosPage /></ProtectedRoute>
        } />
        <Route path="/creditos" element={
          <ProtectedRoute><CreditosPage /></ProtectedRoute>
        } />
        <Route path="/transferencias" element={
          <ProtectedRoute><TransferenciasPage /></ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute><PerfilPage /></ProtectedRoute>
        } />
        <Route path="/pagos" element={
          <ProtectedRoute><PagosPage /></ProtectedRoute>
        } />
        <Route path="/solicitud-credito" element={
          <ProtectedRoute><SolicitudCreditoPage /></ProtectedRoute>
        } />
        <Route path="/bandeja" element={
          <ProtectedRoute><BandejaPage /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}