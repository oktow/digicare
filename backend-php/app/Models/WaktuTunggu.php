<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaktuTunggu extends Model
{
    protected $table = 'waktu_tunggu';

    protected $fillable = [
        'tanggal', 'instalasi', 'unit_ruang', 'rata_rata_menit',
        'jumlah_pasien', 'sumber_data', 'created_by',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
        'rata_rata_menit' => 'integer',
        'jumlah_pasien' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
