import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/client';
import type { DashboardStats } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

const BULAN_INDONESIA = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

function formatDateIndonesia(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${BULAN_INDONESIA[d.getMonth()]} ${d.getFullYear()}`;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tglAwal, setTglAwal] = useState(todayString);
  const [tglAkhir, setTglAkhir] = useState(todayString);
  const [showPicker, setShowPicker] = useState(false);
  const [komplainTglAwal, setKomplainTglAwal] = useState<string | undefined>(undefined);
  const [komplainTglAkhir, setKomplainTglAkhir] = useState<string | undefined>(undefined);
  const [showKomplainPicker, setShowKomplainPicker] = useState(false);
  const [insidenTglAwal, setInsidenTglAwal] = useState<string | undefined>(undefined);
  const [insidenTglAkhir, setInsidenTglAkhir] = useState<string | undefined>(undefined);
  const [showInsidenPicker, setShowInsidenPicker] = useState(false);

  const loadData = async () => {
    try {
      const params: Record<string, string> = { tgl_awal: tglAwal, tgl_akhir: tglAkhir };
      if (komplainTglAwal) params.komplain_tgl_awal = komplainTglAwal;
      if (komplainTglAkhir) params.komplain_tgl_akhir = komplainTglAkhir;
      if (insidenTglAwal) params.insiden_tgl_awal = insidenTglAwal;
      if (insidenTglAkhir) params.insiden_tgl_akhir = insidenTglAkhir;
      const res = await dashboardAPI.get(params);
      setData(res.data);
    } catch {
      // silent
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [tglAwal, tglAkhir, komplainTglAwal, komplainTglAkhir, insidenTglAwal, insidenTglAkhir]);

  useEffect(() => {
    const interval = setInterval(loadData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tglAwal, tglAkhir, komplainTglAwal, komplainTglAkhir, insidenTglAwal, insidenTglAkhir]);

  useEffect(() => {
    const handler = () => loadData();
    window.addEventListener('dashboard-refresh', handler);
    return () => window.removeEventListener('dashboard-refresh', handler);
  }, [tglAwal, tglAkhir, komplainTglAwal, komplainTglAkhir, insidenTglAwal, insidenTglAkhir]);

  if (loading) return <div className="text-center py-10" style={{ color: 'var(--text-secondary)' }}>Memuat data...</div>;
  if (!data) return <div className="text-center py-10 text-red-500">Gagal memuat dashboard</div>;

  return (
    <div className="space-y-6">


      <div className="p-5 rounded-xl border" title="Indikator Statistik Pelayanan Rawat Inap Rumah Sakit" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex gap-4">
          <div className="grid grid-cols-3 gap-4 flex-1">
            <SimrsCard title="BOR" value={data.bor_simrs} suffix="%" color="#3b82f6" />
            <SimrsCard title="AVLOS" value={data.avlos} suffix=" hari" color="#22c55e" />
            <SimrsCard title="TOI" value={data.toi} suffix=" hari" color="#eab308" />
            <SimrsCard title="BTO" value={data.bto} suffix="" color="#8b5cf6" />
            <SimrsCard title="NDR" value={data.ndr} suffix="‰" color="#ef4444" />
            <SimrsCard title="GDR" value={data.gdr} suffix="‰" color="#ec4899" />
          </div>

          <div className="w-52 flex flex-col rounded-xl border" style={{
            borderColor: 'var(--border-color)',
          }}>
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Periode Data</p>
              <p className="text-lg font-bold text-center" style={{ color: 'var(--text-primary)' }}>
                {tglAwal === tglAkhir
                  ? formatDateIndonesia(tglAwal)
                  : `${formatDateIndonesia(tglAwal)} — ${formatDateIndonesia(tglAkhir)}`
                }
              </p>
            </div>

            <button
              onClick={() => setShowPicker(!showPicker)}
              className="w-full py-2 flex items-center justify-center border-t text-sm font-medium"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              {showPicker ? '▲' : '▼'}
            </button>

            {showPicker && (
              <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <label className="text-xs block mb-0.5" style={{ color: 'var(--text-secondary)' }}>Dari</label>
                  <input type="date" value={tglAwal} onChange={(e) => setTglAwal(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="text-xs block mb-0.5" style={{ color: 'var(--text-secondary)' }}>Sampai</label>
                  <input type="date" value={tglAkhir} onChange={(e) => setTglAkhir(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded text-xs"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>



      <div className="p-5 rounded-xl border" title="Grafik Komplain" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <StatCard title="Total Komplain" value={data.total_komplain} color="blue" />
          </div>
          <div className="w-44 flex flex-col rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex-1 flex flex-col items-center justify-center p-3">
              <p className="text-[10px] font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>Periode Komplain</p>
              <p className="text-sm font-bold text-center" style={{ color: 'var(--text-primary)' }}>
                {!komplainTglAwal || !komplainTglAkhir
                  ? 'Tahun Ini'
                  : komplainTglAwal === komplainTglAkhir
                    ? formatDateIndonesia(komplainTglAwal)
                    : `${formatDateIndonesia(komplainTglAwal)} — ${formatDateIndonesia(komplainTglAkhir)}`
                }
              </p>
            </div>
            <button onClick={() => setShowKomplainPicker(!showKomplainPicker)}
              className="w-full py-1.5 flex items-center justify-center border-t text-[11px] font-medium"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              {showKomplainPicker ? '▲' : '▼'}
            </button>
            {showKomplainPicker && (
              <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <label className="text-[10px] block mb-0.5" style={{ color: 'var(--text-secondary)' }}>Dari</label>
                  <input type="date" value={komplainTglAwal ?? ''} onChange={(e) => setKomplainTglAwal(e.target.value || undefined)}
                    className="w-full px-2 py-1 border rounded text-[11px]"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="text-[10px] block mb-0.5" style={{ color: 'var(--text-secondary)' }}>Sampai</label>
                  <input type="date" value={komplainTglAkhir ?? ''} onChange={(e) => setKomplainTglAkhir(e.target.value || undefined)}
                    className="w-full px-2 py-1 border rounded text-[11px]"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Komplain per Bulan">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.komplain_per_bulan}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Distribusi Grading Komplain">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data.komplain_per_grading} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {data.komplain_per_grading.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Komplain per Sarana">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.komplain_per_sarana}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Komplain per Instalasi">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.komplain_per_instalasi} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={60} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Waktu Tunggu Komplain">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data.status_waktu_distribusi} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {data.status_waktu_distribusi.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <div className="p-5 rounded-xl border" title="Grafik Insiden" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <StatCard title="Total Insiden" value={data.total_insiden} color="red" />
          </div>
          <div className="w-44 flex flex-col rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex-1 flex flex-col items-center justify-center p-3">
              <p className="text-[10px] font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>Periode Insiden</p>
              <p className="text-sm font-bold text-center" style={{ color: 'var(--text-primary)' }}>
                {!insidenTglAwal || !insidenTglAkhir
                  ? 'Tahun Ini'
                  : insidenTglAwal === insidenTglAkhir
                    ? formatDateIndonesia(insidenTglAwal)
                    : `${formatDateIndonesia(insidenTglAwal)} — ${formatDateIndonesia(insidenTglAkhir)}`
                }
              </p>
            </div>
            <button onClick={() => setShowInsidenPicker(!showInsidenPicker)}
              className="w-full py-1.5 flex items-center justify-center border-t text-[11px] font-medium"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              {showInsidenPicker ? '▲' : '▼'}
            </button>
            {showInsidenPicker && (
              <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <label className="text-[10px] block mb-0.5" style={{ color: 'var(--text-secondary)' }}>Dari</label>
                  <input type="date" value={insidenTglAwal ?? ''} onChange={(e) => setInsidenTglAwal(e.target.value || undefined)}
                    className="w-full px-2 py-1 border rounded text-[11px]"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="text-[10px] block mb-0.5" style={{ color: 'var(--text-secondary)' }}>Sampai</label>
                  <input type="date" value={insidenTglAkhir ?? ''} onChange={(e) => setInsidenTglAkhir(e.target.value || undefined)}
                    className="w-full px-2 py-1 border rounded text-[11px]"
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Jenis Insiden">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.insiden_per_jenis}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Dampak Pasien">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data.insiden_per_dampak} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {data.insiden_per_dampak.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Probabilitas Risiko">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.insiden_per_probabilitas}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#eab308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function SimrsCard({ title, value, suffix, color }: { title: string; value?: number | null; suffix: string; color: string }) {
  return (
    <div className="p-4 rounded-xl border text-center" style={{
      background: 'var(--bg-card)',
      borderColor: 'var(--border-color)',
    }}>
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      <p className="text-2xl font-bold mt-1" style={{ color }}>
        {value != null ? `${value}${suffix}` : '—'}
      </p>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'rgba(59,130,246,0.1)',
    red: 'rgba(239,68,68,0.1)',
    amber: 'rgba(245,158,11,0.1)',
    green: 'rgba(34,197,94,0.1)',
  };
  const textColors: Record<string, string> = {
    blue: '#3b82f6',
    red: '#ef4444',
    amber: '#eab308',
    green: '#22c55e',
  };
  return (
    <div className="p-4 rounded-xl border" style={{
      background: 'var(--bg-card)',
      borderColor: 'var(--border-color)',
    }}>
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      <p className="text-2xl font-bold mt-1" style={{ color: textColors[color] }}>{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl border" style={{
      background: 'var(--bg-card)',
      borderColor: 'var(--border-color)',
    }}>
      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {children}
    </div>
  );
}