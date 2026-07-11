<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WaktuTungguRequest extends FormRequest
{
    public function authorize(): true { return true; }
    public function rules(): array
    {
        return [
            'tanggal' => 'required|date',
            'instalasi' => 'sometimes|string|max:50|nullable',
            'unit_ruang' => 'sometimes|string|max:100|nullable',
            'rata_rata_menit' => 'required|integer|min:0',
            'jumlah_pasien' => 'sometimes|integer|nullable',
            'sumber_data' => 'sometimes|string',
        ];
    }
}
