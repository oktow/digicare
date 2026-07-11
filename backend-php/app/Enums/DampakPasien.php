<?php

namespace App\Enums;

enum DampakPasien: string
{
    case Kematian = 'Kematian';
    case CederaBerat = 'Cedera Berat';
    case CederaSedang = 'Cedera Sedang';
    case CederaRingan = 'Cedera Ringan';
    case TidakAda = 'Tidak ada Cedera';
}
