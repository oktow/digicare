<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class IndikatorController extends Controller
{
    public function list(): JsonResponse
    {
        return response()->json([
            'indicators' => [
                ['id' => 'bor_simrs', 'label' => 'BOR', 'suffix' => '%', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'avlos', 'label' => 'AVLOS', 'suffix' => ' hr', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'toi', 'label' => 'TOI', 'suffix' => ' hr', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'bto', 'label' => 'BTO', 'suffix' => '', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'ndr', 'label' => 'NDR', 'suffix' => '‰', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'gdr', 'label' => 'GDR', 'suffix' => '‰', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'awal', 'label' => 'Pasien Awal', 'suffix' => '', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'masuk', 'label' => 'Pasien Masuk', 'suffix' => '', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'kurang_48_jam', 'label' => '< 48 Jam', 'suffix' => '', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'lebih_48_jam', 'label' => '> 48 Jam', 'suffix' => '', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'jml_keluar_hidup', 'label' => 'Keluar Hidup', 'suffix' => '', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'jml_klr', 'label' => 'Total Keluar', 'suffix' => '', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'lama_dirawat', 'label' => 'Lama Dirawat', 'suffix' => ' hr', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'hari_perawatan', 'label' => 'Hari Perawatan', 'suffix' => '', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'pasien_dirawat', 'label' => 'Pasien Dirawat', 'suffix' => '', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'ttidur', 'label' => 'Tempat Tidur', 'suffix' => '', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'jml_hari', 'label' => 'Jumlah Hari', 'suffix' => '', 'source' => 'simrs', 'group' => 'SIMRS'],
                ['id' => 'total_komplain', 'label' => 'Total Komplain', 'suffix' => '', 'source' => 'local', 'group' => 'Mutu'],
                ['id' => 'total_insiden', 'label' => 'Total Insiden', 'suffix' => '', 'source' => 'local', 'group' => 'Mutu'],
                ['id' => 'avg_waktu_tunggu', 'label' => 'Rata Waktu Tunggu', 'suffix' => ' mnt', 'source' => 'local', 'group' => 'Mutu'],
                ['id' => 'bor_terakhir', 'label' => 'Bor Terakhir', 'suffix' => '%', 'source' => 'local', 'group' => 'Mutu'],
            ],
        ]);
    }
}
