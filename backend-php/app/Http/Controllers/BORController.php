<?php

namespace App\Http\Controllers;

use App\Http\Requests\BORRequest;
use App\Http\Requests\BORSyncRequest;
use App\Http\Requests\BORRequest as BORUpdateRequest;
use App\Models\BOR;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BORController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BOR::query();
        if ($request->tgl_awal) $query->whereDate('tanggal', '>=', $request->tgl_awal);
        if ($request->tgl_akhir) $query->whereDate('tanggal', '<=', $request->tgl_akhir);
        $items = $query->orderBy('tanggal', 'desc')->get();
        return response()->json($items->map(fn($b) => $this->format($b)));
    }

    public function store(BORRequest $request): JsonResponse
    {
        $exists = BOR::where('tanggal', $request->tanggal)->exists();
        if ($exists) {
            return response()->json(['detail' => "BOR untuk tanggal {$request->tanggal} sudah ada"], 400);
        }

        $borPercent = $request->total_tt > 0
            ? round(($request->pasien_rawat_inap / $request->total_tt) * 100, 2)
            : 0;

        $bor = BOR::create([
            'tanggal' => $request->tanggal,
            'total_tt' => $request->total_tt,
            'pasien_rawat_inap' => $request->pasien_rawat_inap,
            'bor_percent' => $borPercent,
            'sumber_data' => $request->sumber_data ?? 'manual',
            'created_by' => $request->get('_user')->id,
        ]);

        return response()->json($this->format($bor), 201);
    }

    public function sync(BORSyncRequest $request): JsonResponse
    {
        $borPercent = $request->total_tt > 0
            ? round(($request->pasien_rawat_inap / $request->total_tt) * 100, 2)
            : 0;

        $existing = BOR::where('tanggal', $request->tanggal)->first();

        if ($existing) {
            $existing->update([
                'total_tt' => $request->total_tt,
                'pasien_rawat_inap' => $request->pasien_rawat_inap,
                'bor_percent' => $borPercent,
                'sumber_data' => 'api',
            ]);
            $bor = $existing;
        } else {
            $bor = BOR::create([
                'tanggal' => $request->tanggal,
                'total_tt' => $request->total_tt,
                'pasien_rawat_inap' => $request->pasien_rawat_inap,
                'bor_percent' => $borPercent,
                'sumber_data' => 'api',
            ]);
        }

        return response()->json($this->format($bor));
    }

    public function update(int $id, BORRequest $request): JsonResponse
    {
        $bor = BOR::find($id);
        if (!$bor) return response()->json(['detail' => 'BOR tidak ditemukan'], 404);

        $data = $request->only(['total_tt', 'pasien_rawat_inap', 'tanggal', 'sumber_data']);

        $totalTt = $data['total_tt'] ?? $bor->total_tt;
        $pasienRi = $data['pasien_rawat_inap'] ?? $bor->pasien_rawat_inap;
        $data['bor_percent'] = $totalTt > 0 ? round(($pasienRi / $totalTt) * 100, 2) : 0;

        $bor->update($data);
        return response()->json($this->format($bor));
    }

    public function destroy(int $id): JsonResponse
    {
        $bor = BOR::find($id);
        if (!$bor) return response()->json(['detail' => 'BOR tidak ditemukan'], 404);
        $bor->delete();
        return response()->json(['message' => 'BOR berhasil dihapus']);
    }

    private function format($b): array
    {
        return [
            'id' => $b->id,
            'tanggal' => $b->tanggal?->format('Y-m-d'),
            'total_tt' => $b->total_tt,
            'pasien_rawat_inap' => $b->pasien_rawat_inap,
            'bor_percent' => $b->bor_percent,
            'sumber_data' => $b->sumber_data,
            'created_by' => $b->created_by,
            'created_at' => $b->created_at?->toISOString(),
            'updated_at' => $b->updated_at?->toISOString(),
        ];
    }
}
