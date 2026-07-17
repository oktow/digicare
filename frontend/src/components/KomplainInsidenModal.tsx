import { useState } from 'react';

interface ChartDef { id: string; label: string; }

const CHARTS_K = [
  { id: 'waktu_tunggu', label: 'Waktu Tunggu' },
  { id: 'per_bulan', label: 'Per Bulan' },
  { id: 'grading', label: 'Grading' },
  { id: 'sarana', label: 'Sarana' },
  { id: 'unit', label: 'Unit/Instalasi' },
];

const CHARTS_I = [
  { id: 'jenis_insiden', label: 'Jenis Insiden' },
  { id: 'dampak_pasien', label: 'Dampak Pasien' },
  { id: 'probabilitas_risiko', label: 'Probabilitas Risiko' },
  { id: 'per_bulan_insiden', label: 'Per Bulan' },
  { id: 'grading_insiden', label: 'Grading' },
];

const DEFAULT_K_ROWS = [['waktu_tunggu'], ['per_bulan', 'grading'], ['sarana', 'unit']];
const DEFAULT_I_ROWS = [['jenis_insiden', 'dampak_pasien'], ['probabilitas_risiko', 'per_bulan_insiden'], ['grading_insiden']];

function loadRows(key: string, fallback: string[][]): string[][] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const p = JSON.parse(raw);
      if (Array.isArray(p) && p.length) return p;
    }
  } catch {}
  return fallback;
}

export default function KomplainInsidenModal({ onClose }: { onClose: () => void }) {
  const [kVisible, setKVisible] = useState(() => localStorage.getItem('komplain_visible') !== 'tidak');
  const [kRows, setKRows] = useState<string[][]>(() => loadRows('komplain_rows', DEFAULT_K_ROWS));
  const [kGap, setKGap] = useState(() => Number(localStorage.getItem('komplain_gap')) || 8);
  const [kW, setKW] = useState(() => Number(localStorage.getItem('komplain_width')) || 0);
  const [kH, setKH] = useState(() => Number(localStorage.getItem('komplain_height')) || 0);
  const [kFill, setKFill] = useState(() => localStorage.getItem('komplain_fill') || 'ya');

  const [iVisible, setIVisible] = useState(() => localStorage.getItem('insiden_visible') !== 'tidak');
  const [iRows, setIRows] = useState<string[][]>(() => loadRows('insiden_rows', DEFAULT_I_ROWS));
  const [iGap, setIGap] = useState(() => Number(localStorage.getItem('insiden_gap')) || 8);
  const [iW, setIW] = useState(() => Number(localStorage.getItem('insiden_width')) || 0);
  const [iH, setIH] = useState(() => Number(localStorage.getItem('insiden_height')) || 0);
  const [iFill, setIFill] = useState(() => localStorage.getItem('insiden_fill') || 'ya');

  const save = () => {
    localStorage.setItem('komplain_visible', kVisible ? 'ya' : 'tidak');
    localStorage.setItem('komplain_rows', JSON.stringify(kRows));
    localStorage.setItem('komplain_gap', String(kGap));
    localStorage.setItem('komplain_width', String(kW));
    localStorage.setItem('komplain_height', String(kH));
    localStorage.setItem('komplain_fill', kFill);
    localStorage.setItem('insiden_visible', iVisible ? 'ya' : 'tidak');
    localStorage.setItem('insiden_rows', JSON.stringify(iRows));
    localStorage.setItem('insiden_gap', String(iGap));
    localStorage.setItem('insiden_width', String(iW));
    localStorage.setItem('insiden_height', String(iH));
    localStorage.setItem('insiden_fill', iFill);
    window.dispatchEvent(new CustomEvent('ki-settings-changed'));
    onClose();
  };

  const reset = () => {
    ['komplain_visible','komplain_rows','komplain_gap','komplain_width','komplain_height','komplain_fill',
     'insiden_visible','insiden_rows','insiden_gap','insiden_width','insiden_height','insiden_fill'].forEach(k => localStorage.removeItem(k));
    setKVisible(true); setKRows(DEFAULT_K_ROWS); setKGap(8); setKW(0); setKH(0); setKFill('ya');
    setIVisible(true); setIRows(DEFAULT_I_ROWS); setIGap(8); setIW(0); setIH(0); setIFill('ya');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
      <div className="relative p-5 rounded-xl border max-h-[85vh] overflow-y-auto w-[580px]" onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <p className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Pengaturan Komplain & Insiden</p>

        {/* ============ KOMPLAIN ============ */}
        <SectionPanel title="Komplain"
          visible={kVisible} onVisible={setKVisible}
          rows={kRows} setRows={setKRows}
          charts={CHARTS_K}
          gap={kGap} onGap={setKGap}
          w={kW} onW={setKW}
          h={kH} onH={setKH}
          fill={kFill} onFill={setKFill}
        />

        {/* ============ INSIDEN ============ */}
        <SectionPanel title="Insiden"
          visible={iVisible} onVisible={setIVisible}
          rows={iRows} setRows={setIRows}
          charts={CHARTS_I}
          gap={iGap} onGap={setIGap}
          w={iW} onW={setIW}
          h={iH} onH={setIH}
          fill={iFill} onFill={setIFill}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={reset}
            className="px-3 py-1.5 rounded-lg text-xs border mr-auto"
            style={{ borderColor: '#ef4444', color: '#ef4444' }}>↺ Reset Default</button>
          <button onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs border"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>Batal</button>
          <button onClick={save}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: 'var(--active-bg)', color: 'var(--active-text)' }}>Simpan</button>
        </div>
      </div>
    </div>
  );
}

