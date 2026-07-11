<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('insiden', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pasien', 100)->nullable();
            $table->string('no_rm', 50)->nullable();
            $table->string('unit_tempat_insiden', 100)->nullable();
            $table->string('usia_pasien', 30)->nullable();
            $table->string('penanggung_biaya', 50)->nullable();
            $table->string('jenis_kelamin', 20)->nullable();
            $table->date('tgl_masuk_rs')->nullable();
            $table->date('tgl_kejadian')->nullable();
            $table->time('waktu_insiden')->nullable();
            $table->text('kronologi_insiden')->nullable();
            $table->string('jenis_insiden', 20)->nullable();
            $table->string('spesialisasi', 100)->nullable();
            $table->string('dampak_pasien', 50)->nullable();
            $table->string('probabilitas', 30)->nullable();
            $table->string('pelapor', 40)->nullable();
            $table->string('tipe_pasien', 40)->nullable();
            $table->string('tempat_insiden', 100)->nullable();
            $table->string('unit_penyebab', 100)->nullable();
            $table->text('tindak_lanjut_segera')->nullable();
            $table->string('tindak_lanjut_oleh', 100)->nullable();
            $table->boolean('pernah_terjadi_sebelumnya')->nullable();
            $table->string('grading_risiko', 20)->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('insiden');
    }
};
