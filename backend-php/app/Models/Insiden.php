<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Insiden extends Model
{
    protected $table = 'insiden';

    protected $fillable = [
        'nama_pasien', 'no_rm', 'unit_tempat_insiden', 'usia_pasien',
        'penanggung_biaya', 'jenis_kelamin', 'tgl_masuk_rs', 'tgl_kejadian',
        'waktu_insiden', 'kronologi_insiden', 'jenis_insiden', 'spesialisasi',
        'dampak_pasien', 'probabilitas', 'pelapor', 'tipe_pasien', 'tempat_insiden',
        'unit_penyebab', 'tindak_lanjut_segera', 'tindak_lanjut_oleh',
        'pernah_terjadi_sebelumnya', 'grading_risiko', 'created_by',
    ];

    protected $casts = [
        'tgl_masuk_rs' => 'date:Y-m-d',
        'tgl_kejadian' => 'date:Y-m-d',
        'waktu_insiden' => 'string',
        'pernah_terjadi_sebelumnya' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
