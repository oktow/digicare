<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private JwtService $jwt) {}

    public function login(Request $request): JsonResponse
    {
        $username = $request->input('username');
        $password = $request->input('password');

        if (!$username || !$password) {
            return response()->json(['detail' => 'Username dan password harus diisi'], 400);
        }

        $user = User::where('username', $username)->first();

        if (!$user || !$this->jwt->verifyPassword($password, $user->password_hash)) {
            return response()->json(['detail' => 'Username atau password salah'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['detail' => 'Akun telah dinonaktifkan'], 401);
        }

        $token = $this->jwt->createAccessToken(['sub' => $user->username]);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $this->formatUser($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($this->formatUser($request->get('_user')));
    }

    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->get('_user');
        $current = $request->input('current_password');
        $new = $request->input('new_password');

        if (!$this->jwt->verifyPassword($current, $user->password_hash)) {
            return response()->json(['detail' => 'Password saat ini salah'], 400);
        }

        $user->password_hash = $this->jwt->hashPassword($new);
        $user->save();

        return response()->json(['message' => 'Password berhasil diubah']);
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'username' => $user->username,
            'full_name' => $user->full_name,
            'role' => $user->role,
            'is_active' => $user->is_active,
            'modules' => $user->modules ?? User::defaultModulesForRole($user->role),
            'created_at' => $user->created_at?->toISOString(),
        ];
    }
}
