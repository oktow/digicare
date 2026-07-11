<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Komplain extends Model
{
    protected $table = 'komplain';

    protected $fillable = [
        'tanggal_diterima', 'nama', 'alamat', 'instalasi', 'unit_ruang',
        'komplain', 'perihal_telaah', 'sarana_komplain', 'grading', 'tindak_lanjut',
        'tanggal_diselesaikan', 'status_waktu', 'bukti_tindak_lanjut', 'nama_petugas',
        'created_by',
    ];

    protected $casts = [
        'tanggal_diterima' => 'date:Y-m-d',
        'tanggal_diselesaikan' => 'date:Y-m-d',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
