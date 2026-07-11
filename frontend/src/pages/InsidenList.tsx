import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { insidenAPI } from '../api/client';
import type { Insiden, PageResponse } from '../types';
import { useAuth } from '../api/AuthContext';

function today() { return new Date().toISOString().slice(0, 10); }

const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
function formatDate( dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export default function InsidenList() {
  const [data, setData] = useState<PageResponse<Insiden> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterGrading, setFilterGrading] = useState('');
  const [tglAwal, setTglAwal] = useState(today);
  const [tglAkhir, setTglAkhir] = useState(today);
  const [showPeriod, setShowPeriod] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchData = () => {
    setLoading(true);
    insidenAPI.list({ page, size: 20, search: search || undefined, jenis_insiden: filterJenis || undefined, grading_risiko: filterGrading || undefined, tgl_awal: tglAwal, tgl_akhir: tglAkhir })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page, filterJenis, filterGrading, tglAwal, tglAkhir]);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus insiden ini?')) return;
    await insidenAPI.delete(id);
    fetchData();
  };

  const canEdit = user?.role === 'admin' || user?.role === 'petugas';

  const SText = { color: 'var(--text-primary)' } as const;
  const SSecondary = { color: 'var(--text-secondary)' } as const;
  const SInput = { background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' } as const;
  const SBg = { background: 'var(--bg-card)' } as const;
  const SBorder = { borderColor: 'var(--border-color)' } as const;
  const SThead = { background: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' } as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={SText}>Insiden Keselamatan Pasien</h1>
        {canEdit && (
          <button onClick={() => navigate('/insiden/new')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            + Tambah Insiden
          </button>
        )}
      </div>

      <div className="flex gap-3 flex-wrap">
        <input type="text" placeholder="Cari nama/rm..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchData()} className="px-3 py-2 border rounded-lg text-sm w-64" style={SInput} />
        <select value={filterJenis} onChange={(e) => { setFilterJenis(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm" style={SInput}>
          <option value="">Semua Jenis</option>
          <option value="KNC">KNC</option><option value="KTC">KTC</option><option value="KTD">KTD</option><option value="Sentinel">Sentinel</option><option value="KPCS">KPCS</option>
        </select>
        <select value={filterGrading} onChange={(e) => { setFilterGrading(e.target.value); setPage(1); }} className="px-3 py-2 border rounded-lg text-sm" style={SInput}>
          <option value="">Semua Grading</option>
          <option value="Biru">Biru</option><option value="Hijau">Hijau</option><option value="Kuning">Kuning</option><option value="Merah">Merah</option>
        </select>
        <div className="relative">
          <button onClick={() => setShowPeriod(!showPeriod)} className="px-3 py-2 border rounded-lg text-sm flex items-center gap-1" style={{ ...SInput }}>
            {tglAwal === tglAkhir ? formatDate(tglAwal) : `${formatDate(tglAwal)} — ${formatDate(tglAkhir)}`}
            <span>{showPeriod ? '▲' : '▼'}</span>
          </button>
          {showPeriod && (
            <div className="absolute top-full mt-1 right-0 z-10 p-3 border rounded-lg shadow-lg space-y-2" style={{ ...SBg, ...SBorder }}>
              <div>
                <label className="text-xs block mb-0.5" style={SSecondary}>Dari</label>
                <input type="date" value={tglAwal} onChange={(e) => { setTglAwal(e.target.value); setPage(1); }} className="w-full px-2 py-1.5 border rounded text-xs" style={SInput} />
              </div>
              <div>
                <label className="text-xs block mb-0.5" style={SSecondary}>Sampai</label>
                <input type="date" value={tglAkhir} onChange={(e) => { setTglAkhir(e.target.value); setPage(1); }} className="w-full px-2 py-1.5 border rounded text-xs" style={SInput} />
              </div>
            </div>
          )}
        </div>
        <button onClick={fetchData} className="px-4 py-2 rounded-lg text-sm" style={{ background: 'var(--hover-bg)', color: 'var(--text-primary)' }}>Cari</button>
      </div>

      {loading ? (
        <div className="text-center py-10" style={SSecondary}>Memuat data...</div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ ...SBg, ...SBorder }}>
          <table className="w-full text-sm">
            <thead className="border-b" style={SThead}>
              <tr>
                <th className="text-left p-3 font-medium" style={SSecondary}>Nama Pasien</th>
                <th className="text-left p-3 font-medium" style={SSecondary}>No RM</th>
                <th className="text-left p-3 font-medium" style={SSecondary}>Tgl Kejadian</th>
                <th className="text-left p-3 font-medium" style={SSecondary}>Jenis</th>
                <th className="text-left p-3 font-medium" style={SSecondary}>Unit</th>
                <th className="text-left p-3 font-medium" style={SSecondary}>Dampak</th>
                <th className="text-left p-3 font-medium" style={SSecondary}>Grading</th>
                <th className="text-right p-3 font-medium" style={SSecondary}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={SBorder}>
              {data?.items.map((i) => (
                <tr key={i.id} style={SText}>
                  <td className="p-3">{i.nama_pasien || '-'}</td>
                  <td className="p-3">{i.no_rm || '-'}</td>
                  <td className="p-3">{i.tgl_kejadian || '-'}</td>
                  <td className="p-3"><span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{i.jenis_insiden || '-'}</span></td>
                  <td className="p-3 truncate max-w-[120px]">{i.unit_tempat_insiden || '-'}</td>
                  <td className="p-3">{i.dampak_pasien || '-'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${i.grading_risiko === 'Biru' ? 'bg-blue-100 text-blue-700' : i.grading_risiko === 'Hijau' ? 'bg-green-100 text-green-700' : i.grading_risiko === 'Kuning' ? 'bg-yellow-100 text-yellow-700' : i.grading_risiko === 'Merah' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{i.grading_risiko || '-'}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => navigate(`/insiden/${i.id}`)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                    {user?.role === 'admin' && <button onClick={() => handleDelete(i.id)} className="text-red-600 hover:text-red-800">Hapus</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data && (
            <div className="flex items-center justify-between p-3 border-t" style={{ ...SThead }}>
              <span className="text-sm" style={SSecondary}>Total: {data.total} data</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1 text-sm border rounded disabled:opacity-50" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>Prev</button>
                <span className="px-3 py-1 text-sm" style={SText}>Hal {page} / {data.pages || 1}</span>
                <button disabled={page >= (data.pages || 1)} onClick={() => setPage(page + 1)} className="px-3 py-1 text-sm border rounded disabled:opacity-50" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}