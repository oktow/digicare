<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $auth = $request->header('Authorization');

        if (!$auth || !str_starts_with($auth, 'Bearer ')) {
            return response()->json([
                'detail' => 'Tidak dapat memvalidasi credentials'
            ], 401, ['WWW-Authenticate' => 'Bearer']);
        }

        $token = substr($auth, 7);
        $jwt = app(JwtService::class);
        $payload = $jwt->decodeToken($token);

        if (!$payload || !isset($payload->sub)) {
            return response()->json([
                'detail' => 'Tidak dapat memvalidasi credentials'
            ], 401, ['WWW-Authenticate' => 'Bearer']);
        }

        $user = User::where('username', $payload->sub)
            ->where('is_active', true)
            ->first();

        if (!$user) {
            return response()->json([
                'detail' => 'Tidak dapat memvalidasi credentials'
            ], 401, ['WWW-Authenticate' => 'Bearer']);
        }

        $request->merge(['_user' => $user]);
        return $next($request);
    }
}
