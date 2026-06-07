<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AiController extends Controller
{
    public function productDescription(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'in:property,service,material,product'],
        ]);

        try {
            $result = GeminiService::make()->generateProductDescription(
                $validated['name'],
                $validated['type'] ?? null,
            );

            return response()->json($result);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => $e->getMessage() ?: 'Gagal membuat deskripsi dengan AI.',
            ], 422);
        }
    }
}
