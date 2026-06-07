<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commission_payments', function (Blueprint $table) {
            $table->foreignId('order_id')->nullable()->after('agent_id')->constrained()->nullOnDelete();
            $table->decimal('percent', 5, 2)->nullable()->after('amount');
            $table->boolean('auto')->default(false)->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('commission_payments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('order_id');
            $table->dropColumn(['percent', 'auto']);
        });
    }
};
