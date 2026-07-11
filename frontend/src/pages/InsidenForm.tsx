import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { insidenAPI } from '../api/client';

const inputStyle = { background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' } as const;

export default function InsidenForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    nama_pasien: '', no_rm: '', unit_tempat_insiden: '', usia_pasien: '',
    penanggung_biaya: 'BPJS', jenis_kelamin: '', tgl_masuk_rs: '', tgl_kejadian: '',
    waktu_insiden: '', kronologi_insiden: '', jenis_insiden: '', spesialisasi: '',
    dampak_pasien: '', probabilitas: '', pelapor: 'Karyawan', tipe_pasien: 'Rawat_Inap',
    tempat_insiden: '', unit_penyebab: '', tindak_lanjut_segera: '', tindak_lanjut_oleh: '',
    pernah_terjadi_sebelumnya: false, grading_risiko: '',
  });

  useEffect(() => {
    if (isEdit) {
      insidenAPI.get(Number(id)).then((res) => {
        const d = res.data;
        setForm({ ...d, tgl_masuk_rs: d.tgl_masuk_rs || '', tgl_kejadian: d.tgl_kejadian || '' });
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    setForm({ ...form, [target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, tgl_masuk_rs: form.tgl_masuk_rs || null, tgl_kejadian: form.tgl_kejadian || null, waktu_insiden: form.waktu_insiden || null };
      if (isEdit) await insidenAPI.update(Number(id), payload);
      else await insidenAPI.create(payload);
      navigate('/insiden');
    } catch { alert('Gagal menyimpan data'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{isEdit ? 'Edit Insiden' : 'Tambah Insiden'}</h1>
      <form onSubmit={handleSubmit} className="p-6 rounded-xl border space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nama Pasien*"><input type="text" name="nama_pasien" value={form.nama_pasien} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} required /></Field>
          <Field label="No RM"><input type="text" name="no_rm" value={form.no_rm} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} /></Field>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Usia"><select name="usia_pasien" value={form.usia_pasien} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle}><option value="">Pilih</option><option value="kurang_1_bulan">&lt; 1 Bulan</option><option value="lebih_1_bulan">&gt; 1 Bulan</option><option value="lebih_1_tahun">&gt; 1 Tahun</option></select></Field>
          <Field label="JK"><select name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle}><option value="">Pilih</option><option value="Laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></Field>
          <Field label="Penanggung Biaya"><select name="penanggung_biaya" value={form.penanggung_biaya} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle}><option value="BPJS">BPJS</option><option value="Jamkesda">Jamkesda</option><option value="Umum">Umum/Pribadi</option><option value="Asuransi_Swasta">Asuransi Swasta</option></select></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tgl Masuk RS"><input type="date" name="tgl_masuk_rs" value={form.tgl_masuk_rs} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} /></Field>
          <Field label="Tgl Kejadian"><input type="date" name="tgl_kejadian" value={form.tgl_kejadian} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} /></Field>
        </div>
        <Field label="Unit/Tempat Insiden"><input type="text" name="unit_tempat_insiden" value={form.unit_tempat_insiden} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} /></Field>
        <Field label="Jenis Insiden*"><select name="jenis_insiden" value={form.jenis_insiden} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} required><option value="">Pilih</option><option value="KNC">KNC</option><option value="KTC">KTC</option><option value="KTD">KTD</option><option value="Sentinel">Sentinel</option><option value="KPCS">KPCS</option></select></Field>
        <Field label="Kronologi Insiden"><textarea name="kronologi_insiden" value={form.kronologi_insiden} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Dampak"><select name="dampak_pasien" value={form.dampak_pasien} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle}><option value="">Pilih</option><option value="Kematian">Kematian</option><option value="Cedera_Berat">Cedera Berat</option><option value="Cedera_Sedang">Cedera Sedang</option><option value="Cedera_Ringan">Cedera Ringan</option><option value="Tidak_Ada">Tidak Ada Cedera</option></select></Field>
          <Field label="Probabilitas"><select name="probabilitas" value={form.probabilitas} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle}><option value="">Pilih</option><option value="Sangat_Jarang">Sangat Jarang</option><option value="Jarang">Jarang</option><option value="Mungkin">Mungkin</option><option value="Sering">Sering</option><option value="Sangat_Sering">Sangat Sering</option></select></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Pelapor"><select name="pelapor" value={form.pelapor} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle}><option value="Karyawan">Karyawan</option><option value="Pasien">Pasien</option><option value="Keluarga">Keluarga</option><option value="Pengunjung">Pengunjung</option></select></Field>
          <Field label="Tipe Pasien"><select name="tipe_pasien" value={form.tipe_pasien} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle}><option value="Rawat_Inap">Rawat Inap</option><option value="Rawat_Jalan">Rawat Jalan</option><option value="UGD">UGD</option></select></Field>
        </div>
        <Field label="Tindak Lanjut Segera"><textarea name="tindak_lanjut_segera" value={form.tindak_lanjut_segera} onChange={handleChange} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Grading Risiko"><select name="grading_risiko" value={form.grading_risiko} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" style={inputStyle}><option value="">Pilih</option><option value="Biru">Biru</option><option value="Hijau">Hijau</option><option value="Kuning">Kuning</option><option value="Merah">Merah</option></select></Field>
          <Field label="Pernah Terjadi?">
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-primary)' }}><input type="radio" name="pernah_terjadi_sebelumnya" checked={form.pernah_terjadi_sebelumnya === true} onChange={() => setForm({...form, pernah_terjadi_sebelumnya: true})} className="mr-1" /> Ya</label>
              <label className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-primary)' }}><input type="radio" name="pernah_terjadi_sebelumnya" checked={form.pernah_terjadi_sebelumnya === false} onChange={() => setForm({...form, pernah_terjadi_sebelumnya: false})} className="mr-1" /> Tidak</label>
            </div>
          </Field>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50" style={{ background: '#2563eb' }}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
          <button type="button" onClick={() => navigate('/insiden')} className="px-6 py-2.5 border rounded-lg text-sm" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>Batal</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div><label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</label>{children}</div>
  );
}