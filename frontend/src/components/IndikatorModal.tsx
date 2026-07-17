import { useState, useEffect } from 'react';
import { indikatorAPI } from '../api/client';
import type { IndikatorItem } from '../types';

const DEFAULT_ROWS = [['bor_simrs', 'avlos', 'toi'], ['bto', 'ndr', 'gdr']];

function loadRows(): string[][] {
  try {
    const raw = localStorage.getItem('indicator_rows');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  // fallback: migrate from old indicator_selected
  try {
    const old = JSON.parse(localStorage.getItem('indicator_selected') || '[]');
    if (Array.isArray(old) && old.length) return [old];
  } catch {}
  return DEFAULT_ROWS;
}

function toHex(v: string | null): string | null {
  if (!v) return null;
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  if (/^#[0-9a-fA-F]{3}$/.test(v)) return '#' + v[1]+v[1]+v[2]+v[2]+v[3]+v[3];
  return null;
}

export default function IndikatorModal({ onClose }: { onClose: () => void }) {
  const [indicators, setIndicators] = useState<IndikatorItem[]>([]);
  const [style, setStyle] = useState<'box' | 'hexagon'>(() => (localStorage.getItem('indicator_style') as 'box' | 'hexagon') || 'hexagon');
  const [rows, setRows] = useState<string[][]>(loadRows);

  // Box settings
  const [boxGap, setBoxGap] = useState(() => Number(localStorage.getItem('box_gap')) || 12);
  const [boxW, setBoxW] = useState(() => Number(localStorage.getItem('box_width')) || 0);
  const [boxH, setBoxH] = useState(() => Number(localStorage.getItem('box_height')) || 0);
  const [boxFill, setBoxFill] = useState(() => localStorage.getItem('box_fill') || 'ya');
  const [boxLabelSize, setBoxLabelSize] = useState(() => Number(localStorage.getItem('box_label_size')) || 10);
  const [boxValueSize, setBoxValueSize] = useState(() => Number(localStorage.getItem('box_value_size')) || 14);
  const [boxLabelColor, setBoxLabelColor] = useState(() => toHex(localStorage.getItem('box_label_color')) || '#94a3b8');
  const [boxValueColor, setBoxValueColor] = useState(() => toHex(localStorage.getItem('box_value_color')) || '#e2e8f0');
  const [boxCardBg, setBoxCardBg] = useState(() => localStorage.getItem('box_card_bg') || 'var(--bg-card)');

  // Hex settings
  const [hexX, setHexX] = useState(() => Number(localStorage.getItem('hex_offset_x')) || 53);
  const [hexY, setHexY] = useState(() => Number(localStorage.getItem('hex_offset_y')) || -30);
  const [hexGap, setHexGap] = useState(() => Number(localStorage.getItem('hex_gap')) || 4);
  const [hexW, setHexW] = useState(() => Number(localStorage.getItem('hex_width')) || 104);
  const [hexH, setHexH] = useState(() => Number(localStorage.getItem('hex_height')) || 120);
  const [hexFill, setHexFill] = useState(() => localStorage.getItem('hex_fill') || 'ya');
  const [hexLabelSize, setHexLabelSize] = useState(() => Number(localStorage.getItem('hex_label_size')) || 9);
  const [hexValueSize, setHexValueSize] = useState(() => Number(localStorage.getItem('hex_value_size')) || 12);
  const [hexLabelColor, setHexLabelColor] = useState(() => toHex(localStorage.getItem('hex_label_color')) || '#ffffff');
  const [hexValueColor, setHexValueColor] = useState(() => toHex(localStorage.getItem('hex_value_color')) || '#ffffff');

  useEffect(() => {
    indikatorAPI.list().then(res => setIndicators(res.data.indicators)).catch(() => {});
  }, []);

  const usedIds = new Set(rows.flat());
  const available = indicators.filter(i => !usedIds.has(i.id));

  const addToRow = (rowIdx: number, id: string) => {
    setRows(prev => {
      const next = prev.map((r, i) => i === rowIdx ? [...r, id] : r);
      return next;
    });
  };

  const removeFromRow = (rowIdx: number, id: string) => {
    setRows(prev => {
      const next = prev.map((r, i) => i === rowIdx ? r.filter(x => x !== id) : r);
      return next.filter(r => r.length > 0);
    });
  };

  const addRow = () => setRows(prev => [...prev, []]);

  const removeRow = (rowIdx: number) => {
    setRows(prev => prev.filter((_, i) => i !== rowIdx));
  };

  const save = () => {
    localStorage.setItem('indicator_style', style);
    localStorage.setItem('indicator_rows', JSON.stringify(rows));
    localStorage.removeItem('indicator_selected');
    localStorage.setItem('box_gap', String(boxGap));
    localStorage.setItem('box_width', String(boxW));
    localStorage.setItem('box_height', String(boxH));
    localStorage.setItem('box_fill', boxFill);
    localStorage.setItem('box_label_size', String(boxLabelSize));
    localStorage.setItem('box_value_size', String(boxValueSize));
    localStorage.setItem('box_label_color', boxLabelColor);
    localStorage.setItem('box_value_color', boxValueColor);
    localStorage.setItem('box_card_bg', boxCardBg);
    localStorage.setItem('hex_offset_x', String(hexX));
    localStorage.setItem('hex_offset_y', String(hexY));
    localStorage.setItem('hex_gap', String(hexGap));
    localStorage.setItem('hex_width', String(hexW));
    localStorage.setItem('hex_height', String(hexH));
    localStorage.setItem('hex_fill', hexFill);
    localStorage.setItem('hex_label_size', String(hexLabelSize));
    localStorage.setItem('hex_value_size', String(hexValueSize));
    localStorage.setItem('hex_label_color', hexLabelColor);
    localStorage.setItem('hex_value_color', hexValueColor);
    window.dispatchEvent(new CustomEvent('hex-settings-changed'));
    window.dispatchEvent(new CustomEvent('indicator-settings-changed'));
    onClose();
  };

  const reset = () => {
    ['indicator_style','indicator_rows','indicator_selected','box_gap','box_width','box_height','box_fill',
     'box_label_size','box_value_size','box_label_color','box_value_color','box_card_bg',
     'hex_offset_x','hex_offset_y','hex_gap','hex_width','hex_height','hex_fill',
     'hex_label_size','hex_value_size','hex_label_color','hex_value_color'].forEach(k => localStorage.removeItem(k));
    setStyle('hexagon');
    setRows(DEFAULT_ROWS);
    setBoxGap(12); setBoxW(0); setBoxH(0); setBoxFill('ya');
    setBoxLabelSize(10); setBoxValueSize(14);
    setBoxLabelColor('#94a3b8'); setBoxValueColor('#e2e8f0'); setBoxCardBg('var(--bg-card)');
    setHexX(53); setHexY(-30); setHexGap(4); setHexW(104); setHexH(120); setHexFill('ya');
    setHexLabelSize(9); setHexValueSize(12);
    setHexLabelColor('#ffffff'); setHexValueColor('#ffffff');
  };

  const indicatorMap = new Map(indicators.map(i => [i.id, i]));
  const groups = indicators.reduce<Record<string, IndikatorItem[]>>((acc, i) => {
    (acc[i.group] ??= []).push(i);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
      <div className="relative p-5 rounded-xl border max-h-[85vh] overflow-y-auto w-[580px]" onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <p className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Pengaturan Indikator RS</p>

        {/* Style toggle */}
        <div className="mb-4">
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Tampilan</p>
          <div className="flex gap-2">
            {(['box', 'hexagon'] as const).map(s => (
              <button key={s} onClick={() => setStyle(s)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all"
                style={{
                  background: style === s ? 'var(--active-bg)' : 'transparent',
                  color: style === s ? 'var(--active-text)' : 'var(--text-secondary)',
                  borderColor: style === s ? 'transparent' : 'var(--border-color)',
                }}>
                {s === 'box' ? 'Box' : 'Hexagon'}
              </button>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Baris Indikator</p>
            <button onClick={addRow}
              className="text-[10px] px-2 py-0.5 rounded border font-medium"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              ➕ Baris
            </button>
          </div>
          {rows.map((row, ri) => (
            <div key={ri} className="mb-2 p-2 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>Baris {ri + 1}</span>
                <button onClick={() => removeRow(ri)} className="text-[10px] hover:opacity-70" style={{ color: '#ef4444' }}>✕</button>
              </div>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {row.map(id => {
                  const info = indicatorMap.get(id);
                  return (
                    <span key={id} onClick={() => removeFromRow(ri, id)}
                      className="text-[10px] px-1.5 py-0.5 rounded cursor-pointer hover:opacity-70"
                      style={{ background: 'var(--active-bg)', color: 'var(--active-text)' }}>
                      {info?.label ?? id} ✕
                    </span>
                  );
                })}
              </div>
              {available.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {available.slice(0, 8).map(a => (
                    <button key={a.id} onClick={() => addToRow(ri, a.id)}
                      className="text-[9px] px-1 py-0.5 rounded border hover:opacity-70"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                      + {a.label}
                    </button>
                  ))}
                  {available.length > 8 && (
                    <span className="text-[9px]" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                      +{available.length - 8} lainnya
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Available pool */}
        {available.length > 0 && (
          <details className="mb-4">
            <summary className="text-[10px] font-medium cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
              Semua Indikator ({available.length} tersedia)
            </summary>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {Object.entries(groups).map(([group, items]) => (
                <div key={group} className="mr-2">
                  <p className="text-[9px] mb-0.5" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>{group}</p>
                  <div className="flex flex-wrap gap-1">
                    {items.filter(i => available.find(a => a.id === i.id)).map(a => (
                      <button key={a.id} onClick={() => { if (rows.length) addToRow(0, a.id); }}
                        className="text-[9px] px-1 py-0.5 rounded border hover:opacity-70"
                        style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                        + {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Style-specific settings */}
        {style === 'box' ? (
          <div className="space-y-2 p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Setting Box</p>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Gap (px)" value={boxGap} onChange={v => setBoxGap(v)} type="number" />
              <SelectField label="Fill" value={boxFill} onChange={v => setBoxFill(v)} options={[['ya', 'Ya'], ['tidak', 'Tidak']]} />
              <Field label="Lebar (px)" value={boxW} onChange={v => setBoxW(v)} type="number" />
              <Field label="Tinggi (px)" value={boxH} onChange={v => setBoxH(v)} type="number" />
              <Field label="Label (px)" value={boxLabelSize} onChange={v => setBoxLabelSize(v)} type="number" />
              <Field label="Nilai (px)" value={boxValueSize} onChange={v => setBoxValueSize(v)} type="number" />
              <ColorField label="Label color" value={boxLabelColor} onChange={v => setBoxLabelColor(v)} />
              <ColorField label="Nilai color" value={boxValueColor} onChange={v => setBoxValueColor(v)} />
              <Field label="Card BG" value={boxCardBg} onChange={v => setBoxCardBg(v)} type="text" />
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Setting Hexagon</p>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Geser X" value={hexX} onChange={v => setHexX(v)} type="number" />
              <Field label="Geser Y" value={hexY} onChange={v => setHexY(v)} type="number" />
              <Field label="Celah" value={hexGap} onChange={v => setHexGap(v)} type="number" />
              <SelectField label="Fill" value={hexFill} onChange={v => setHexFill(v)} options={[['ya', 'Ya'], ['tidak', 'Tidak']]} />
              <Field label="Lebar" value={hexW} onChange={v => setHexW(v)} type="number" />
              <Field label="Tinggi" value={hexH} onChange={v => setHexH(v)} type="number" />
              <Field label="Label (px)" value={hexLabelSize} onChange={v => setHexLabelSize(v)} type="number" />
              <Field label="Nilai (px)" value={hexValueSize} onChange={v => setHexValueSize(v)} type="number" />
              <ColorField label="Label color" value={hexLabelColor} onChange={v => setHexLabelColor(v)} />
              <ColorField label="Nilai color" value={hexValueColor} onChange={v => setHexValueColor(v)} />
            </div>
          </div>
        )}

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

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <div className="flex items-center gap-1">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="w-8 h-6 p-0 border rounded cursor-pointer"
          style={{ borderColor: 'var(--border-color)', background: 'transparent' }} />
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="flex-1 px-1.5 py-0.5 border rounded text-[11px] font-mono"
          style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
      </div>
    </div>
  );
}
