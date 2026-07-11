<?php

namespace App\Enums;

enum UsiaPasien: string
{
    case Kurang1Bulan = '<1 Bulan';
    case Lebih1Bulan = '>1 Bulan';
    case Lebih1Tahun = '>1 Tahun';
}
