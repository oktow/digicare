<?php

return [
    'secret' => env('JWT_SECRET', 'digicare-secret-key-change-in-production-2026'),
    'algorithm' => env('JWT_ALGORITHM', 'HS256'),
    'ttl' => (int) env('JWT_TTL', 480),
];
