<?php

use App\Models\Agent;
use App\Models\CommissionPayment;
use App\Models\User;

test('admin can record a commission payment', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $agent = Agent::create([
        'name' => 'Sari',
        'bank_name' => 'BCA',
        'bank_account' => '123',
        'bank_holder' => 'Sari',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.commissions.store'), [
            'agent_id' => $agent->id,
            'amount' => 750000,
            'period' => 'Juni 2026',
            'method' => 'transfer',
            'status' => 'paid',
            'paid_at' => now()->toDateString(),
        ])
        ->assertRedirect();

    expect(CommissionPayment::where('agent_id', $agent->id)->where('amount', 750000)->exists())
        ->toBeTrue();
});

test('admin can toggle commission status', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $agent = Agent::create(['name' => 'Budi']);
    $payment = CommissionPayment::create([
        'agent_id' => $agent->id,
        'amount' => 100000,
        'status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->put(route('admin.commissions.update', $payment), ['status' => 'paid'])
        ->assertRedirect();

    expect($payment->fresh()->status)->toBe('paid');
});

test('non admin cannot access commissions', function () {
    $sales = User::factory()->create(['role' => 'sales']);

    $this->actingAs($sales)
        ->get(route('admin.commissions.index'))
        ->assertForbidden();
});
