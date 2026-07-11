<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Petugas = 'petugas';
    case Viewer = 'viewer';
}
