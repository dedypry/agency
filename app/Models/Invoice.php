<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    protected $fillable = [
        'number',
        'agent_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'issue_date',
        'due_date',
        'status',
        'subtotal',
        'discount',
        'tax_percent',
        'tax_amount',
        'total',
        'notes',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax_percent' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public static function generateNumber(): string
    {
        $prefix = 'INV-'.now()->format('Ymd').'-';
        $last = static::where('number', 'like', $prefix.'%')->orderByDesc('number')->first();
        $seq = $last ? ((int) substr($last->number, -4)) + 1 : 1;

        return $prefix.str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }
}
