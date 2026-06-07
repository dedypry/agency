<?php

namespace App\Http\Controllers;

use App\Models\CompanyProfile;
use App\Models\Product;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class ChatbotController extends Controller
{
    public function ask(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
            'history' => ['nullable', 'array', 'max:20'],
            'history.*.role' => ['required_with:history', 'in:user,bot'],
            'history.*.text' => ['required_with:history', 'string', 'max:2000'],
        ]);

        try {
            $reply = GeminiService::make()->chatReply(
                $this->buildContext(),
                $validated['history'] ?? [],
                $validated['message'],
            );

            return response()->json(['reply' => $reply]);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'reply' => 'Maaf, asisten sedang tidak tersedia. Silakan hubungi kami langsung untuk bantuan.',
            ], 200);
        }
    }

    private function buildContext(): string
    {
        $company = CompanyProfile::current();

        $products = Product::with('category')
            ->where('status', 'published')
            ->latest()
            ->take(60)
            ->get()
            ->map(function (Product $p) {
                $price = number_format((float) $p->price, 0, ',', '.');
                $parts = [
                    "- {$p->name} (".($p->category->name ?? $p->type).')',
                    "harga Rp{$price}".($p->unit ? " {$p->unit}" : ''),
                ];
                if ($p->location) {
                    $parts[] = "lokasi {$p->location}";
                }
                if ($p->short_description) {
                    $parts[] = $p->short_description;
                }

                return implode(' | ', $parts);
            })
            ->implode("\n");

        $companyInfo = collect([
            'Nama' => $company->name,
            'Tagline' => $company->tagline,
            'Telepon' => $company->phone,
            'Email' => $company->email,
            'Alamat' => $company->address,
            'Tentang' => $company->about,
        ])->filter()->map(fn ($v, $k) => "{$k}: {$v}")->implode("\n");

        return <<<CONTEXT
        Anda adalah asisten virtual ramah untuk perusahaan berikut. Jawab pertanyaan calon pelanggan
        seputar produk, jasa, harga, dan layanan HANYA berdasarkan data di bawah. Gunakan Bahasa Indonesia
        yang sopan, singkat, dan membantu. Jika pertanyaan di luar data yang tersedia atau butuh detail lanjut,
        sarankan menghubungi kontak perusahaan atau membuka halaman katalog. Jangan mengarang produk atau harga
        yang tidak ada. Boleh merekomendasikan produk yang relevan.

        == PROFIL PERUSAHAAN ==
        {$companyInfo}

        == DAFTAR PRODUK & LAYANAN ==
        {$products}
        CONTEXT;
    }
}
