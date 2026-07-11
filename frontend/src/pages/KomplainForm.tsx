import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { komplainAPI } from '../api/client';

export default function KomplainForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    tanggal_diterima: '', nama: '', alamat: '', instalasi: 'IRJ',
    unit_ruang: '', komplain: '', perihal_telaah: '', sarana_komplain: 'Langsung',
    grading: 'Hijau', tindak_lanjut: '', tanggal_diselesaikan: '',
    status_waktu: '', bukti_tindak_lanjut: '', nama_petugas: '',
  });

  useEffect(() => {
    if (isEdit) {
      komplainAPI.get(Number(id)).then((res) => {
        const d = res.data;
        setForm({
          ...d,
          tanggal_diterima: d.tanggal_diterima || '',
          tanggal_diselesaikan: d.tanggal_diselesaikan || '',
        });
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      payload.tanggal_diterima = payload.tanggal_diterima || null;
      payload.tanggal_diselesaikan = payload.tanggal_diselesaikan || null;
      if (isEdit) {
        await komplainAPI.update(Number(id), payload);
      } else {
        await komplainAPI.create(payload);
      }
      navigate('/komplain');
    } catch (err) {
      alert('Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{isEdit ? 'Edit Komplain' : 'Tambah Komplain'}</h1>
      <form onSubmit={handleSubmit} className="p-6 rounded-xl border space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Tanggal Diterima"><input type="date" name="tanggal_diterima" value={form.tanggal_diterima} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} /></FormField>
          <FormField label="Instalasi"><select name="instalasi" value={form.instalasi} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}><option value="IRJ">IRJ</option><option value="Ranap">Ranap</option><option value="IGD">IGD</option></select></FormField>
        </div>
        <FormField label="Nama Pasien"><input type="text" name="nama" value={form.nama} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} /></FormField>
        <FormField label="Alamat"><input type="text" name="alamat" value={form.alamat} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Unit/Ruang"><input type="text" name="unit_ruang" value={form.unit_ruang} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} /></FormField>
          <FormField label="Sarana Komplain"><select name="sarana_komplain" value={form.sarana_komplain} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}><option value="Langsung">Langsung</option><option value="Hallo Murjani">Hallo Murjani</option><option value="Kotak Saran">Kotak Saran</option></select></FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Grading"><select name="grading" value={form.grading} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}><option value="Hijau">Hijau</option><option value="Kuning">Kuning</option><option value="Merah">Merah</option></select></FormField>
          <FormField label="Nama Petugas"><input type="text" name="nama_petugas" value={form.nama_petugas} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} /></FormField>
        </div>
        <FormField label="Isi Komplain"><textarea name="komplain" value={form.komplain} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} /></FormField>
        <FormField label="Perihal/Telaah"><textarea name="perihal_telaah" value={form.perihal_telaah} onChange={handleChange} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} /></FormField>
        <FormField label="Tindak Lanjut"><textarea name="tindak_lanjut" value={form.tindak_lanjut} onChange={handleChange} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Tanggal Diselesaikan"><input type="date" name="tanggal_diselesaikan" value={form.tanggal_diselesaikan} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} /></FormField>
          <FormField label="Status Waktu"><select name="status_waktu" value={form.status_waktu} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}><option value="">Pilih</option><option value="&lt;60 Menit">&lt; 60 Menit</option><option value="&gt;60 Menit">&gt; 60 Menit</option></select></FormField>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: '#2563eb' }}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
          <button type="button" onClick={() => navigate('/komplain')} className="px-6 py-2.5 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>Batal</button>
        </div>
      </form>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      {children}
    </div>
  );
}
