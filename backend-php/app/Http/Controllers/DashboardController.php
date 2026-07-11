<?php

namespace App\Http\Controllers;

use App\Models\BOR;
use App\Models\Insiden;
use App\Models\Komplain;
use App\Models\WaktuTunggu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filterYear = $request->tahun ?? date('Y');
        $tglAwal = $request->tgl_awal ?? date('Y-m-d');
        $tglAkhir = $request->tgl_akhir ?? date('Y-m-d');
        $totalKomplain = Komplain::query();
        $komplainTglAwal = $request->has('komplain_tgl_awal') ? $request->komplain_tgl_awal : null;
        $komplainTglAkhir = $request->has('komplain_tgl_akhir') ? $request->komplain_tgl_akhir : null;
        if ($komplainTglAwal) $totalKomplain->whereDate('tanggal_diterima', '>=', $komplainTglAwal);
        if ($komplainTglAkhir) $totalKomplain->whereDate('tanggal_diterima', '<=', $komplainTglAkhir);
        if (!$komplainTglAwal && !$komplainTglAkhir) $totalKomplain->whereYear('tanggal_diterima', $filterYear);
        $totalKomplain = $totalKomplain->count();
        $totalInsiden = Insiden::query();
        $insidenTglAwal = $request->has('insiden_tgl_awal') ? $request->insiden_tgl_awal : null;
        $insidenTglAkhir = $request->has('insiden_tgl_akhir') ? $request->insiden_tgl_akhir : null;
        if ($insidenTglAwal) $totalInsiden->whereDate('tgl_kejadian', '>=', $insidenTglAwal);
        if ($insidenTglAkhir) $totalInsiden->whereDate('tgl_kejadian', '<=', $insidenTglAkhir);
        if (!$insidenTglAwal && !$insidenTglAkhir) $totalInsiden->whereYear('tgl_kejadian', $filterYear);
        $totalInsiden = $totalInsiden->count();

        $avgWaktu = WaktuTunggu::avg('rata_rata_menit');
        $avgWaktuTunggu = $avgWaktu ? round((float) $avgWaktu, 1) : null;

        $borTerakhir = BOR::orderBy('tanggal', 'desc')->first();
        $borVal = $borTerakhir?->bor_percent;

        $gradingRaw = Komplain::selectRaw('grading as name, COUNT(*) as value')
            ->whereYear('tanggal_diterima', $filterYear)
            ->groupBy('grading')
            ->get()
            ->keyBy('name');

        $komplainPerGrading = [];
        foreach (['Hijau', 'Kuning', 'Merah'] as $g) {
            $komplainPerGrading[] = [
                'name' => $g,
                'value' => (int) ($gradingRaw[$g]->value ?? 0),
            ];
        }

        $saranaRaw = Komplain::selectRaw('sarana_komplain as name, COUNT(*) as value')
            ->whereYear('tanggal_diterima', $filterYear)
            ->groupBy('sarana_komplain')
            ->get()
            ->keyBy('name');

        $saranaDisplay = ['Langsung' => 'Langsung', 'Hallo_Murjani' => 'Hallo Murjani', 'Kotak_Saran' => 'Kotak Saran'];
        $komplainPerSarana = [];
        foreach (['Langsung', 'Hallo_Murjani', 'Kotak_Saran'] as $s) {
            $komplainPerSarana[] = [
                'name' => $saranaDisplay[$s],
                'value' => (int) ($saranaRaw[$s]->value ?? 0),
            ];
        }

        $komplainPerInstalasi = Komplain::selectRaw('instalasi as name, COUNT(*) as value')
            ->whereYear('tanggal_diterima', $filterYear)
            ->groupBy('instalasi')
            ->get()
            ->map(fn($r) => ['name' => $r->name ?? 'Unknown', 'value' => (int) $r->value]);

        $bulanNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

        $komplainPerBulan = $this->getMonthlyCounts(Komplain::class, 'tanggal_diterima', $filterYear, $bulanNames);

        $statusDistribusi = [];
        $statusMap = ['kurang_60' => '<60 Menit', 'lebih_60' => '>60 Menit'];
        $statusRaw = Komplain::selectRaw('status_waktu as name, COUNT(*) as value')
            ->whereYear('tanggal_diterima', $filterYear)
            ->groupBy('status_waktu')
            ->get();
        foreach ($statusRaw as $r) {
            $statusDistribusi[] = [
                'name' => $statusMap[$r->name] ?? $r->name ?? 'Unknown',
                'value' => (int) $r->value,
            ];
        }

        $jenisRaw = Insiden::selectRaw('jenis_insiden as name, COUNT(*) as value')
            ->whereYear('tgl_kejadian', $filterYear)
            ->groupBy('jenis_insiden')
            ->get()
            ->keyBy('name');

        $insidenPerJenis = [];
        foreach (['KNC', 'KTC', 'KTD', 'Sentinel', 'KPCS'] as $j) {
            $insidenPerJenis[] = [
                'name' => $j,
                'value' => (int) ($jenisRaw[$j]->value ?? 0),
            ];
        }

        $gradingInsidenRaw = Insiden::selectRaw('grading_risiko as name, COUNT(*) as value')
            ->whereYear('tgl_kejadian', $filterYear)
            ->groupBy('grading_risiko')
            ->get()
            ->keyBy('name');

        $insidenPerGrading = [];
        foreach (['Biru', 'Hijau', 'Kuning', 'Merah'] as $g) {
            $insidenPerGrading[] = [
                'name' => $g,
                'value' => (int) ($gradingInsidenRaw[$g]->value ?? 0),
            ];
        }

        $insidenPerBulan = $this->getMonthlyCounts(Insiden::class, 'tgl_kejadian', $filterYear, $bulanNames);

        $dampakRaw = Insiden::selectRaw('dampak_pasien as name, COUNT(*) as value')
            ->whereYear('tgl_kejadian', $filterYear)
            ->groupBy('dampak_pasien')
            ->get()
            ->keyBy('name');

        $dampakOrder = ['Kematian', 'Cedera_Berat', 'Cedera_Sedang', 'Cedera_Ringan', 'Tidak_Ada'];
        $insidenPerDampak = [];
        foreach ($dampakOrder as $d) {
            $insidenPerDampak[] = [
                'name' => str_replace('_', ' ', $d),
                'value' => (int) ($dampakRaw[$d]->value ?? 0),
            ];
        }

        $probRaw = Insiden::selectRaw('probabilitas as name, COUNT(*) as value')
            ->whereYear('tgl_kejadian', $filterYear)
            ->groupBy('probabilitas')
            ->get()
            ->keyBy('name');

        $probOrder = ['Sangat_Jarang', 'Jarang', 'Mungkin', 'Sering', 'Sangat_Sering'];
        $insidenPerProb = [];
        foreach ($probOrder as $p) {
            $insidenPerProb[] = [
                'name' => str_replace('_', ' ', $p),
                'value' => (int) ($probRaw[$p]->value ?? 0),
            ];
        }

        $simrs = $this->fetchSimrsRealtime($tglAwal, $tglAkhir);

        return response()->json([
            'tgl_awal' => $tglAwal,
            'tgl_akhir' => $tglAkhir,
            'komplain_tgl_awal' => $komplainTglAwal ?? date('Y-m-d'),
            'komplain_tgl_akhir' => $komplainTglAkhir ?? date('Y-m-d'),
            'total_komplain' => $totalKomplain,
            'insiden_tgl_awal' => $insidenTglAwal ?? date('Y-m-d'),
            'insiden_tgl_akhir' => $insidenTglAkhir ?? date('Y-m-d'),
            'total_insiden' => $totalInsiden,
            'avg_waktu_tunggu' => $avgWaktuTunggu,
            'bor_terakhir' => $borVal,
            'komplain_per_grading' => $komplainPerGrading,
            'komplain_per_sarana' => $komplainPerSarana,
            'komplain_per_instalasi' => $komplainPerInstalasi,
            'komplain_per_bulan' => $komplainPerBulan,
            'status_waktu_distribusi' => $statusDistribusi,
            'insiden_per_jenis' => $insidenPerJenis,
            'insiden_per_grading' => $insidenPerGrading,
            'insiden_per_bulan' => $insidenPerBulan,
            'insiden_per_dampak' => $insidenPerDampak,
            'insiden_per_probabilitas' => $insidenPerProb,
            'bor_simrs' => $simrs['bor_simrs'] ?? null,
            'avlos' => $simrs['avlos'] ?? null,
            'toi' => $simrs['toi'] ?? null,
            'bto' => $simrs['bto'] ?? null,
            'ndr' => $simrs['ndr'] ?? null,
            'gdr' => $simrs['gdr'] ?? null,
        ]);
    }

    private function getMonthlyCounts(string $modelClass, string $dateField, int $year, array $monthNames): array
    {
        $results = $modelClass::selectRaw("MONTH({$dateField}) as month, COUNT(*) as value")
            ->whereYear($dateField, $year)
            ->groupByRaw("MONTH({$dateField})")
            ->orderByRaw("MONTH({$dateField})")
            ->get()
            ->keyBy('month');

        $data = [];
        for ($i = 0; $i < 12; $i++) {
            $monthNum = $i + 1;
            $data[] = [
                'name' => $monthNames[$i],
                'value' => (int) ($results[$monthNum]->value ?? 0),
            ];
        }
        return $data;
    }

    private function fetchSimrsRealtime(string $tglAwal, string $tglAkhir): array
    {
        $cacheKey = "simrs_indikator_{$tglAwal}_{$tglAkhir}";
        return Cache::remember($cacheKey, 1800, function () use ($tglAwal, $tglAkhir) {
            $url = config('app.simrs_api_url', env('SIMRS_API_URL', ''));
            $key = config('app.simrs_api_key', env('SIMRS_API_KEY', ''));

            if (!$url || !$key) return [];

            try {
                $response = Http::timeout(3)->get($url, [
                    'type' => 'indikator',
                    'key' => $key,
                    'tglAwal' => $tglAwal,
                    'tglAkhir' => $tglAkhir,
                ]);

                $body = $response->json();
                if (($body['status'] ?? '') !== 'success') return [];

                $records = $body['data']['data'] ?? [];
                if (!$records) return [];

                $raw = $records[0];
                return [
                    'bor_simrs' => isset($raw['BOR']) ? (float) $raw['BOR'] : null,
                    'avlos' => isset($raw['AVLOS']) ? (float) $raw['AVLOS'] : null,
                    'toi' => isset($raw['TOI']) ? (float) $raw['TOI'] : null,
                    'bto' => isset($raw['BTO']) ? (float) $raw['BTO'] : null,
                    'ndr' => isset($raw['NDR']) ? (float) $raw['NDR'] : null,
                    'gdr' => isset($raw['GDR']) ? (float) $raw['GDR'] : null,
                ];
            } catch (\Exception) {
                return [];
            }
        });
    }
}
