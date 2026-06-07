<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BrokerInvoice extends Model
{
    protected $fillable = [
        'number',
        'order_id',
        'product_id',
        'agent_id',
        'first_party_name',
        'first_party_phone',
        'first_party_address',
        'description',
        'base_amount',
        'percent',
        'amount',
        'status',
        'issue_date',
        'due_date',
        'paid_at',
        'notes',
    ];

    protected $casts = [
        'base_amount' => 'decimal:2',
        'percent' => 'decimal:2',
        'amount' => 'decimal:2',
        'issue_date' => 'date',
        'due_date' => 'date',
        'paid_at' => 'date',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    public static function generateNumber(): string
    {
        $prefix = 'BRK-'.now()->format('Ymd').'-';
        $last = static::where('number', 'like', $prefix.'%')->orderByDesc('number')->first();
        $seq = $last ? ((int) substr($last->number, -4)) + 1 : 1;

        return $prefix.str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }
}
