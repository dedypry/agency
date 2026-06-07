<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiService
{
    public function __construct(
        private readonly ?string $apiKey = null,
        private readonly string $model = 'gemini-2.5-flash',
    ) {}

    public static function make(): self
    {
        return new self(
            config('services.gemini.key'),
            config('services.gemini.model', 'gemini-2.5-flash'),
        );
    }

    /**
     * Generate a short and long product description from the product name.
     *
     * @return array{short_description: string, description: string}
     */
    public function generateProductDescription(string $name, ?string $type = null): array
    {
        $typeLabel = match ($type) {
            'property' => 'properti/real estate',
            'service' => 'jasa/layanan',
            'material' => 'material bangunan',
            default => 'produk',
        };

        $prompt = <<<PROMPT
        Anda adalah copywriter marketing profesional berbahasa Indonesia.
        Buatkan konten penjualan untuk {$typeLabel} dengan judul: "{$name}".

        Balas HANYA dalam format JSON valid (tanpa markdown, tanpa ```), dengan struktur:
        {
          "short_description": "satu kalimat ringkas maksimal 160 karakter, menarik dan menjual",
          "description": "deskripsi lengkap 2-3 paragraf yang persuasif, menonjolkan keunggulan, manfaat, dan ajakan menghubungi. Gunakan bahasa Indonesia yang natural."
        }
        PROMPT;

        $text = $this->generateContent($prompt);

        return $this->parseDescription($text, $name);
    }

    /**
     * Hold a contextual conversation grounded in a system instruction.
     *
     * @param  array<int, array{role: string, text: string}>  $history
     */
    public function chatReply(string $systemInstruction, array $history, string $userMessage): string
    {
        if (blank($this->apiKey)) {
            throw new RuntimeException('GEMINI_API_KEY belum dikonfigurasi.');
        }

        $contents = [];
        foreach ($history as $turn) {
            $role = ($turn['role'] ?? 'user') === 'bot' ? 'model' : 'user';
            $text = trim((string) ($turn['text'] ?? ''));
            if ($text !== '') {
                $contents[] = ['role' => $role, 'parts' => [['text' => $text]]];
            }
        }
        $contents[] = ['role' => 'user', 'parts' => [['text' => $userMessage]]];

        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent";

        $response = Http::timeout(30)
            ->withHeaders(['x-goog-api-key' => $this->apiKey])
            ->post($endpoint, [
                'system_instruction' => [
                    'parts' => [['text' => $systemInstruction]],
                ],
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.7,
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Gagal menghubungi Gemini AI: '.$response->status());
        }

        $text = data_get($response->json(), 'candidates.0.content.parts.0.text');

        if (blank($text)) {
            throw new RuntimeException('Gemini AI tidak mengembalikan jawaban.');
        }

        return trim($text);
    }

    private function generateContent(string $prompt): string
    {
        if (blank($this->apiKey)) {
            throw new RuntimeException('GEMINI_API_KEY belum dikonfigurasi.');
        }

        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent";

        $response = Http::timeout(30)
            ->withHeaders(['x-goog-api-key' => $this->apiKey])
            ->post($endpoint, [
                'contents' => [
                    ['parts' => [['text' => $prompt]]],
                ],
                'generationConfig' => [
                    'temperature' => 0.9,
                    'responseMimeType' => 'application/json',
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Gagal menghubungi Gemini AI: '.$response->status());
        }

        $text = data_get($response->json(), 'candidates.0.content.parts.0.text');

        if (blank($text)) {
            throw new RuntimeException('Gemini AI tidak mengembalikan konten.');
        }

        return $text;
    }

    /**
     * @return array{short_description: string, description: string}
     */
    private function parseDescription(string $text, string $fallbackName): array
    {
        $clean = trim(preg_replace('/^```(json)?|```$/m', '', $text) ?? $text);
        $data = json_decode($clean, true);

        return [
            'short_description' => is_array($data)
                ? (string) ($data['short_description'] ?? '')
                : str($clean)->limit(157)->value(),
            'description' => is_array($data)
                ? (string) ($data['description'] ?? $clean)
                : $clean,
        ];
    }
}
