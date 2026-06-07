<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commission_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->string('period')->nullable(); // e.g. "Juni 2026"
            $table->string('method')->nullable(); // transfer, cash, etc.
            $table->string('reference')->nullable(); // bukti transfer / no ref
            $table->string('status')->default('paid'); // pending | paid
            $table->date('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commission_payments');
    }
};
