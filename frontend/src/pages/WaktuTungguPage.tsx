import { useState, useEffect } from 'react';
import { waktuTungguAPI } from '../api/client';
import type { WaktuTunggu } from '../types';
import { useAuth } from '../api/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WaktuTungguPage() {
  const [data, setData] = useState<WaktuTunggu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tanggal: '', instalasi: 'IRJ', unit_ruang: '', rata_rata_menit: '', jumlah_pasien: '' });
  const { user } = useAuth();

  const fetchData = () => {
    setLoading(true);
    waktuTungguAPI.list().then((res) => setData(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await waktuTungguAPI.create({
      tanggal: form.tanggal,
      instalasi: form.instalasi,
      unit_ruang: form.unit_ruang,
      rata_rata_menit: Number(form.rata_rata_menit),
      jumlah_pasien: Number(form.jumlah_pasien) || null,
    });
    setShowForm(false);
    setForm({ tanggal: '', instalasi: 'IRJ', unit_ruang: '', rata_rata_menit: '', jumlah_pasien: '' });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus data waktu tunggu?')) return;
    await waktuTungguAPI.delete(id);
    fetchData();
  };

  const canEdit = user?.role === 'admin' || user?.role === 'petugas';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Waktu Tunggu</h1>
        {canEdit && <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Tambah Data</button>}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl border flex gap-4 items-end flex-wrap" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Tanggal</label>
            <input type="date" required value={form.tanggal} onChange={(e) => setForm({...form, tanggal: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Instalasi</label>
            <select value={form.instalasi} onChange={(e) => setForm({...form, instalasi: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
              <option value="IRJ">IRJ</option>
              <option value="IGD">IGD</option>
              <option value="Farmasi">Farmasi</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Unit/Ruang</label>
            <input type="text" value={form.unit_ruang} onChange={(e) => setForm({...form, unit_ruang: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Rata-rata (menit)</label>
            <input type="number" required value={form.rata_rata_menit} onChange={(e) => setForm({...form, rata_rata_menit: e.target.value})} className="px-3 py-2 border rounded-lg text-sm w-24" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Jumlah Pasien</label>
            <input type="number" value={form.jumlah_pasien} onChange={(e) => setForm({...form, jumlah_pasien: e.target.value})} className="px-3 py-2 border rounded-lg text-sm w-24" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Simpan</button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10" style={{ color: 'var(--text-secondary)' }}>Memuat data...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-10" style={{ color: 'var(--text-secondary)' }}>Belum ada data waktu tunggu</div>
      ) : (
        <>
          <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Rata-rata Waktu Tunggu</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `${v} mnt`} />
                <Tooltip />
                <Bar dataKey="rata_rata_menit" fill="#eab308" radius={[4, 4, 0, 0]} name="Rata-rata (menit)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <table className="w-full text-sm">
              <thead className="border-b" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}>
                <tr>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Tanggal</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Instalasi</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Unit/Ruang</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Rata-rata (menit)</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Pasien</th>
                  <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Sumber</th>
                  {user?.role === 'admin' && <th className="text-right p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {data.map((w) => (
                  <tr key={w.id} style={{ color: 'var(--text-primary)' }}>
                    <td className="p-3">{w.tanggal}</td>
                    <td className="p-3">{w.instalasi || '-'}</td>
                    <td className="p-3">{w.unit_ruang || '-'}</td>
                    <td className="p-3 font-semibold">{w.rata_rata_menit}</td>
                    <td className="p-3">{w.jumlah_pasien || '-'}</td>
                    <td className="p-3">{w.sumber_data}</td>
                    {user?.role === 'admin' && (
                      <td className="p-3 text-right">
                        <button onClick={() => handleDelete(w.id)} className="text-red-600 hover:text-red-800">Hapus</button>
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
