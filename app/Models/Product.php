<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'agent_id',
        'name',
        'slug',
        'type',
        'short_description',
        'description',
        'price',
        'broker_commission_percent',
        'agent_commission_percent',
        'first_party_name',
        'first_party_phone',
        'first_party_address',
        'unit',
        'location',
        'image',
        'specs',
        'featured',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'broker_commission_percent' => 'decimal:2',
        'agent_commission_percent' => 'decimal:2',
        'specs' => 'array',
        'featured' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saving(function (Product $product) {
            if (blank($product->slug)) {
                $product->slug = Str::slug($product->name).'-'.Str::lower(Str::random(4));
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort');
    }
}
