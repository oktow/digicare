import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';
import type { User } from '../types';

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await authAPI.listUsers();
      setUsers(res.data);
    } catch { alert('Gagal memuat data user'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    try {
      await authAPI.deleteUser(id);
      loadUsers();
    } catch { alert('Gagal menghapus user'); }
  };

  if (loading) return <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>Memuat...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Manajemen User</h1>
        <button
          onClick={() => navigate('/users/new')}
          className="text-white px-4 py-2 rounded-lg text-sm font-medium"
          style={{ background: '#2563eb' }}
        >
          + Tambah User
        </button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'var(--sidebar-bg)' }}>
              <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Username</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Nama Lengkap</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Role</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Status</th>
              <th className="text-right px-4 py-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{u.username}</td>
                <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{u.full_name}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{
                    background: u.role === 'admin' ? '#dbeafe' : u.role === 'viewer' ? '#f3e8ff' : '#fef3c7',
                    color: u.role === 'admin' ? '#1d4ed8' : u.role === 'viewer' ? '#7c3aed' : '#b45309',
                  }}>{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span style={{ color: u.is_active ? '#16a34a' : '#dc2626' }}>{u.is_active ? 'Aktif' : 'Nonaktif'}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => navigate(`/users/${u.id}/edit`)}
                    className="text-xs mr-2 px-3 py-1.5 rounded-lg border"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border text-red-500"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}
                  >Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}