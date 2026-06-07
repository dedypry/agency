<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            $table->string('bank_name')->nullable()->after('bio');
            $table->string('bank_account')->nullable()->after('bank_name');
            $table->string('bank_holder')->nullable()->after('bank_account');
        });
    }

    public function down(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            $table->dropColumn(['bank_name', 'bank_account', 'bank_holder']);
        });
    }
};
