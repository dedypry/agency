<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\CommissionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/orders/index', [
            'orders' => Order::with('agent')->latest()->paginate(15),
            'stats' => [
                'pending' => Order::where('status', 'pending')->count(),
                'total' => Order::count(),
                'revenue' => (float) Order::where('status', 'completed')->sum('total'),
            ],
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['agent', 'product']);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
        ]);
    }

    public function update(Request $request, Order $order, CommissionService $commissions): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,processing,completed,cancelled'],
        ]);

        $wasCompleted = $order->status === 'completed';
        $order->update($validated);

        if (! $wasCompleted && $order->status === 'completed') {
            $commissions->handleOrderCompleted($order);
            Inertia::flash('toast', ['type' => 'success', 'message' => 'Pesanan selesai. Komisi & penagihan pihak pertama dibuat otomatis.']);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Status pesanan diperbarui.']);

        return back();
    }

    public function destroy(Order $order): RedirectResponse
    {
        $order->delete();

        return redirect()->route('admin.orders.index')->with('success', 'Pesanan dihapus.');
    }
}
