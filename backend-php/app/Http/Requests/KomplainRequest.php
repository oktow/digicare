<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KomplainRequest extends FormRequest
{
    public function authorize(): true { return true; }
    public function rules(): array
    {
        return [
            'tanggal_diterima' => 'sometimes|date|nullable',
            'nama' => 'sometimes|string|max:100|nullable',
            'alamat' => 'sometimes|string|nullable',
            'instalasi' => 'sometimes|string|max:50|nullable',
            'unit_ruang' => 'sometimes|string|max:100|nullable',
            'komplain' => 'sometimes|string|nullable',
            'perihal_telaah' => 'sometimes|string|nullable',
            'sarana_komplain' => 'sometimes|string|nullable',
            'grading' => 'sometimes|string|nullable',
            'tindak_lanjut' => 'sometimes|string|nullable',
            'tanggal_diselesaikan' => 'sometimes|date|nullable',
            'status_waktu' => 'sometimes|string|nullable',
            'bukti_tindak_lanjut' => 'sometimes|string|nullable',
            'nama_petugas' => 'sometimes|string|max:100|nullable',
        ];
    }
}
