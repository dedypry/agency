<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('broker_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('agent_id')->nullable()->constrained()->nullOnDelete();
            $table->string('first_party_name');
            $table->string('first_party_phone')->nullable();
            $table->string('first_party_address')->nullable();
            $table->string('description');
            $table->decimal('base_amount', 15, 2)->default(0); // nilai penjualan acuan
            $table->decimal('percent', 5, 2)->default(0);
            $table->decimal('amount', 15, 2)->default(0); // komisi broker yang ditagihkan
            $table->string('status')->default('unpaid'); // unpaid | paid | cancelled
            $table->date('issue_date');
            $table->date('due_date')->nullable();
            $table->date('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('broker_invoices');
    }
};
