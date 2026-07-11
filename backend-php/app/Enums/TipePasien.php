<?php

namespace App\Enums;

enum TipePasien: string
{
    case RawatInap = 'Pasien Rawat Inap';
    case RawatJalan = 'Pasien Rawat Jalan';
    case UGD = 'Pasien UGD';
    case Lainnya = 'Yang lain';
}
