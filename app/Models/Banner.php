<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'image',
        'cta_label',
        'cta_link',
        'sort',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];
}
