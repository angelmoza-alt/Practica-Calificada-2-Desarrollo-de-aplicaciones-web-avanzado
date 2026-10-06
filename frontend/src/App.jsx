import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Laboratorios from './pages/Laboratorios';
import Medicamentos from './pages/Medicamentos';
import PanelModerador from './pages/PanelModerador';
import Usuarios from './pages/Usuarios';
import { NoAutorizado, NotFound } from './pages/Misc';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/menu' : '/login'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Rutas para cualquier usuario logueado */}
        <Route path="/menu" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/medicamentos" element={<ProtectedRoute><Medicamentos /></ProtectedRoute>} />
        <Route path="/laboratorios" element={<ProtectedRoute><Laboratorios /></ProtectedRoute>} />

        {/* Moderador o admin */}
        <Route path="/moderador" element={<ProtectedRoute roles={['ROLE_MODERATOR', 'ROLE_ADMIN']}><PanelModerador /></ProtectedRoute>} />

        {/* Solo admin */}
        <Route path="/admin/usuarios" element={<ProtectedRoute roles={['ROLE_ADMIN']}><Usuarios /></ProtectedRoute>} />

        <Route path="/no-autorizado" element={<NoAutorizado />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
