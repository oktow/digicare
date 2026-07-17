import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/client';
import type { DashboardStats } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

const BULAN_INDONESIA = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

const INDICATOR_MAP: Record<string, { label: string; suffix: string; gradient: string }> = {
  bor_simrs: { label: 'BOR', suffix: '%', gradient: 'linear-gradient(135deg,#1e3a5f,#2563eb)' },
  avlos: { label: 'AVLOS', suffix: ' hr', gradient: 'linear-gradient(135deg,#1a3d2b,#16a34a)' },
  toi: { label: 'TOI', suffix: ' hr', gradient: 'linear-gradient(135deg,#3d2e1a,#ca8a04)' },
  bto: { label: 'BTO', suffix: '', gradient: 'linear-gradient(135deg,#2d1a3d,#7c3aed)' },
  ndr: { label: 'NDR', suffix: '‰', gradient: 'linear-gradient(135deg,#3d1a1a,#dc2626)' },
  gdr: { label: 'GDR', suffix: '‰', gradient: 'linear-gradient(135deg,#3d1a2d,#db2777)' },
  awal: { label: 'Pasien Awal', suffix: '', gradient: 'linear-gradient(135deg,#1a3d3d,#0891b2)' },
  masuk: { label: 'Pasien Masuk', suffix: '', gradient: 'linear-gradient(135deg,#1a2d3d,#0284c7)' },
  kurang_48_jam: { label: '< 48 Jam', suffix: '', gradient: 'linear-gradient(135deg,#3d2d1a,#ca8a04)' },
  lebih_48_jam: { label: '> 48 Jam', suffix: '', gradient: 'linear-gradient(135deg,#3d1a1a,#dc2626)' },
  jml_keluar_hidup: { label: 'Keluar Hidup', suffix: '', gradient: 'linear-gradient(135deg,#1a3d1a,#16a34a)' },
  jml_klr: { label: 'Total Keluar', suffix: '', gradient: 'linear-gradient(135deg,#2d1a3d,#7c3aed)' },
  lama_dirawat: { label: 'Lama Dirawat', suffix: ' hr', gradient: 'linear-gradient(135deg,#2d1a2d,#db2777)' },
  hari_perawatan: { label: 'Hari Perawatan', suffix: '', gradient: 'linear-gradient(135deg,#1a2d2d,#0891b2)' },
  pasien_dirawat: { label: 'Pasien Dirawat', suffix: '', gradient: 'linear-gradient(135deg,#1a3d2d,#059669)' },
  ttidur: { label: 'Tempat Tidur', suffix: '', gradient: 'linear-gradient(135deg,#3d2d1a,#ca8a04)' },
  jml_hari: { label: 'Jumlah Hari', suffix: '', gradient: 'linear-gradient(135deg,#2d1a3d,#7c3aed)' },
  total_komplain: { label: 'Total Komplain', suffix: '', gradient: 'linear-gradient(135deg,#1e3a5f,#2563eb)' },
  total_insiden: { label: 'Total Insiden', suffix: '', gradient: 'linear-gradient(135deg,#3d1a1a,#dc2626)' },
  avg_waktu_tunggu: { label: 'Rata Waktu Tunggu', suffix: ' mnt', gradient: 'linear-gradient(135deg,#2d1a2d,#db2777)' },
  bor_terakhir: { label: 'Bor Terakhir', suffix: '%', gradient: 'linear-gradient(135deg,#1e3a5f,#2563eb)' },
};

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
  const [ver, setVer] = useState(0);
  useEffect(() => {
    const h1 = () => setVer(v => v + 1);
    const h2 = () => setVer(v => v + 1);
    const h3 = () => setVer(v => v + 1);
    window.addEventListener('hex-settings-changed', h1);
    window.addEventListener('indicator-settings-changed', h2);
    window.addEventListener('ki-settings-changed', h3);
    return () => {
      window.removeEventListener('hex-settings-changed', h1);
      window.removeEventListener('indicator-settings-changed', h2);
      window.removeEventListener('ki-settings-changed', h3);
    };
  }, []);
  void ver;

  const indicatorStyle = (localStorage.getItem('indicator_style') as 'box' | 'hexagon') || 'hexagon';

  let indicatorRows: string[][] = [];
  try {
    const raw = localStorage.getItem('indicator_rows');
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p) && p.length) indicatorRows = p;
    }
  } catch {}
  if (!indicatorRows.length) {
    try {
      const old = JSON.parse(localStorage.getItem('indicator_selected') || '[]');
      if (Array.isArray(old) && old.length) indicatorRows = [old];
    } catch {}
  }
  if (!indicatorRows.length) indicatorRows = [['bor_simrs','avlos','toi','bto','ndr','gdr']];

  // Box settings
  const boxGap = Number(localStorage.getItem('box_gap')) || 12;
  const boxW = Number(localStorage.getItem('box_width')) || 0;
  const boxH = Number(localStorage.getItem('box_height')) || 0;
  const boxFill = localStorage.getItem('box_fill') || 'ya';
  const boxLabelSize = Number(localStorage.getItem('box_label_size')) || 10;
  const boxValueSize = Number(localStorage.getItem('box_value_size')) || 14;
  const boxLabelColor = localStorage.getItem('box_label_color') || 'var(--text-secondary)';
  const boxValueColor = localStorage.getItem('box_value_color') || 'var(--text-primary)';
  const boxCardBg = localStorage.getItem('box_card_bg') || 'var(--bg-card)';

  // Hex settings
  const hexX = Number(localStorage.getItem('hex_offset_x')) || 53;
  const hexY = Number(localStorage.getItem('hex_offset_y')) || -30;
  const hexGap = Number(localStorage.getItem('hex_gap')) || 4;
  const hexW = Number(localStorage.getItem('hex_width')) || 104;
  const hexH = Number(localStorage.getItem('hex_height')) || 120;
  const hexFill = localStorage.getItem('hex_fill') || 'ya';
  const hexLabelSize = Number(localStorage.getItem('hex_label_size')) || 9;
  const hexValueSize = Number(localStorage.getItem('hex_value_size')) || 12;
  const hexLabelColor = localStorage.getItem('hex_label_color') || 'rgba(255,255,255,0.7)';
  const hexValueColor = localStorage.getItem('hex_value_color') || '#fff';

  // Komplain settings
  const kVisible = localStorage.getItem('komplain_visible') !== 'tidak';
  const kGap = Number(localStorage.getItem('komplain_gap')) || 8;
  const kFill = localStorage.getItem('komplain_fill') || 'ya';
  let kRows: string[][] = [];
  try {
    const raw = localStorage.getItem('komplain_rows');
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p) && p.length) kRows = p;
    }
  } catch {}

  // Insiden settings
  const iVisible = localStorage.getItem('insiden_visible') !== 'tidak';
  const iGap = Number(localStorage.getItem('insiden_gap')) || 8;
  const iFill = localStorage.getItem('insiden_fill') || 'ya';
  let iRows: string[][] = [];
  try {
    const raw = localStorage.getItem('insiden_rows');
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p) && p.length) iRows = p;
    }
  } catch {}

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
    <div className="space-y-3 dashboard-grid">

      {/* SVG Gradient Definitions for Chart Bars */}
      <svg style={{ width: 0, height: 0 }}>
        <defs>
          <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="gradRed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="gradAmber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>

      {/* RS Indicator Cards */}
      <div className="p-3 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="flex gap-3 items-start">
          {indicatorStyle === 'hexagon' ? (
            <div className="flex flex-col items-center flex-1 pt-2" style={{ '--hex-offset-x': `${hexX}px`, '--hex-offset-y': `${hexY}px`, '--hex-w': `${hexW}px`, '--hex-h': `${hexH}px`, '--hex-label-size': `${hexLabelSize}px`, '--hex-value-size': `${hexValueSize}px`, '--hex-label-color': hexLabelColor, '--hex-value-color': hexValueColor } as React.CSSProperties}>
              {indicatorRows.map((row, ri) => (
                <div key={ri} className={`flex justify-center ${ri % 2 === 1 ? 'hex-offset' : ''}`} style={{ gap: hexGap + 'px' }}>
                  {row.map(id => {
                    const info = INDICATOR_MAP[id];
                    if (!info) return null;
                    const val = (data as any)[id] as number | undefined | null;
                    return <HexagonCard key={id} title={info.label} value={val} suffix={info.suffix} gradient={info.gradient} fill={hexFill} />;
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col" style={{ gap: boxGap + 'px' }}>
              {indicatorRows.map((row, ri) => (
                <div key={ri} className="flex flex-wrap" style={{ gap: boxGap + 'px' }}>
                  {row.map(id => {
                    const info = INDICATOR_MAP[id];
                    if (!info) return null;
                    const val = (data as any)[id] as number | undefined | null;
                    const noFill = boxFill === 'tidak';
                    return (
                      <div key={id} className="p-2 rounded-xl border text-center hover-lift" style={{
                        width: boxW > 0 ? boxW + 'px' : undefined,
                        height: boxH > 0 ? boxH + 'px' : undefined,
                        flex: boxW > 0 ? 'none' : '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: noFill ? 'transparent' : boxCardBg,
                        borderColor: noFill ? boxValueColor : 'var(--border-color)',
                        borderWidth: noFill ? '2px' : '1px',
                      }}>
                        <p className="font-medium leading-tight" style={{ fontSize: boxLabelSize + 'px', color: boxLabelColor }}>{info.label}</p>
                        <p className="font-bold leading-tight mt-0.5" style={{ fontSize: boxValueSize + 'px', color: boxValueColor }}>
                          {val != null ? `${val}${info.suffix}` : '—'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          <DatePickBox
            tglAwal={tglAwal}
            tglAkhir={tglAkhir}
            show={showPicker}
            onToggle={() => setShowPicker(!showPicker)}
            onTglAwal={(v) => setTglAwal(v ?? todayString())}
            onTglAkhir={(v) => setTglAkhir(v ?? todayString())}
          />
        </div>
      </div>

      {/* Komplain + Insiden side-by-side */}
      <div className="flex gap-3">
        {renderKISection('Komplain', data.total_komplain, data, kVisible, kRows, kGap, kFill, '3b82f6',
          komplainTglAwal, komplainTglAkhir, showKomplainPicker, setShowKomplainPicker, setKomplainTglAwal, setKomplainTglAkhir)}
        {renderKISection('Insiden', data.total_insiden, data, iVisible, iRows, iGap, iFill, 'ef4444',
          insidenTglAwal, insidenTglAkhir, showInsidenPicker, setShowInsidenPicker, setInsidenTglAwal, setInsidenTglAkhir)}
      </div>
    </div>
  );
}

function renderKISection(
  title: string,
  totalValue: number,
  data: DashboardStats,
  visible: boolean, rows: string[][], gap: number, fill: string,
  cardColor: string,
  tglAwal?: string, tglAkhir?: string, show?: boolean,
  onToggle?: (v: boolean) => void,
  onTglAwal?: (v: string | undefined) => void,
  onTglAkhir?: (v: string | undefined) => void,
) {
  if (!visible || !rows.length) return null;
  const noFill = fill === 'tidak';
  const defH = title === 'Komplain' ? 100 : 130;

  return (
    <div className="flex-1 rounded-xl border p-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="flex items-start gap-2 mb-3">
        <div className="flex-1">
          <SimrsCard title={title} value={totalValue} suffix="" color={'#' + cardColor} />
        </div>
        <DatePickBox
          tglAwal={tglAwal} tglAkhir={tglAkhir} show={!!show}
          onToggle={() => onToggle?.(!show)}
          onTglAwal={(v) => onTglAwal?.(v)}
          onTglAkhir={(v) => onTglAkhir?.(v)}
        />
      </div>
      <div className="flex flex-col" style={{ gap: gap + 'px' }}>
        {rows.map((row, ri) => (
          <div key={ri} className="flex flex-wrap" style={{ gap: gap + 'px' }}>
            {row.map(id => renderChart(id, data, defH, noFill))}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderChart(id: string, data: DashboardStats, defH: number, noFill: boolean) {
  const chartH = defH;
  const borderSx = noFill ? { background: 'transparent', borderColor: 'var(--text-primary)', borderWidth: '2px' as const } : {};

  switch (id) {
    // === KOMPLAIN CHARTS ===
    case 'waktu_tunggu':
      return (
        <MiniChart key={id} className={undefined} style={borderSx}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Waktu Tunggu</p>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={data.status_waktu_distribusi} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={48} label={({ name }) => name}>
                {data.status_waktu_distribusi.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </MiniChart>
      );
    case 'per_bulan':
      return (
        <MiniChart key={id} style={borderSx}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Per Bulan</p>
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={data.komplain_per_bulan}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} />
              <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} width={20} />
              <Tooltip />
              <Bar dataKey="value" fill="url(#gradBlue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </MiniChart>
      );
    case 'grading':
      return (
        <MiniChart key={id} style={borderSx}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Grading</p>
          <ResponsiveContainer width="100%" height={chartH}>
            <PieChart>
              <Pie data={data.komplain_per_grading} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={35} label={({ name }) => name}>
                {data.komplain_per_grading.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </MiniChart>
      );
    case 'sarana':
      return (
        <MiniChart key={id} style={borderSx}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Sarana</p>
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={data.komplain_per_sarana}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} />
              <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} width={20} />
              <Tooltip />
              <Bar dataKey="value" fill="url(#gradPurple)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </MiniChart>
      );
    case 'unit':
      return (
        <MiniChart key={id} style={borderSx}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Unit</p>
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={data.komplain_per_instalasi} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis type="number" allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} />
              <YAxis dataKey="name" type="category" width={50} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} />
              <Tooltip />
              <Bar dataKey="value" fill="url(#gradGreen)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </MiniChart>
      );

    // === INSIDEN CHARTS ===
    case 'jenis_insiden':
      return (
        <MiniChart key={id} style={borderSx}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Jenis Insiden</p>
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={data.insiden_per_jenis}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} />
              <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} width={20} />
              <Tooltip />
              <Bar dataKey="value" fill="url(#gradRed)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </MiniChart>
      );
    case 'dampak_pasien':
      return (
        <MiniChart key={id} style={borderSx}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Dampak Pasien</p>
          <ResponsiveContainer width="100%" height={chartH}>
            <PieChart>
              <Pie data={data.insiden_per_dampak} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={48} label={({ name }) => name}>
                {data.insiden_per_dampak.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </MiniChart>
      );
    case 'probabilitas_risiko':
      return (
        <MiniChart key={id} style={borderSx}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Probabilitas Risiko</p>
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={data.insiden_per_probabilitas}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} />
              <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} width={20} />
              <Tooltip />
              <Bar dataKey="value" fill="url(#gradAmber)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </MiniChart>
      );
    case 'per_bulan_insiden':
      return (
        <MiniChart key={id} style={borderSx}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Per Bulan</p>
          <ResponsiveContainer width="100%" height={chartH}>
            <BarChart data={data.insiden_per_bulan}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} />
              <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} width={20} />
              <Tooltip />
              <Bar dataKey="value" fill="url(#gradBlue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </MiniChart>
      );
    case 'grading_insiden':
      return (
        <MiniChart key={id} style={borderSx}>
          <p className="text-[10px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Grading</p>
          <ResponsiveContainer width="100%" height={chartH}>
            <PieChart>
              <Pie data={data.insiden_per_grading} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={35} label={({ name }) => name}>
                {data.insiden_per_grading.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </MiniChart>
      );
    default:
      return null;
  }
}

function SimrsCard({ title, value, suffix, gradient, color }: { title: string; value?: number | null; suffix: string; gradient?: string; color?: string }) {
  const displayValue = value != null ? `${value}${suffix}` : '—';
  const hasGradient = !!gradient;
  return (
    <div className="p-2 rounded-xl border text-center hover-lift" style={{
      background: hasGradient ? gradient : 'var(--bg-card)',
      borderColor: hasGradient ? 'rgba(255,255,255,0.12)' : 'var(--border-color)',
    }}>
      <p className="text-[10px] font-medium leading-tight" style={{ color: hasGradient ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' }}>{title}</p>
      <p className={`text-sm font-bold leading-tight mt-0.5 ${hasGradient ? 'glow-text' : ''}`} style={{ color: hasGradient ? '#fff' : (color || 'var(--text-primary)') }}>
        {displayValue}
      </p>
    </div>
  );
}

function HexagonCard({ title, value, suffix, gradient, fill }: { title: string; value?: number | null; suffix: string; gradient: string; fill: string }) {
  const displayValue = value != null ? `${value}${suffix}` : '—';
  const noFill = fill === 'tidak';
  return (
    <div className="hex" style={{
      background: noFill ? 'transparent' : gradient,
      boxShadow: noFill ? 'inset 0 0 0 1.5px rgba(255,255,255,0.25)' : undefined,
    }}>
      <p className="font-medium leading-tight" style={{ fontSize: 'var(--hex-label-size, 9px)', color: 'var(--hex-label-color, rgba(255,255,255,0.7))' }}>{title}</p>
      <p className="font-bold leading-tight mt-0.5" style={{ fontSize: 'var(--hex-value-size, 12px)', color: 'var(--hex-value-color, #fff)', textShadow: '0 0 6px rgba(255,255,255,0.2)' }}>
        {displayValue}
      </p>
    </div>
  );
}

function MiniChart({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`p-1 rounded-lg border chart-glass ${className ?? ''}`} style={style}>
      {children}
    </div>
  );
}

function DatePickBox({
  tglAwal,
  tglAkhir,
  show,
  onToggle,
  onTglAwal,
  onTglAkhir,
}: {
  tglAwal?: string;
  tglAkhir?: string;
  show: boolean;
  onToggle: () => void;
  onTglAwal: (v: string | undefined) => void;
  onTglAkhir: (v: string | undefined) => void;
}) {
  return (
    <div className="flex flex-col rounded-lg border w-[120px] date-glass">
      <div className="flex-1 flex flex-col items-center justify-center py-1.5 px-1">
        <p className="text-xs font-bold text-center leading-tight glow-text" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {tglAwal && tglAkhir
            ? tglAwal === tglAkhir
              ? formatDateIndonesia(tglAwal)
              : `${formatDateIndonesia(tglAwal)} — ${formatDateIndonesia(tglAkhir)}`
            : String(new Date().getFullYear())
          }
        </p>
      </div>
      <button onClick={onToggle}
        className="w-full py-0.5 flex items-center justify-center border-t text-[10px] font-medium"
        style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
        {show ? '▲' : '▼'}
      </button>
      {show && (
        <div className="p-2 border-t space-y-1.5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <input type="date" value={tglAwal ?? ''} onChange={(e) => onTglAwal(e.target.value || undefined)}
            className="w-full px-1.5 py-1 border rounded text-[10px]"
            style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
          <input type="date" value={tglAkhir ?? ''} onChange={(e) => onTglAkhir(e.target.value || undefined)}
            className="w-full px-1.5 py-1 border rounded text-[10px]"
            style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
        </div>
      )}
    </div>
  );
}