<?php

namespace App\Http\Controllers\Settings;

use App\Concerns\HandlesImageUploads;
use App\Http\Controllers\Controller;
use App\Models\CompanyProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    use HandlesImageUploads;

    public function edit(): Response
    {
        return Inertia::render('settings/company', [
            'company' => CompanyProfile::current(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $company = CompanyProfile::current();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'tax_number' => ['nullable', 'string', 'max:100'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'bank_account' => ['nullable', 'string', 'max:100'],
            'bank_holder' => ['nullable', 'string', 'max:255'],
            'about' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'max:2048'],
        ]);

        $data['logo'] = $this->storeImage($request->file('logo'), 'company', $company->logo);

        $company->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Profil perusahaan diperbarui.']);

        return back();
    }
}
