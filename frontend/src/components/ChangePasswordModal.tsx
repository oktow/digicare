import { useState } from 'react';
import { authAPI } from '../api/client';

interface Props {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: Props) {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.new_password !== form.confirm_password) {
      setError('Konfirmasi password tidak cocok');
      return;
    }
    if (form.new_password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    setLoading(true);
    try {
      await authAPI.changePassword({ current_password: form.current_password, new_password: form.new_password });
      alert('Password berhasil diubah');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Gagal mengubah password');
    }
    finally { setLoading(false); }
  };

  const inputStyle = { background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' } as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm p-6 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Ubah Password</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Password Saat Ini</label>
            <input type="password" name="current_password" value={form.current_password} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Password Baru</label>
            <input type="password" name="new_password" value={form.new_password} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Konfirmasi Password Baru</label>
            <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: '#2563eb' }}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
}