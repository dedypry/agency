<?php

use App\Models\Agent;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use Illuminate\Support\Facades\Notification;

test('visitor can place an order and admins get notified', function () {
    Notification::fake();

    $admin = User::factory()->create(['role' => 'admin']);
    $category = Category::create(['name' => 'Properti', 'slug' => 'properti-test']);
    $agent = Agent::create(['name' => 'Sales']);
    $product = Product::create([
        'category_id' => $category->id,
        'agent_id' => $agent->id,
        'name' => 'Rumah Minimalis',
        'slug' => 'rumah-minimalis',
        'type' => 'property',
        'price' => 500000000,
        'status' => 'published',
        'featured' => false,
    ]);

    $response = $this->post(route('checkout.store', $product), [
        'customer_name' => 'Budi',
        'customer_phone' => '08123456789',
        'quantity' => 2,
    ]);

    $order = Order::first();

    expect($order)->not->toBeNull();
    expect($order->total)->toEqual(1000000000);
    expect($order->product_name)->toBe('Rumah Minimalis');

    $response->assertRedirect(route('checkout.success', $order->number));

    Notification::assertSentTo($admin, NewOrderNotification::class);
});

test('admin can update order status', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $order = Order::create([
        'number' => Order::generateNumber(),
        'product_name' => 'Test',
        'customer_name' => 'Budi',
        'customer_phone' => '0812',
        'quantity' => 1,
        'unit_price' => 1000,
        'total' => 1000,
        'status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->put(route('admin.orders.update', $order), ['status' => 'completed'])
        ->assertRedirect();

    expect($order->fresh()->status)->toBe('completed');
});

test('non admin cannot view orders', function () {
    $sales = User::factory()->create(['role' => 'sales']);

    $this->actingAs($sales)
        ->get(route('admin.orders.index'))
        ->assertForbidden();
});
