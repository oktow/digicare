<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bor', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal')->unique();
            $table->integer('total_tt');
            $table->integer('pasien_rawat_inap');
            $table->decimal('bor_percent', 5, 2)->nullable();
            $table->string('sumber_data', 20)->default('manual');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bor');
    }
};
