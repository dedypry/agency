<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\Category;
use App\Models\Invoice;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'products' => Product::count(),
                'categories' => Category::count(),
                'agents' => Agent::count(),
                'invoices' => Invoice::count(),
                'revenue' => (float) Invoice::where('status', 'paid')->sum('total'),
                'unpaid' => (float) Invoice::where('status', 'unpaid')->sum('total'),
            ],
            'recentInvoices' => Invoice::with('agent')->latest()->take(5)->get(),
            'recentProducts' => Product::with(['category', 'agent'])->latest()->take(5)->get(),
        ]);
    }
}