function SectionPanel({ title, visible, onVisible, rows, setRows, charts, gap, onGap, w, onW, h, onH, fill, onFill }: {
  title: string; visible: boolean; onVisible: (v: boolean) => void;
  rows: string[][]; setRows: (r: string[][]) => void;
  charts: ChartDef[]; gap: number; onGap: (v: number) => void;
  w: number; onW: (v: number) => void;
  h: number; onH: (v: number) => void;
  fill: string; onFill: (v: string) => void;
}) {
  const used = new Set(rows.flat());
  const avail = charts.filter(c => !used.has(c.id));
  const chartMap = new Map(charts.map(c => [c.id, c]));

  const addToRow = (ri: number, id: string) => {
    setRows(rows.map((r, i) => i === ri ? [...r, id] : r));
  };
  const removeFromRow = (ri: number, id: string) => {
    setRows(rows.map((r, i) => i === ri ? r.filter(x => x !== id) : r).filter(r => r.length > 0));
  };
  const addRow = () => setRows([...rows, []]);
  const removeRow = (ri: number) => setRows(rows.filter((_, i) => i !== ri));

  return (
    <div className="mb-4 p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</p>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Tampilkan</span>
          <input type="checkbox" checked={visible} onChange={e => onVisible(e.target.checked)} className="accent-blue-500" />
        </label>
      </div>

      {visible && (
        <>
          {/* Rows */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>Baris</span>
              <button onClick={addRow}
                className="text-[10px] px-2 py-0.5 rounded border font-medium"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>➕ Baris</button>
            </div>
            {rows.map((row, ri) => (
              <div key={ri} className="mb-1.5 p-1.5 rounded border" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-medium" style={{ color: 'var(--text-secondary)' }}>Baris {ri + 1}</span>
                  <button onClick={() => removeRow(ri)} className="text-[9px] hover:opacity-70" style={{ color: '#ef4444' }}>✕</button>
                </div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {row.map(id => {
                    const info = chartMap.get(id);
                    return (
                      <span key={id} onClick={() => removeFromRow(ri, id)}
                        className="text-[9px] px-1.5 py-0.5 rounded cursor-pointer hover:opacity-70"
                        style={{ background: 'var(--active-bg)', color: 'var(--active-text)' }}>
                        {info?.label ?? id} ✕
                      </span>
                    );
                  })}
                </div>
                {avail.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {avail.slice(0, 6).map(a => (
                      <button key={a.id} onClick={() => addToRow(ri, a.id)}
                        className="text-[8px] px-1 py-0.5 rounded border hover:opacity-70"
                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                        + {a.label}
                      </button>
                    ))}
                    {avail.length > 6 && (
                      <span className="text-[8px]" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>+{avail.length - 6}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <Field label="Gap (px)" value={gap} onChange={onGap} type="number" />
            <SelectField label="Fill" value={fill} onChange={onFill} options={[['ya', 'Ya'], ['tidak', 'Tidak']]} />
            <Field label="Lebar (px)" value={w} onChange={onW} type="number" />
            <Field label="Tinggi (px)" value={h} onChange={onH} type="number" />
          </div>
        </>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type }: { label: string; value: string | number; onChange: (v: any) => void; type: string }) {
  return (
    <div>
      <label className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        className="w-full px-1.5 py-0.5 border rounded text-[11px]"
        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div>
      <label className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-1.5 py-0.5 border rounded text-[11px]"
        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
        {options.map(([val, lbl]) => (
          <option key={val} value={val}>{lbl}</option>
        ))}
      </select>
    </div>
  );
}
