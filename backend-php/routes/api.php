<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BORController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IndikatorController;
use App\Http\Controllers\InsidenController;
use App\Http\Controllers\KomplainController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WaktuTungguController;
use Illuminate\Support\Facades\Route;

// Health
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'app' => 'DigiCare']);
});

// Auth (public)
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['jwt.auth'])->group(function () {
    // Auth
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/change-password', [AuthController::class, 'changePassword']);

    // Users (admin only)
    Route::middleware('role:admin')->group(function () {
        Route::post('/auth/users', [UserController::class, 'store']);
        Route::get('/auth/users', [UserController::class, 'index']);
        Route::get('/auth/users/{id}', [UserController::class, 'show']);
        Route::put('/auth/users/{id}', [UserController::class, 'update']);
        Route::delete('/auth/users/{id}', [UserController::class, 'destroy']);
    });

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Indikator list
    Route::get('/indikator/list', [IndikatorController::class, 'list']);

    // Komplain
    Route::get('/komplain', [KomplainController::class, 'index']);
    Route::get('/komplain/{id}', [KomplainController::class, 'show']);
    Route::middleware('role:admin,petugas')->group(function () {
        Route::post('/komplain', [KomplainController::class, 'store']);
        Route::put('/komplain/{id}', [KomplainController::class, 'update']);
    });
    Route::delete('/komplain/{id}', [KomplainController::class, 'destroy'])->middleware('role:admin');

    // Insiden
    Route::get('/insiden', [InsidenController::class, 'index']);
    Route::get('/insiden/{id}', [InsidenController::class, 'show']);
    Route::middleware('role:admin,petugas')->group(function () {
        Route::post('/insiden', [InsidenController::class, 'store']);
        Route::put('/insiden/{id}', [InsidenController::class, 'update']);
    });
    Route::delete('/insiden/{id}', [InsidenController::class, 'destroy'])->middleware('role:admin');

    // BOR
    Route::get('/bor', [BORController::class, 'index']);
    Route::middleware('role:admin,petugas')->group(function () {
        Route::post('/bor', [BORController::class, 'store']);
        Route::put('/bor/{id}', [BORController::class, 'update']);
    });
    Route::post('/bor/sync', [BORController::class, 'sync']);
    Route::delete('/bor/{id}', [BORController::class, 'destroy'])->middleware('role:admin');

    // Waktu Tunggu
    Route::get('/waktu-tunggu', [WaktuTungguController::class, 'index']);
    Route::middleware('role:admin,petugas')->group(function () {
        Route::post('/waktu-tunggu', [WaktuTungguController::class, 'store']);
        Route::put('/waktu-tunggu/{id}', [WaktuTungguController::class, 'update']);
    });
    Route::delete('/waktu-tunggu/{id}', [WaktuTungguController::class, 'destroy'])->middleware('role:admin');
});

