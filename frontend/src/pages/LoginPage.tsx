import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="p-8 rounded-2xl shadow-lg w-full max-w-md" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#2563eb' }}>DIGI-CARE</h1>
        <p className="text-center text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>Dashboard Indikator & Grafik<br />Insiden Complain And Realtime Evaluation</p>
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg outline-none" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg outline-none" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        <div className="mt-6 text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
          <p>Demo: admin / admin123</p>
          <p>petugas / petugas123</p>
          <p>viewer / viewer123</p>
        </div>
      </div>
    </div>
  );
}