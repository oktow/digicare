<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Hash;

class JwtService
{
    public function hashPassword(string $password): string
    {
        return Hash::make($password);
    }

    public function verifyPassword(string $plain, string $hashed): bool
    {
        if (password_verify($plain, $hashed)) {
            return true;
        }
        return Hash::check($plain, $hashed);
    }

    public function createAccessToken(array $data): string
    {
        $payload = array_merge($data, [
            'iat' => time(),
            'exp' => time() + (config('jwt.ttl') * 60),
        ]);
        return JWT::encode($payload, config('jwt.secret'), config('jwt.algorithm'));
    }

    public function decodeToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key(config('jwt.secret'), config('jwt.algorithm')));
        } catch (\Exception) {
            return null;
        }
    }
}
