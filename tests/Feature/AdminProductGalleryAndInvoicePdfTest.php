<?php

use App\Models\Agent;
use App\Models\Category;
use App\Models\CompanyProfile;
use App\Models\Invoice;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can upload multiple gallery images for a product', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);
    $category = Category::create(['name' => 'Material', 'slug' => 'material-test']);
    $agent = Agent::create(['name' => 'Sales']);

    $this->actingAs($admin)
        ->post(route('admin.products.store'), [
            'category_id' => $category->id,
            'agent_id' => $agent->id,
            'name' => 'Produk Galeri',
            'type' => 'material',
            'price' => 125000,
            'status' => 'published',
            'featured' => false,
            'gallery' => [
                UploadedFile::fake()->image('gallery-1.jpg'),
                UploadedFile::fake()->image('gallery-2.jpg'),
            ],
        ])
        ->assertRedirect(route('admin.products.index'));

    $product = Product::where('name', 'Produk Galeri')->firstOrFail();

    expect($product->images)->toHaveCount(2);

    foreach ($product->images as $image) {
        Storage::disk('public')->assertExists($image->path);
    }
});

test('admin can download invoice pdf', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $agent = Agent::create(['name' => 'Sales']);
    CompanyProfile::current()->update(['name' => 'Rumah90 Test']);

    $invoice = Invoice::create([
        'number' => 'INV-TEST-0001',
        'agent_id' => $agent->id,
        'customer_name' => 'Pelanggan Test',
        'issue_date' => now()->toDateString(),
        'status' => 'unpaid',
        'subtotal' => 100000,
        'discount' => 0,
        'tax_percent' => 11,
        'tax_amount' => 11000,
        'total' => 111000,
    ]);

    $invoice->items()->create([
        'description' => 'Item Test',
        'quantity' => 1,
        'unit_price' => 100000,
        'total' => 100000,
    ]);

    $response = $this->actingAs($admin)->get(route('admin.invoices.pdf', $invoice));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
    expect($response->getContent())->toStartWith('%PDF');
});
