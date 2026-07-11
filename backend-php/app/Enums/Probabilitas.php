<?php

namespace App\Enums;

enum Probabilitas: string
{
    case SangatJarang = 'Sangat Jarang';
    case Jarang = 'Jarang';
    case Mungkin = 'Mungkin';
    case Sering = 'Sering';
    case SangatSering = 'Sangat Sering';
}
