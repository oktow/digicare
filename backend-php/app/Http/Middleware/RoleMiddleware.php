<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->get('_user');

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json([
                'detail' => 'Anda tidak memiliki akses ke fitur ini'
            ], 403);
        }

        return $next($request);
    }
}
