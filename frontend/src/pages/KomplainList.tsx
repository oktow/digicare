import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { komplainAPI } from '../api/client';
import type { Komplain, PageResponse } from '../types';
import { useAuth } from '../api/AuthContext';

function today() { return new Date().toISOString().slice(0, 10); }

const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
function formatDate( dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export default function KomplainList() {
  const [data, setData] = useState<PageResponse<Komplain> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterGrading, setFilterGrading] = useState('');
  const [filterInstalasi, setFilterInstalasi] = useState('');
  const [tglAwal, setTglAwal] = useState(today);
  const [tglAkhir, setTglAkhir] = useState(today);
  const [showPeriod, setShowPeriod] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchData = () => {
    setLoading(true);
    komplainAPI.list({ page, size: 20, search: search || undefined, grading: filterGrading || undefined, instalasi: filterInstalasi || undefined, tgl_awal: tglAwal, tgl_akhir: tglAkhir })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page, filterGrading, filterInstalasi, tglAwal, tglAkhir]);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus komplain ini?')) return;
    await komplainAPI.delete(id);
    fetchData();
  };

  const canEdit = user?.role === 'admin' || user?.role === 'petugas';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Komplain Pasien</h1>
        {canEdit && (
          <button onClick={() => navigate('/komplain/new')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            + Tambah Komplain
          </button>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <input type="text" placeholder="Cari nama/unit/komplain..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchData()}
          className="px-3 py-2 border rounded-lg text-sm w-64" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
        <select value={filterGrading} onChange={(e) => { setFilterGrading(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
          <option value="">Semua Grading</option>
          <option value="Hijau">Hijau</option>
          <option value="Kuning">Kuning</option>
          <option value="Merah">Merah</option>
        </select>
        <select value={filterInstalasi} onChange={(e) => { setFilterInstalasi(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
          <option value="">Semua Instalasi</option>
          <option value="Ranap">Ranap</option>
          <option value="IRJ">IRJ</option>
          <option value="IGD">IGD</option>
        </select>
        <div className="relative">
          <button onClick={() => setShowPeriod(!showPeriod)} className="px-3 py-2 border rounded-lg text-sm flex items-center gap-1" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            {tglAwal === tglAkhir ? formatDate(tglAwal) : `${formatDate(tglAwal)} — ${formatDate(tglAkhir)}`}
            <span>{showPeriod ? '▲' : '▼'}</span>
          </button>
          {showPeriod && (
            <div className="absolute top-full mt-1 right-0 z-10 p-3 border rounded-lg shadow-lg space-y-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div>
                <label className="text-xs block mb-0.5" style={{ color: 'var(--text-secondary)' }}>Dari</label>
                <input type="date" value={tglAwal} onChange={(e) => { setTglAwal(e.target.value); setPage(1); }}
                  className="w-full px-2 py-1.5 border rounded text-xs" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="text-xs block mb-0.5" style={{ color: 'var(--text-secondary)' }}>Sampai</label>
                <input type="date" value={tglAkhir} onChange={(e) => { setTglAkhir(e.target.value); setPage(1); }}
                  className="w-full px-2 py-1.5 border rounded text-xs" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
              </div>
            </div>
          )}
        </div>
        <button onClick={fetchData} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)' }}>Cari</button>
      </div>

      {loading ? (
        <div className="text-center py-10" style={{ color: 'var(--text-secondary)' }}>Memuat data...</div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <table className="w-full text-sm">
            <thead className="border-b" style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}>
              <tr>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Tanggal</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Nama</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Instalasi</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Unit</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Grading</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Sarana</th>
                <th className="text-left p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Petugas</th>
                <th className="text-right p-3 font-medium" style={{ color: 'var(--text-secondary)' }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {data?.items.map((k) => (
                <tr key={k.id} style={{ color: 'var(--text-primary)' }}>
                  <td className="p-3">{k.tanggal_diterima || '-'}</td>
                  <td className="p-3 max-w-[150px] truncate">{k.nama || '-'}</td>
                  <td className="p-3">{k.instalasi || '-'}</td>
                  <td className="p-3 max-w-[120px] truncate">{k.unit_ruang || '-'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      k.grading === 'Hijau' ? 'bg-green-100 text-green-700' :
                      k.grading === 'Kuning' ? 'bg-yellow-100 text-yellow-700' :
                      k.grading === 'Merah' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                    }`}>{k.grading || '-'}</span>
                  </td>
                  <td className="p-3">{k.sarana_komplain || '-'}</td>
                  <td className="p-3">{k.nama_petugas || '-'}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => navigate(`/komplain/${k.id}`)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                    {user?.role === 'admin' && (
                      <button onClick={() => handleDelete(k.id)} className="text-red-600 hover:text-red-800">Hapus</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && (
            <div className="flex items-center justify-between p-3 border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--sidebar-bg)' }}>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total: {data.total} data</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 text-sm border rounded disabled:opacity-50" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>Prev</button>
                <span className="px-3 py-1 text-sm" style={{ color: 'var(--text-primary)' }}>Halaman {page} / {data.pages || 1}</span>
                <button disabled={page >= (data.pages || 1)} onClick={() => setPage(page + 1)} className="px-3 py-1 text-sm border rounded disabled:opacity-50" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
