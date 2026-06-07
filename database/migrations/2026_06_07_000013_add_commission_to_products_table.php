<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Komisi 90Home (broker) dari pihak pertama.
            $table->decimal('broker_commission_percent', 5, 2)->default(0)->after('price');
            // Komisi agen sales dari 90Home.
            $table->decimal('agent_commission_percent', 5, 2)->default(0)->after('broker_commission_percent');
            // Pihak pertama (pemilik/principal) untuk penagihan komisi broker.
            $table->string('first_party_name')->nullable()->after('agent_commission_percent');
            $table->string('first_party_phone')->nullable()->after('first_party_name');
            $table->string('first_party_address')->nullable()->after('first_party_phone');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'broker_commission_percent',
                'agent_commission_percent',
                'first_party_name',
                'first_party_phone',
                'first_party_address',
            ]);
        });
    }
};
