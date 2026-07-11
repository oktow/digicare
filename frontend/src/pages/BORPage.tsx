import { useState, useEffect } from 'react';
import { borAPI } from '../api/client';
import type { BOR } from '../types';
import { useAuth } from '../api/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function BORPage() {
  const [data, setData] = useState<BOR[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tanggal: '', total_tt: '', pasien_rawat_inap: '' });
  const { user } = useAuth();

  const fetchData = () => {
    setLoading(true);
    borAPI.list().then((res) => setData(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await borAPI.create({
      tanggal: form.tanggal,
      total_tt: Number(form.total_tt),
      pasien_rawat_inap: Number(form.pasien_rawat_inap),
    });
    setShowForm(false);
    setForm({ tanggal: '', total_tt: '', pasien_rawat_inap: '' });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus data BOR?')) return;
    await borAPI.delete(id);
    fetchData();
  };

  const canEdit = user?.role === 'admin' || user?.role === 'petugas';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Bed Occupancy Rate (BOR)</h1>
        {canEdit && <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Tambah BOR</button>}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl border flex gap-4 items-end" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Tanggal</label>
            <input type="date" required value={form.tanggal} onChange={(e) => setForm({...form, tanggal: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Total TT</label>
            <input type="number" required value={form.total_tt} onChange={(e) => setForm({...form, total_tt: e.target.value})} className="px-3 py-2 border rounded-lg text-sm w-24" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Pasien Rawat Inap</label>
            <input type="number" required value={form.pasien_rawat_inap} onChange={(e) => setForm({...form, pasien_rawat_inap: e.target.value})} className="px-3 py-2 border rounded-lg text-sm w-24" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Simpan</button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10" style={{ color: 'var(--text-secondary)' }}>Memuat data...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-10" style={{ color: 'var(--text-secondary)' }}>Belum ada data BOR</div>
      ) : (
        <>
          <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Trend BOR</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Line type="monotone" dataKey="bor_percent" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="BOR %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <table className="w-full text-sm">
              <thead className="border-b" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}>
                <tr>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Tanggal</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Total TT</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Pasien Rawat Inap</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>BOR %</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Sumber</th>
                  {user?.role === 'admin' && <th className="text-right p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {data.map((b) => (
                  <tr key={b.id} style={{ color: 'var(--text-primary)' }}>
                    <td className="p-3">{b.tanggal}</td>
                    <td className="p-3">{b.total_tt}</td>
                    <td className="p-3">{b.pasien_rawat_inap}</td>
                    <td className="p-3 font-semibold">{b.bor_percent}%</td>
                    <td className="p-3">{b.sumber_data}</td>
                    {user?.role === 'admin' && (
                      <td className="p-3 text-right">
                        <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-800">Hapus</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
