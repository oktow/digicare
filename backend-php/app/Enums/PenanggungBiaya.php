<?php

namespace App\Enums;

enum PenanggungBiaya: string
{
    case BPJS = 'BPJS';
    case Jamkesda = 'Jamkesda';
    case Umum = 'Umum/Pribadi';
    case AsuransiSwasta = 'Asuransi Swasta';
    case Pemerintah = 'Pemerintah';
    case Perusahaan = 'Perusahaan';
    case Lainnya = 'Yang lain';
}
