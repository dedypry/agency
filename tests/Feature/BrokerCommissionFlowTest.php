<?php

use App\Models\Agent;
use App\Models\BrokerInvoice;
use App\Models\Category;
use App\Models\CommissionPayment;
use App\Models\CompanyProfile;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Support\Terbilang;

function makeSaleProduct(): Product
{
    $category = Category::create(['name' => 'Properti', 'slug' => 'properti-'.uniqid()]);
    $agent = Agent::create(['name' => 'Sari']);

    return Product::create([
        'category_id' => $category->id,
        'agent_id' => $agent->id,
        'name' => 'Rumah Test',
        'slug' => 'rumah-test-'.uniqid(),
        'type' => 'property',
        'price' => 1000000000,
        'broker_commission_percent' => 3,
        'agent_commission_percent' => 1,
        'first_party_name' => 'Pak Owner',
        'status' => 'published',
    ]);
}

function makeOrder(Product $product): Order
{
    return Order::create([
        'number' => Order::generateNumber(),
        'product_id' => $product->id,
        'agent_id' => $product->agent_id,
        'product_name' => $product->name,
        'customer_name' => 'Budi',
        'customer_phone' => '0812',
        'quantity' => 1,
        'unit_price' => $product->price,
        'total' => $product->price,
        'status' => 'processing',
    ]);
}

test('completing an order generates broker invoice and pending agent commission', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $product = makeSaleProduct();
    $order = makeOrder($product);

    $this->actingAs($admin)
        ->put(route('admin.orders.update', $order), ['status' => 'completed'])
        ->assertRedirect();

    $broker = BrokerInvoice::where('order_id', $order->id)->first();
    expect($broker)->not->toBeNull();
    expect((float) $broker->amount)->toEqual(30000000.0); // 3% of 1,000,000,000
    expect($broker->status)->toBe('unpaid');

    $commission = CommissionPayment::where('order_id', $order->id)->where('auto', true)->first();
    expect($commission)->not->toBeNull();
    expect((float) $commission->amount)->toEqual(10000000.0); // 1%
    expect($commission->status)->toBe('pending');
});

test('marking broker invoice paid releases the agent commission', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $product = makeSaleProduct();
    $order = makeOrder($product);

    $this->actingAs($admin)->put(route('admin.orders.update', $order), ['status' => 'completed']);

    $broker = BrokerInvoice::where('order_id', $order->id)->firstOrFail();

    $this->actingAs($admin)
        ->put(route('admin.broker-invoices.update', $broker), ['status' => 'paid'])
        ->assertRedirect();

    $commission = CommissionPayment::where('order_id', $order->id)->firstOrFail();
    expect($commission->status)->toBe('paid');
    expect($broker->fresh()->status)->toBe('paid');
});

test('completing twice does not duplicate commission records', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $product = makeSaleProduct();
    $order = makeOrder($product);

    $this->actingAs($admin)->put(route('admin.orders.update', $order), ['status' => 'completed']);
    $this->actingAs($admin)->put(route('admin.orders.update', $order), ['status' => 'processing']);
    $this->actingAs($admin)->put(route('admin.orders.update', $order), ['status' => 'completed']);

    expect(BrokerInvoice::where('order_id', $order->id)->count())->toBe(1);
    expect(CommissionPayment::where('order_id', $order->id)->count())->toBe(1);
});

test('broker invoice pdf renders with terbilang', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    CompanyProfile::current()->update(['name' => 'Rumah90']);
    $product = makeSaleProduct();
    $order = makeOrder($product);
    $this->actingAs($admin)->put(route('admin.orders.update', $order), ['status' => 'completed']);
    $broker = BrokerInvoice::where('order_id', $order->id)->firstOrFail();

    $response = $this->actingAs($admin)->get(route('admin.broker-invoices.pdf', $broker));
    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
    expect($response->getContent())->toStartWith('%PDF');
});

test('terbilang formats indonesian rupiah words', function () {
    expect(Terbilang::rupiah(1500))->toBe('Seribu lima ratus rupiah');
    expect(Terbilang::rupiah(30000000))->toBe('Tiga puluh juta rupiah');
    expect(Terbilang::make(0))->toBe('nol');
});
