<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\HandlesImageUploads;
use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    use HandlesImageUploads;

    public function index(): Response
    {
        return Inertia::render('admin/banners/index', [
            'banners' => Banner::orderBy('sort')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request, true);
        $data['image'] = $this->storeImage($request->file('image'), 'banners');

        Banner::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Banner ditambahkan.']);

        return back();
    }

    public function update(Request $request, Banner $banner): RedirectResponse
    {
        $data = $this->validateData($request, false);
        $data['image'] = $this->storeImage($request->file('image'), 'banners', $banner->image);

        $banner->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Banner diperbarui.']);

        return back();
    }

    public function destroy(Banner $banner): RedirectResponse
    {
        if ($banner->image && ! str_starts_with($banner->image, 'http')) {
            Storage::disk('public')->delete($banner->image);
        }

        $banner->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Banner dihapus.']);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validateData(Request $request, bool $creating): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'cta_label' => ['nullable', 'string', 'max:100'],
            'cta_link' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'integer'],
            'active' => ['boolean'],
            'image' => [$creating ? 'required' : 'nullable', 'image', 'max:4096'],
        ]);
    }
}
