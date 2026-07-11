<?php

namespace App\Enums;

enum StatusWaktu: string
{
    case Kurang60 = '<60 Menit';
    case Lebih60 = '>60 Menit';
}
