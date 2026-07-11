<?php

return [
    'name' => env('APP_NAME', 'DigiCare'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),
    'timezone' => 'Asia/Jakarta',
    'locale' => 'id',
    'fallback_locale' => 'en',
    'cipher' => 'AES-256-CBC',
    'key' => env('APP_KEY'),
    'simrs_api_url' => env('SIMRS_API_URL', ''),
    'simrs_api_key' => env('SIMRS_API_KEY', ''),
];
