<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Services\JwtService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(private JwtService $jwt) {}

    public function index(): JsonResponse
    {
        $users = User::all();
        return response()->json($users->map(fn($u) => $this->formatUser($u)));
    }

    public function store(CreateUserRequest $request): JsonResponse
    {
        $exists = User::where('username', $request->username)->exists();
        if ($exists) {
            return response()->json(['detail' => 'Username sudah digunakan'], 400);
        }

        $role = $request->role ?? 'petugas';
        $user = User::create([
            'username' => $request->username,
            'password_hash' => $this->jwt->hashPassword($request->password),
            'full_name' => $request->full_name,
            'role' => $role,
            'modules' => $request->modules ?? User::defaultModulesForRole($role),
        ]);

        return response()->json($this->formatUser($user), 201);
    }

    public function show(int $id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['detail' => 'User tidak ditemukan'], 404);
        }
        return response()->json($this->formatUser($user));
    }

    public function update(int $id, UpdateUserRequest $request): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['detail' => 'User tidak ditemukan'], 404);
        }

        $data = $request->only(['full_name', 'role', 'is_active', 'modules']);
        if ($request->filled('password')) {
            $data['password_hash'] = $this->jwt->hashPassword($request->password);
        }
        if ($request->has('modules') && !$request->modules) {
            $data['modules'] = User::defaultModulesForRole($user->role);
        }
        $user->update($data);

        return response()->json($this->formatUser($user));
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $currentUser = $request->get('_user');
        if ($currentUser->id === $id) {
            return response()->json(['detail' => 'Tidak dapat menghapus akun sendiri'], 400);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['detail' => 'User tidak ditemukan'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User berhasil dihapus']);
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
