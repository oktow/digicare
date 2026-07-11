export interface User {
  id: number;
  username: string;
  full_name: string;
  role: string;
  is_active: boolean;
  modules?: string[];
  created_at?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface Komplain {
  id: number;
  tanggal_diterima?: string;
  nama?: string;
  alamat?: string;
  instalasi?: string;
  unit_ruang?: string;
  komplain?: string;
  perihal_telaah?: string;
  sarana_komplain?: string;
  grading?: string;
  tindak_lanjut?: string;
  tanggal_diselesaikan?: string;
  status_waktu?: string;
  bukti_tindak_lanjut?: string;
  nama_petugas?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Insiden {
  id: number;
  nama_pasien?: string;
  no_rm?: string;
  unit_tempat_insiden?: string;
  usia_pasien?: string;
  penanggung_biaya?: string;
  jenis_kelamin?: string;
  tgl_masuk_rs?: string;
  tgl_kejadian?: string;
  waktu_insiden?: string;
  kronologi_insiden?: string;
  jenis_insiden?: string;
  spesialisasi?: string;
  dampak_pasien?: string;
  probabilitas?: string;
  pelapor?: string;
  tipe_pasien?: string;
  tempat_insiden?: string;
  unit_penyebab?: string;
  tindak_lanjut_segera?: string;
  tindak_lanjut_oleh?: string;
  pernah_terjadi_sebelumnya?: boolean;
  grading_risiko?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BOR {
  id: number;
  tanggal: string;
  total_tt: number;
  pasien_rawat_inap: number;
  bor_percent?: number;
  sumber_data?: string;
}

export interface WaktuTunggu {
  id: number;
  tanggal: string;
  instalasi?: string;
  unit_ruang?: string;
  rata_rata_menit: number;
  jumlah_pasien?: number;
  sumber_data?: string;
}

export interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface DashboardStats {
  total_komplain: number;
  total_insiden: number;
  avg_waktu_tunggu?: number;
  bor_terakhir?: number;
  komplain_tgl_awal?: string;
  komplain_tgl_akhir?: string;
  insiden_tgl_awal?: string;
  insiden_tgl_akhir?: string;
  komplain_per_grading: { name: string; value: number }[];
  komplain_per_sarana: { name: string; value: number }[];
  komplain_per_instalasi: { name: string; value: number }[];
  komplain_per_bulan: { name: string; value: number }[];
  status_waktu_distribusi: { name: string; value: number }[];
  insiden_per_jenis: { name: string; value: number }[];
  insiden_per_grading: { name: string; value: number }[];
  insiden_per_bulan: { name: string; value: number }[];
  insiden_per_dampak: { name: string; value: number }[];
  insiden_per_probabilitas: { name: string; value: number }[];
  bor_simrs?: number;
  avlos?: number;
  toi?: number;
  bto?: number;
  ndr?: number;
  gdr?: number;
}
