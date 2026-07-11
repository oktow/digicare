<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BOR extends Model
{
    protected $table = 'bor';

    protected $fillable = [
        'tanggal', 'total_tt', 'pasien_rawat_inap', 'bor_percent',
        'sumber_data', 'created_by',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
        'bor_percent' => 'float',
        'total_tt' => 'integer',
        'pasien_rawat_inap' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
