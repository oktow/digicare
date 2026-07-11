<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('waktu_tunggu', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->string('instalasi', 50)->nullable();
            $table->string('unit_ruang', 100)->nullable();
            $table->integer('rata_rata_menit');
            $table->integer('jumlah_pasien')->nullable();
            $table->string('sumber_data', 20)->default('manual');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waktu_tunggu');
    }
};
