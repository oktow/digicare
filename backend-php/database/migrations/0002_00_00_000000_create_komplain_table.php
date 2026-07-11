<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('komplain', function (Blueprint $table) {
            $table->id();
            $table->integer('no')->nullable();
            $table->date('tanggal_diterima')->nullable();
            $table->string('nama', 100)->nullable();
            $table->text('alamat')->nullable();
            $table->string('instalasi', 50)->nullable();
            $table->string('unit_ruang', 100)->nullable();
            $table->text('komplain')->nullable();
            $table->text('perihal_telaah')->nullable();
            $table->string('sarana_komplain', 50)->nullable();
            $table->string('grading', 20)->nullable();
            $table->text('tindak_lanjut')->nullable();
            $table->date('tanggal_diselesaikan')->nullable();
            $table->string('status_waktu', 20)->nullable();
            $table->text('bukti_tindak_lanjut')->nullable();
            $table->string('nama_petugas', 100)->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('komplain');
    }
};
