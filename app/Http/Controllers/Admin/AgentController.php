<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\HandlesImageUploads;
use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AgentController extends Controller
{
    use HandlesImageUploads;

    public function index(): Response
    {
        return Inertia::render('admin/agents/index', [
            'agents' => Agent::withCount('products')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);
        $data['photo'] = $this->storeImage($request->file('photo'), 'agents');

        Agent::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Agen sales ditambahkan.']);

        return back();
    }

    public function update(Request $request, Agent $agent): RedirectResponse
    {
        $data = $this->validateData($request);
        $data['photo'] = $this->storeImage($request->file('photo'), 'agents', $agent->photo);

        $agent->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Agen sales diperbarui.']);

        return back();
    }

    public function destroy(Agent $agent): RedirectResponse
    {
        if ($agent->photo && ! str_starts_with($agent->photo, 'http')) {
            Storage::disk('public')->delete($agent->photo);
        }

        $agent->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Agen sales dihapus.']);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function validateData(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'bio' => ['nullable', 'string'],
            'active' => ['boolean'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'bank_account' => ['nullable', 'string', 'max:255'],
            'bank_holder' => ['nullable', 'string', 'max:255'],
        ]);
    }
}
