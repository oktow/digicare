<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InsidenRequest extends FormRequest
{
    public function authorize(): true { return true; }
    public function rules(): array
    {
        return [
            'nama_pasien' => 'sometimes|string|max:100|nullable',
            'no_rm' => 'sometimes|string|max:50|nullable',
            'unit_tempat_insiden' => 'sometimes|string|max:100|nullable',
            'usia_pasien' => 'sometimes|string|nullable',
            'penanggung_biaya' => 'sometimes|string|nullable',
            'jenis_kelamin' => 'sometimes|string|nullable',
            'tgl_masuk_rs' => 'sometimes|date|nullable',
            'tgl_kejadian' => 'sometimes|date|nullable',
            'waktu_insiden' => 'sometimes|string|nullable',
            'kronologi_insiden' => 'sometimes|string|nullable',
            'jenis_insiden' => 'sometimes|string|nullable',
            'spesialisasi' => 'sometimes|string|max:100|nullable',
            'dampak_pasien' => 'sometimes|string|nullable',
            'probabilitas' => 'sometimes|string|nullable',
            'pelapor' => 'sometimes|string|nullable',
            'tipe_pasien' => 'sometimes|string|nullable',
            'tempat_insiden' => 'sometimes|string|max:100|nullable',
            'unit_penyebab' => 'sometimes|string|max:100|nullable',
            'tindak_lanjut_segera' => 'sometimes|string|nullable',
            'tindak_lanjut_oleh' => 'sometimes|string|max:100|nullable',
            'pernah_terjadi_sebelumnya' => 'sometimes|boolean|nullable',
            'grading_risiko' => 'sometimes|string|nullable',
        ];
    }
}
