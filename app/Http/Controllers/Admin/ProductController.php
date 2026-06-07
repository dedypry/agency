<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\HandlesImageUploads;
use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    use HandlesImageUploads;

    public function index(Request $request): Response
    {
        $products = Product::with(['category', 'agent'])
            ->when($request->string('q')->toString(), fn ($q, $term) => $q->where('name', 'like', "%{$term}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'filters' => $request->only('q'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => null,
            'categories' => Category::orderBy('name')->get(),
            'agents' => Agent::where('active', true)->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = collect($this->validateData($request))
            ->except(['gallery', 'remove_gallery_ids'])
            ->all();
        $data = $this->normalizeCommission($data);
        $data['image'] = $this->storeImage($request->file('image'), 'products');

        $product = Product::create($data);
        $this->storeGalleryImages($product, $request);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produk ditambahkan.']);

        return to_route('admin.products.index');
    }

    public function edit(Product $product): Response
    {
        $product->load('images');

        return Inertia::render('admin/products/form', [
            'product' => $product,
            'categories' => Category::orderBy('name')->get(),
            'agents' => Agent::where('active', true)->orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $data = collect($this->validateData($request))
            ->except(['gallery', 'remove_gallery_ids'])
            ->all();
        $data = $this->normalizeCommission($data);
        $data['image'] = $this->storeImage($request->file('image'), 'products', $product->image);

        $product->update($data);
        $this->deleteGalleryImages($product, $request->array('remove_gallery_ids'));
        $this->storeGalleryImages($product, $request);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produk diperbarui.']);

        return to_route('admin.products.index');
    }

    public function destroy(Product $product): RedirectResponse
    {
        if ($product->image && ! str_starts_with($product->image, 'http')) {
            Storage::disk('public')->delete($product->image);
        }

        foreach ($product->images as $image) {
            if (! str_starts_with($image->path, 'http')) {
                Storage::disk('public')->delete($image->path);
            }
        }

        $product->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produk dihapus.']);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validateData(Request $request): array
    {
        return $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'agent_id' => ['nullable', 'exists:agents,id'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:property,service,material,product'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'broker_commission_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'agent_commission_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'first_party_name' => ['nullable', 'string', 'max:255'],
            'first_party_phone' => ['nullable', 'string', 'max:50'],
            'first_party_address' => ['nullable', 'string', 'max:500'],
            'unit' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'featured' => ['boolean'],
            'status' => ['required', 'in:published,draft'],
            'image' => ['nullable', 'image', 'max:4096'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['image', 'max:4096'],
            'remove_gallery_ids' => ['nullable', 'array'],
            'remove_gallery_ids.*' => ['integer', 'exists:product_images,id'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalizeCommission(array $data): array
    {
        $data['broker_commission_percent'] = $data['broker_commission_percent'] ?? 0;
        $data['agent_commission_percent'] = $data['agent_commission_percent'] ?? 0;

        return $data;
    }

    private function storeGalleryImages(Product $product, Request $request): void
    {
        foreach ($this->storeImages($request->file('gallery', []), 'products/gallery') as $path) {
            $product->images()->create([
                'path' => $path,
                'alt' => $product->name,
                'sort' => (int) $product->images()->max('sort') + 1,
            ]);
        }
    }

    /**
     * @param  array<int, mixed>  $imageIds
     */
    private function deleteGalleryImages(Product $product, array $imageIds): void
    {
        if ($imageIds === []) {
            return;
        }

        $images = $product->images()->whereIn('id', $imageIds)->get();

        foreach ($images as $image) {
            if (! str_starts_with($image->path, 'http')) {
                Storage::disk('public')->delete($image->path);
            }

            $image->delete();
        }
    }
}
