<?php

namespace App\Http\Controllers;

use App\Http\Requests\WaktuTungguRequest;
use App\Models\WaktuTunggu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WaktuTungguController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = WaktuTunggu::query();
        if ($request->tgl_awal) $query->whereDate('tanggal', '>=', $request->tgl_awal);
        if ($request->tgl_akhir) $query->whereDate('tanggal', '<=', $request->tgl_akhir);
        if ($request->instalasi) $query->where('instalasi', $request->instalasi);
        $items = $query->orderBy('tanggal', 'desc')->get();
        return response()->json($items->map(fn($w) => $this->format($w)));
    }

    public function store(WaktuTungguRequest $request): JsonResponse
    {
        $data = $request->all();
        $data['sumber_data'] = $request->sumber_data ?? 'manual';
        $data['created_by'] = $request->get('_user')->id;
        $wt = WaktuTunggu::create($data);
        return response()->json($this->format($wt), 201);
    }

    public function update(int $id, WaktuTungguRequest $request): JsonResponse
    {
        $wt = WaktuTunggu::find($id);
        if (!$wt) return response()->json(['detail' => 'Data waktu tunggu tidak ditemukan'], 404);
        $wt->update($request->all());
        return response()->json($this->format($wt));
    }

    public function destroy(int $id): JsonResponse
    {
        $wt = WaktuTunggu::find($id);
        if (!$wt) return response()->json(['detail' => 'Data waktu tunggu tidak ditemukan'], 404);
        $wt->delete();
        return response()->json(['message' => 'Data waktu tunggu berhasil dihapus']);
    }

    private function format($w): array
    {
        return [
            'id' => $w->id,
            'tanggal' => $w->tanggal?->format('Y-m-d'),
            'instalasi' => $w->instalasi,
            'unit_ruang' => $w->unit_ruang,
            'rata_rata_menit' => $w->rata_rata_menit,
            'jumlah_pasien' => $w->jumlah_pasien,
            'sumber_data' => $w->sumber_data,
            'created_by' => $w->created_by,
            'created_at' => $w->created_at?->toISOString(),
            'updated_at' => $w->updated_at?->toISOString(),
        ];
    }
}
