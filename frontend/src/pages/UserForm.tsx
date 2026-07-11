import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';

const ALL_MODULES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'komplain', label: 'Komplain' },
  { key: 'insiden', label: 'Insiden' },
  { key: 'bor', label: 'BOR' },
  { key: 'waktu_tunggu', label: 'Waktu Tunggu' },
  { key: 'users', label: 'Manajemen User' },
];

const DEFAULT_MODULES: Record<string, string[]> = {
  admin: ['dashboard', 'komplain', 'insiden', 'bor', 'waktu_tunggu', 'users'],
  petugas: ['dashboard', 'komplain', 'insiden', 'bor', 'waktu_tunggu'],
  viewer: ['dashboard'],
};

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    full_name: '',
    password: '',
    role: 'petugas',
  });
  const [modules, setModules] = useState<string[]>(DEFAULT_MODULES.petugas);

  useEffect(() => {
    if (isEdit) {
      authAPI.getUser(Number(id)).then((res) => {
        const d = res.data;
        setForm({ username: d.username, full_name: d.full_name, role: d.role, password: '' });
        setModules(d.modules ?? DEFAULT_MODULES[d.role] ?? []);
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'role' && !isEdit) {
      setModules(DEFAULT_MODULES[value] ?? []);
    }
  };

  const toggleModule = (key: string) => {
    setModules((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { full_name: form.full_name, role: form.role, modules };
      if (form.password) payload.password = form.password;
      if (isEdit) {
        await authAPI.updateUser(Number(id), payload);
      } else {
        payload.username = form.username;
        await authAPI.createUser(payload);
      }
      navigate('/users');
    } catch { alert('Gagal menyimpan user'); }
    finally { setLoading(false); }
  };

  const inputStyle = { background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' } as const;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        {isEdit ? 'Edit User' : 'Tambah User'}
      </h1>
      <form onSubmit={handleSubmit} className="p-6 rounded-xl border space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Username*</label>
          <input
            type="text" name="username" value={form.username} onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle}
            disabled={isEdit} required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Nama Lengkap*</label>
          <input
            type="text" name="full_name" value={form.full_name} onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
            Password{isEdit ? ' (biarkan kosong jika tidak diubah)' : '*'}
          </label>
          <input
            type="password" name="password" value={form.password} onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle}
            required={!isEdit}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Role*</label>
          <select name="role" value={form.role} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} required>
            <option value="admin">Admin</option>
            <option value="petugas">Petugas</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Akses Module</label>
          <div className="space-y-2">
            {ALL_MODULES.map((m) => (
              <label key={m.key} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                <input
                  type="checkbox"
                  checked={modules.includes(m.key)}
                  onChange={() => toggleModule(m.key)}
                  className="rounded"
                />
                {m.label}
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: '#2563eb' }}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button type="button" onClick={() => navigate('/users')} className="px-6 py-2.5 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>Batal</button>
        </div>
      </form>
    </div>
  );
}