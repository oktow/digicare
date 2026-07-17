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
    <div className="min-h-screen flex items-center justify-center relative" style={{ backgroundImage: 'url(/BG.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="p-8 rounded-2xl shadow-lg w-full max-w-md z-10" style={{ background: 'rgba(0,0,0,0.7)', borderColor: 'rgba(255,255,255,0.1)' }}>
        <h1 className="text-3xl font-bold text-center mb-2" style={{ color: '#93c5fd' }}>DIGI-CARE</h1>
        <p className="text-center text-sm mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>Dashboard Indikator & Grafik<br />Insiden Complain And Realtime Evaluation</p>
        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm border border-red-500/30">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg outline-none" style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg outline-none" style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }} required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        <div className="mt-6 text-center text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <p>Demo: admin / admin123</p>
          <p>petugas / petugas123</p>
          <p>viewer / viewer123</p>
        </div>
      </div>
    </div>
  );
}