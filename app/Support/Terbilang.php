<?php

namespace App\Support;

class Terbilang
{
    private const SATUAN = [
        '', 'satu', 'dua', 'tiga', 'empat', 'lima',
        'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas',
    ];

    /**
     * Convert a number to Indonesian words (without "rupiah" suffix).
     */
    public static function make(float|int $number): string
    {
        $number = (int) floor(abs($number));

        $words = preg_replace('/\s+/', ' ', self::convert($number));

        return trim((string) $words) ?: 'nol';
    }

    /**
     * Convert a number to a capitalized Indonesian Rupiah phrase.
     */
    public static function rupiah(float|int $number): string
    {
        $words = self::make($number).' rupiah';

        return ucfirst($words);
    }

    private static function convert(int $number): string
    {
        if ($number < 12) {
            return ' '.self::SATUAN[$number];
        }

        if ($number < 20) {
            return self::convert($number - 10).' belas';
        }

        if ($number < 100) {
            return self::convert(intdiv($number, 10)).' puluh'.self::convert($number % 10);
        }

        if ($number < 200) {
            return ' seratus'.self::convert($number - 100);
        }

        if ($number < 1000) {
            return self::convert(intdiv($number, 100)).' ratus'.self::convert($number % 100);
        }

        if ($number < 2000) {
            return ' seribu'.self::convert($number - 1000);
        }

        if ($number < 1_000_000) {
            return self::convert(intdiv($number, 1000)).' ribu'.self::convert($number % 1000);
        }

        if ($number < 1_000_000_000) {
            return self::convert(intdiv($number, 1_000_000)).' juta'.self::convert($number % 1_000_000);
        }

        if ($number < 1_000_000_000_000) {
            return self::convert(intdiv($number, 1_000_000_000)).' miliar'.self::convert($number % 1_000_000_000);
        }

        return self::convert(intdiv($number, 1_000_000_000_000)).' triliun'.self::convert($number % 1_000_000_000_000);
    }
}
