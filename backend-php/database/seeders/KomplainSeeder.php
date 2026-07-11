<?php

namespace Database\Seeders;

use App\Models\Komplain;
use Illuminate\Database\Seeder;
use PhpOffice\PhpSpreadsheet\IOFactory;

class KomplainSeeder extends Seeder
{
    public function run(): void
    {
        if (Komplain::exists()) return;

        $path = $this->findFile('Komplain.xlsx');
        if (!$path) {
            echo "[WARN] Komplain.xlsx not found, skipping\n";
            return;
        }

        try {
            $spreadsheet = IOFactory::load($path);
            $sheet = $spreadsheet->getSheetByName('Mei 2026');
            if (!$sheet) {
                echo "[WARN] Sheet 'Mei 2026' not found in Komplain.xlsx, skipping\n";
                return;
            }
            $rows = $sheet->toArray();
            if (empty($rows)) return;

            $header = array_shift($rows);
            $saranaMap = [
                'langsung' => 'Langsung',
                'hallo murjani' => 'Hallo Murjani',
                'kotak saran' => 'Kotak Saran',
                'kuning' => 'Kuning',
            ];
            $gradingMap = ['hijau' => 'Hijau', 'kuning' => 'Kuning', 'merah' => 'Merah'];
            $statusMap = [
                '> 60 menit' => '>60 Menit',
                'lebih dari 60 menit' => '>60 Menit',
                '< 60 menit' => '<60 Menit',
                'kurang dari 60 menit' => '<60 Menit',
                '>60 menit' => '>60 Menit',
                '>60 Menit' => '>60 Menit',
                '<60 Menit' => '<60 Menit',
            ];

            $count = 0;
            foreach ($rows as $row) {
                if (($row[0] ?? null) === null || $row[0] === '' || $row[0] === 'No') continue;

                try {
                    $saranaRaw = strtolower(trim((string) ($row[7] ?? '')));
                    $sarana = $saranaMap[$saranaRaw] ?? null;
                    if ($sarana === 'Kuning') $sarana = null;

                    $gradingRaw = strtolower(trim((string) ($row[8] ?? '')));
                    $grading = $gradingMap[$gradingRaw] ?? null;

                    $statusRaw = strtolower(trim((string) ($row[12] ?? '')));
                    $status = $statusMap[$statusRaw] ?? '<60 Menit';

                    Komplain::create([
                        'tanggal_diterima' => $this->parseDate($row[1] ?? null),
                        'nama' => substr((string) ($row[2] ?? ''), 0, 100),
                        'alamat' => $row[3] ?? null,
                        'instalasi' => $row[4] ?? null,
                        'unit_ruang' => $row[5] ?? null,
                        'komplain' => $row[6] ?? null,
                        'perihal_telaah' => $row[13] ?? null,
                        'sarana_komplain' => $sarana,
                        'grading' => $grading,
                        'tindak_lanjut' => $row[9] ?? null,
                        'tanggal_diselesaikan' => $this->parseDate($row[10] ?? null),
                        'status_waktu' => $status,
                        'bukti_tindak_lanjut' => $row[14] ?? null,
                        'nama_petugas' => substr((string) ($row[11] ?? ''), 0, 100),
                        'created_by' => 1,
                    ]);
                    $count++;
                } catch (\Exception $e) {
                    echo "[WARN] Skip row: {$e->getMessage()}\n";
                }
            }

            echo "[OK] Komplain seeded: {$count} records\n";
        } catch (\Exception $e) {
            echo "[WARN] Cannot read Komplain.xlsx: {$e->getMessage()}\n";
        }
    }

    private function parseDate($val): ?string
    {
        if (!$val) return null;
        if ($val instanceof \DateTime || $val instanceof \DateTimeImmutable) {
            return $val->format('Y-m-d');
        }
        if (is_string($val) && strtotime($val)) {
            return date('Y-m-d', strtotime($val));
        }
        if (is_numeric($val)) {
            $unix = ($val - 25569) * 86400;
            return date('Y-m-d', (int) $unix);
        }
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
