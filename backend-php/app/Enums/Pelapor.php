<?php

namespace App\Enums;

enum Pelapor: string
{
    case Karyawan = 'Karyawan';
    case Pasien = 'Pasien';
    case Keluarga = 'Keluarga/Pendamping Pasien';
    case Pengunjung = 'Pengunjung';
    case Lainnya = 'Yang lain';
}
