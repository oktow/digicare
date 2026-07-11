<?php

namespace App\Http\Controllers;

use App\Http\Requests\KomplainRequest;
use App\Models\Komplain;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KomplainController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Komplain::query();

        if ($s = $request->search) {
            $query->where(function ($q) use ($s) {
                $q->where('nama', 'like', "%{$s}%")
                  ->orWhere('komplain', 'like', "%{$s}%")
                  ->orWhere('unit_ruang', 'like', "%{$s}%");
            });
        }
        if ($request->instalasi) $query->where('instalasi', $request->instalasi);
        if ($request->grading) $query->where('grading', $request->grading);
        if ($request->sarana) $query->where('sarana_komplain', $request->sarana);
        if ($request->tgl_awal) $query->whereDate('tanggal_diterima', '>=', $request->tgl_awal);
        if ($request->tgl_akhir) $query->whereDate('tanggal_diterima', '<=', $request->tgl_akhir);

        $page = max(1, (int) $request->page);
        $size = min(100, max(1, (int) ($request->size ?? 20)));
        $total = $query->count();

        $items = $query->orderBy('tanggal_diterima', 'desc')
            ->orderBy('id', 'desc')
            ->skip(($page - 1) * $size)
            ->take($size)
            ->get();

        return response()->json([
            'items' => $items->map(fn($k) => $this->format($k)),
            'total' => $total,
            'page' => $page,
            'size' => $size,
            'pages' => $total > 0 ? (int) ceil($total / $size) : 0,
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $k = Komplain::find($id);
        if (!$k) return response()->json(['detail' => 'Komplain tidak ditemukan'], 404);
        return response()->json($this->format($k));
    }

    public function store(KomplainRequest $request): JsonResponse
    {
        $data = $request->all();
        $data['created_by'] = $request->get('_user')->id;
        $k = Komplain::create($data);
        return response()->json($this->format($k), 201);
    }

    public function update(int $id, KomplainRequest $request): JsonResponse
    {
        $k = Komplain::find($id);
        if (!$k) return response()->json(['detail' => 'Komplain tidak ditemukan'], 404);
        $k->update($request->all());
        return response()->json($this->format($k));
    }

    public function destroy(int $id): JsonResponse
    {
        $k = Komplain::find($id);
        if (!$k) return response()->json(['detail' => 'Komplain tidak ditemukan'], 404);
        $k->delete();
        return response()->json(['message' => 'Komplain berhasil dihapus']);
    }

    private function format($k): array
    {
        $saranaMap = ['Langsung' => 'Langsung', 'Hallo_Murjani' => 'Hallo Murjani', 'Kotak_Saran' => 'Kotak Saran'];
        $statusMap = ['kurang_60' => '<60 Menit', 'lebih_60' => '>60 Menit'];

        return [
            'id' => $k->id,
            'tanggal_diterima' => $k->tanggal_diterima?->format('Y-m-d'),
            'nama' => $k->nama,
            'alamat' => $k->alamat,
            'instalasi' => $k->instalasi,
            'unit_ruang' => $k->unit_ruang,
            'komplain' => $k->komplain,
            'perihal_telaah' => $k->perihal_telaah,
            'sarana_komplain' => $saranaMap[$k->sarana_komplain] ?? $k->sarana_komplain,
            'grading' => $k->grading,
            'tindak_lanjut' => $k->tindak_lanjut,
            'tanggal_diselesaikan' => $k->tanggal_diselesaikan?->format('Y-m-d'),
            'status_waktu' => $statusMap[$k->status_waktu] ?? $k->status_waktu,
            'bukti_tindak_lanjut' => $k->bukti_tindak_lanjut,
            'nama_petugas' => $k->nama_petugas,
            'created_by' => $k->created_by,
            'created_at' => $k->created_at?->toISOString(),
            'updated_at' => $k->updated_at?->toISOString(),
        ];
    }
}
