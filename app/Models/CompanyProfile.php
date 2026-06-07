<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyProfile extends Model
{
    protected $fillable = [
        'name',
        'tagline',
        'logo',
        'email',
        'phone',
        'website',
        'address',
        'tax_number',
        'bank_name',
        'bank_account',
        'bank_holder',
        'about',
    ];

    /**
     * Get the single company profile row, creating a default one if missing.
     */
    public static function current(): self
    {
        return static::firstOrCreate(['id' => 1], [
            'name' => config('app.name', 'My Company'),
        ]);
    }
}
