<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Category;
use App\Models\CompanyProfile;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('storefront/home', [
            'banners' => Banner::where('active', true)->orderBy('sort')->get(),
            'categories' => Category::where('active', true)
                ->withCount(['products' => fn ($q) => $q->where('status', 'published')])
                ->orderBy('name')
                ->get(),
            'featuredProducts' => Product::with(['category', 'agent'])
                ->where('status', 'published')
                ->where('featured', true)
                ->latest()
                ->take(8)
                ->get(),
            'latestProducts' => Product::with(['category', 'agent'])
                ->where('status', 'published')
                ->latest()
                ->take(8)
                ->get(),
            'company' => CompanyProfile::current(),
        ]);
    }
}
