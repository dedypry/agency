<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\CompanyProfile;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductCatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::with(['category', 'agent'])
            ->where('status', 'published')
            ->when($request->string('category')->toString(), function ($q, $slug) {
                $q->whereHas('category', fn ($c) => $c->where('slug', $slug));
            })
            ->when($request->string('type')->toString(), fn ($q, $type) => $q->where('type', $type))
            ->when($request->string('q')->toString(), function ($q, $term) {
                $q->where(fn ($w) => $w->where('name', 'like', "%{$term}%")
                    ->orWhere('short_description', 'like', "%{$term}%"));
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('storefront/catalog', [
            'products' => $products,
            'categories' => Category::where('active', true)->orderBy('name')->get(),
            'filters' => $request->only(['category', 'type', 'q']),
            'company' => CompanyProfile::current(),
        ]);
    }

    public function show(Product $product): Response
    {
        abort_unless($product->status === 'published', 404);

        $product->load(['category', 'agent', 'images']);

        return Inertia::render('storefront/product', [
            'product' => $product,
            'related' => Product::with(['category', 'agent'])
                ->where('status', 'published')
                ->where('category_id', $product->category_id)
                ->whereKeyNot($product->id)
                ->take(4)
                ->get(),
            'company' => CompanyProfile::current(),
        ]);
    }
}
