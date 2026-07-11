import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './api/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import KomplainList from './pages/KomplainList';
import KomplainForm from './pages/KomplainForm';
import InsidenList from './pages/InsidenList';
import InsidenForm from './pages/InsidenForm';
import BORPage from './pages/BORPage';
import WaktuTungguPage from './pages/WaktuTungguPage';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen" style={{ color: 'var(--text-secondary)' }}>Memuat...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/komplain" element={<ProtectedRoute><KomplainList /></ProtectedRoute>} />
            <Route path="/komplain/new" element={<ProtectedRoute><KomplainForm /></ProtectedRoute>} />
            <Route path="/komplain/:id" element={<ProtectedRoute><KomplainForm /></ProtectedRoute>} />
            <Route path="/insiden" element={<ProtectedRoute><InsidenList /></ProtectedRoute>} />
            <Route path="/insiden/new" element={<ProtectedRoute><InsidenForm /></ProtectedRoute>} />
            <Route path="/insiden/:id" element={<ProtectedRoute><InsidenForm /></ProtectedRoute>} />
            <Route path="/bor" element={<ProtectedRoute><BORPage /></ProtectedRoute>} />
            <Route path="/waktu-tunggu" element={<ProtectedRoute><WaktuTungguPage /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
            <Route path="/users/new" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
            <Route path="/users/:id/edit" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;