<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = 'users';
    public $timestamps = false;

    protected $fillable = [
        'username',
        'password_hash',
        'full_name',
        'role',
        'is_active',
        'modules',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'modules' => 'array',
        'created_at' => 'datetime',
    ];

    public static function defaultModulesForRole(string $role): array
    {
        return match ($role) {
            'admin' => ['dashboard', 'komplain', 'insiden', 'bor', 'waktu_tunggu', 'users'],
            'petugas' => ['dashboard', 'komplain', 'insiden', 'bor', 'waktu_tunggu'],
            'viewer' => ['dashboard'],
            default => ['dashboard'],
        };
    }
}
