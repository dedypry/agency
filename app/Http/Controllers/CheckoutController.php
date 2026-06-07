<?php

namespace App\Http\Controllers;

use App\Models\CompanyProfile;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function create(Product $product): Response
    {
        abort_unless($product->status === 'published', 404);

        $product->load(['category', 'agent']);

        return Inertia::render('storefront/checkout', [
            'product' => $product,
            'company' => CompanyProfile::current(),
        ]);
    }

    public function store(Request $request, Product $product): RedirectResponse
    {
        abort_unless($product->status === 'published', 404);

        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:50'],
            'customer_address' => ['nullable', 'string', 'max:1000'],
            'quantity' => ['required', 'integer', 'min:1', 'max:9999'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $quantity = (int) $validated['quantity'];
        $unitPrice = (float) $product->price;

        $order = Order::create([
            'number' => Order::generateNumber(),
            'product_id' => $product->id,
            'agent_id' => $product->agent_id,
            'product_name' => $product->name,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'] ?? null,
            'customer_phone' => $validated['customer_phone'],
            'customer_address' => $validated['customer_address'] ?? null,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total' => $unitPrice * $quantity,
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new NewOrderNotification($order));

        return redirect()
            ->route('checkout.success', $order->number)
            ->with('success', 'Pesanan berhasil dikirim.');
    }

    public function success(string $number): Response
    {
        $order = Order::where('number', $number)->firstOrFail();

        return Inertia::render('storefront/checkout-success', [
            'order' => $order,
            'company' => CompanyProfile::current(),
        ]);
    }
}
