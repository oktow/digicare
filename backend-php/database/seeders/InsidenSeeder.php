<?php

namespace Database\Seeders;

use App\Models\Insiden;
use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;

class InsidenSeeder extends Seeder
{
    public function run(): void
    {
        if (Insiden::exists()) return;

        $path = $this->findFile('insiden.xlsx');
        if (!$path) {
            echo "[WARN] insiden.xlsx not found, skipping\n";
            return;
        }

        try {
            $spreadsheet = IOFactory::load($path);
            $sheet = $spreadsheet->getSheetByName('Insiden');
            if (!$sheet) {
                echo "[WARN] Sheet 'Insiden' not found, skipping\n";
                return;
            }
            $rows = $sheet->toArray();
            if (empty($rows)) return;

            $df = $rows;

            $namaPasien = $this->cellValue($df, 3, 0);
            if (!$namaPasien || $namaPasien === 'Nama Pasien*') {
                echo "[WARN] insiden.xlsx is a blank template (no data), skipping\n";
                return;
            }

            $insidenMap = [
                "KNC ( kejadian Nyaris Cedera ) : terjadi kesalahan, namun belum terpapar kepada pasien" => "KNC",
                "KTC (kejadian Tidak Cedera ) : terjadi kesalahan & sudah terpapar kepada pasien namun tidak menimbulkan cedera" => "KTC",
                "KTD (kejadian Tidak Diharapkan ) : terjadi kesalahan & sudah terpapar hingga pasien mengalami cedera berat seperti luka, cacat, penambahan masa rawat dll" => "KTD",
                "Sentinel : kejadian yang menyebabkan pasien meninggal" => "Sentinel",
                "KPCS (Kejadian Potensial Cedera Serius/Significant) : terdapat suatu keadaan yang berpotensi menimbulkan cedera/kematian pada pasien/petugas" => "KPCS",
            ];
            $dampakMap = [
                "Kematian" => "Kematian",
                "Cedera Berat ( cedera yang mengakibatkan pasien menambah masa perawatan/kecacatan" => "Cedera Berat",
                "Cedera Sedang (cedera yang memerlukan pengobatan lebih lanjut)" => "Cedera Sedang",
                "Cedera Ringan (cedera yang tidak memerlukan pengobatan lebih lanjut)" => "Cedera Ringan",
                "Tidak ada Cedera" => "Tidak ada Cedera",
            ];
            $probMap = [
                "Sangat Jarang (> 5 th/kali)" => "Sangat Jarang",
                "Jarang (> 2 - 5 th/kali)" => "Jarang",
                "Mungkin (1 - 2 th/kali)" => "Mungkin",
                "Sering (beberapa kali/th)" => "Sering",
                "Sangat Sering (tiap minggu/bulan)" => "Sangat Sering",
            ];
            $gradingMap = ["Biru" => "Biru", "Hijau" => "Hijau", "Kuning" => "Kuning", "Merah" => "Merah"];

            $noRm = $this->cellValue($df, 4, 0);
            if ($noRm === 'No RM*') $noRm = null;

            Insiden::create([
                'nama_pasien' => $namaPasien,
                'no_rm' => $noRm,
                'unit_tempat_insiden' => $this->cellValue($df, 5, 0),
                'usia_pasien' => $this->findSelected($df, 6, ['< 1 Bulan', '> 1 Bulan', '> 1 Tahun']),
                'penanggung_biaya' => $this->findSelected($df, 7, ['BPJS', 'Jamkesda', 'Umum/Pribadi', 'Asuransi Swasta', 'Pemerintah', 'Perusahaan', 'Yang lain']),
                'jenis_kelamin' => $this->findSelected($df, 8, ['Laki-laki', 'Perempuan']),
                'tgl_masuk_rs' => $this->parseDate($this->cellValue($df, 9, 0)),
                'tgl_kejadian' => $this->parseDate($this->cellValue($df, 10, 0)),
                'waktu_insiden' => $this->parseTime($this->cellValue($df, 11, 0)),
                'kronologi_insiden' => $this->cellValue($df, 12, 0),
                'jenis_insiden' => $this->findMapped($df, 13, $insidenMap),
                'spesialisasi' => $this->findSelected($df, 14, null),
                'dampak_pasien' => $this->findMapped($df, 15, $dampakMap),
                'probabilitas' => $this->findMapped($df, 16, $probMap),
                'pelapor' => $this->findSelected($df, 17, ['Karyawan', 'Pasien', 'Keluarga/Pendamping Pasien', 'Pengunjung', 'Yang lain']),
                'tipe_pasien' => $this->findSelected($df, 18, ['Pasien Rawat Inap', 'Pasien Rawat Jalan', 'Pasien UGD', 'Yang lain']),
                'tempat_insiden' => $this->cellValue($df, 19, 0),
                'unit_penyebab' => $this->cellValue($df, 20, 0),
                'tindak_lanjut_segera' => $this->cellValue($df, 21, 0),
                'tindak_lanjut_oleh' => $this->findSelected($df, 22, ["Tim (dokter,Perawat&Petugas lainnya)", "Dokter", "Perawat", "Yang lain"]),
                'pernah_terjadi_sebelumnya' => $this->boolFromYesNo($this->findSelected($df, 23, ["Ya", "Tidak"])),
                'grading_risiko' => $this->findMapped($df, 24, $gradingMap),
                'created_by' => 1,
            ]);

            echo "[OK] Insiden seeded: 1 record (nama={$namaPasien})\n";
        } catch (\Exception $e) {
            echo "[WARN] Error seeding insiden: {$e->getMessage()}\n";
        }
    }

    private function cellValue(array $df, int $row, int $col): ?string
    {
        if (!isset($df[$row][$col])) return null;
        $val = $df[$row][$col];
        if ($val === null || $val === '') return null;
        $s = trim((string) $val);
        return $s === '' ? null : $s;
    }

    private function findSelected(array $df, int $row, ?array $validValues): ?string
    {
        if (!isset($df[$row])) return null;
        foreach ($df[$row] as $cell) {
            if ($cell !== null && trim((string) $cell) !== '') {
                $s = trim((string) $cell);
                if ($validValues === null || in_array($s, $validValues)) return $s;
            }
        }
        return null;
    }

    private function findMapped(array $df, int $row, array $mapping): ?string
    {
        if (!isset($df[$row])) return null;
        foreach ($df[$row] as $cell) {
            if ($cell !== null && trim((string) $cell) !== '') {
                $s = trim((string) $cell);
                if (isset($mapping[$s])) return $mapping[$s];
            }
        }
        return null;
    }

    private function parseDate(?string $val): ?string
    {
        if (!$val) return null;
        if (strtotime($val)) return date('Y-m-d', strtotime($val));
        return null;
    }

    private function parseTime(?string $val): ?string
    {
        if (!$val) return null;
        if (strtotime($val)) return date('H:i:s', strtotime($val));
        return null;
    }

    private function boolFromYesNo(?string $val): ?bool
    {
        if ($val === 'Ya') return true;
        if ($val === 'Tidak') return false;
        return null;
    }

    private function findFile(string $filename): ?string
    {
        $paths = [
            __DIR__ . '/../../seed_data/' . $filename,
            __DIR__ . '/../../' . $filename,
            __DIR__ . '/../../../' . $filename,
            __DIR__ . '/../../../../' . $filename,
        ];
        foreach ($paths as $p) {
            if (file_exists($p)) return $p;
        }
        return null;
    }
}
