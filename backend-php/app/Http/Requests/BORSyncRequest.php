<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BORSyncRequest extends FormRequest
{
    public function authorize(): true { return true; }
    public function rules(): array
    {
        return [
            'tanggal' => 'required|date',
            'total_tt' => 'required|integer|min:0',
            'pasien_rawat_inap' => 'required|integer|min:0',
        ];
    }
}
