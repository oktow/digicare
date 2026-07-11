<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        if (User::exists()) return;

        User::insert([
            [
                'username' => 'admin',
                'password_hash' => Hash::make('admin123'),
                'full_name' => 'Administrator',
                'role' => 'admin',
                'is_active' => true,
                'modules' => json_encode(User::defaultModulesForRole('admin')),
            ],
            [
                'username' => 'petugas',
                'password_hash' => Hash::make('petugas123'),
                'full_name' => 'Petugas Mutu',
                'role' => 'petugas',
                'is_active' => true,
                'modules' => json_encode(User::defaultModulesForRole('petugas')),
            ],
            [
                'username' => 'viewer',
                'password_hash' => Hash::make('viewer123'),
                'full_name' => 'Viewer',
                'role' => 'viewer',
                'is_active' => true,
                'modules' => json_encode(User::defaultModulesForRole('viewer')),
            ],
        ]);

        echo "[OK] Users seeded: admin/admin123, petugas/petugas123, viewer/viewer123\n";
    }
}
