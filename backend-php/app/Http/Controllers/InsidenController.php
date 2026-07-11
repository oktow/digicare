<?php

namespace App\Http\Controllers;

use App\Http\Requests\InsidenRequest;
use App\Models\Insiden;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InsidenController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Insiden::query();

        if ($s = $request->search) {
            $query->where(function ($q) use ($s) {
                $q->where('nama_pasien', 'like', "%{$s}%")
                  ->orWhere('no_rm', 'like', "%{$s}%")
                  ->orWhere('kronologi_insiden', 'like', "%{$s}%");
            });
        }
        if ($request->jenis_insiden) $query->where('jenis_insiden', $request->jenis_insiden);
        if ($request->grading_risiko) $query->where('grading_risiko', $request->grading_risiko);
        if ($request->tgl_awal) $query->whereDate('tgl_kejadian', '>=', $request->tgl_awal);
        if ($request->tgl_akhir) $query->whereDate('tgl_kejadian', '<=', $request->tgl_akhir);

        $page = max(1, (int) $request->page);
        $size = min(100, max(1, (int) ($request->size ?? 20)));
        $total = $query->count();

        $items = $query->orderBy('tgl_kejadian', 'desc')
            ->orderBy('id', 'desc')
            ->skip(($page - 1) * $size)
            ->take($size)
            ->get();

        return response()->json([
            'items' => $items->map(fn($i) => $this->format($i)),
            'total' => $total,
            'page' => $page,
            'size' => $size,
            'pages' => $total > 0 ? (int) ceil($total / $size) : 0,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $i = Insiden::find($id);
        if (!$i) return response()->json(['detail' => 'Insiden tidak ditemukan'], 404);
        return response()->json($this->format($i));
    }

    public function store(InsidenRequest $request): JsonResponse
    {
        $data = $request->all();
        $data['created_by'] = $request->get('_user')->id;
        $i = Insiden::create($data);
        return response()->json($this->format($i), 201);
    }

    public function update(int $id, InsidenRequest $request): JsonResponse
    {
        $i = Insiden::find($id);
        if (!$i) return response()->json(['detail' => 'Insiden tidak ditemukan'], 404);
        $i->update($request->all());
        return response()->json($this->format($i));
    }

    public function destroy(int $id): JsonResponse
    {
        $i = Insiden::find($id);
        if (!$i) return response()->json(['detail' => 'Insiden tidak ditemukan'], 404);
        $i->delete();
        return response()->json(['message' => 'Insiden berhasil dihapus']);
    }

    private function format($i): array
    {
        return [
            'id' => $i->id,
            'nama_pasien' => $i->nama_pasien,
            'no_rm' => $i->no_rm,
            'unit_tempat_insiden' => $i->unit_tempat_insiden,
            'usia_pasien' => $i->usia_pasien,
            'penanggung_biaya' => $i->penanggung_biaya,
            'jenis_kelamin' => $i->jenis_kelamin,
            'tgl_masuk_rs' => $i->tgl_masuk_rs?->format('Y-m-d'),
            'tgl_kejadian' => $i->tgl_kejadian?->format('Y-m-d'),
            'waktu_insiden' => $i->waktu_insiden,
            'kronologi_insiden' => $i->kronologi_insiden,
            'jenis_insiden' => $i->jenis_insiden,
            'spesialisasi' => $i->spesialisasi,
            'dampak_pasien' => $i->dampak_pasien,
            'probabilitas' => $i->probabilitas,
            'pelapor' => $i->pelapor,
            'tipe_pasien' => $i->tipe_pasien,
            'tempat_insiden' => $i->tempat_insiden,
            'unit_penyebab' => $i->unit_penyebab,
            'tindak_lanjut_segera' => $i->tindak_lanjut_segera,
            'tindak_lanjut_oleh' => $i->tindak_lanjut_oleh,
            'pernah_terjadi_sebelumnya' => $i->pernah_terjadi_sebelumnya,
            'grading_risiko' => $i->grading_risiko,
            'created_by' => $i->created_by,
            'created_at' => $i->created_at?->toISOString(),
            'updated_at' => $i->updated_at?->toISOString(),
        ];
    }
}
