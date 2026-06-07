<?php

namespace App\Services;

use App\Models\BrokerInvoice;
use App\Models\CommissionPayment;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class CommissionService
{
    /**
     * When a sale (order) is completed:
     * 1. Create a billing invoice to the first party for 90Home's broker commission.
     * 2. Create the agent's commission (kept pending until the first party pays).
     */
    public function handleOrderCompleted(Order $order): void
    {
        $product = $order->product()->first();

        if (! $product) {
            return;
        }

        $base = (float) $order->total;

        DB::transaction(function () use ($order, $product, $base) {
            $brokerPercent = (float) $product->broker_commission_percent;
            $brokerAmount = round($base * $brokerPercent / 100, 2);

            if ($brokerPercent > 0 && $brokerAmount > 0 && ! BrokerInvoice::where('order_id', $order->id)->exists()) {
                BrokerInvoice::create([
                    'number' => BrokerInvoice::generateNumber(),
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'agent_id' => $order->agent_id,
                    'first_party_name' => $product->first_party_name ?: ('Pemilik '.$product->name),
                    'first_party_phone' => $product->first_party_phone,
                    'first_party_address' => $product->first_party_address,
                    'description' => 'Komisi broker atas penjualan '.$product->name.' (Pesanan '.$order->number.')',
                    'base_amount' => $base,
                    'percent' => $brokerPercent,
                    'amount' => $brokerAmount,
                    'status' => 'unpaid',
                    'issue_date' => now()->toDateString(),
                    'due_date' => now()->addDays(14)->toDateString(),
                ]);
            }

            $agentPercent = (float) $product->agent_commission_percent;
            $agentAmount = round($base * $agentPercent / 100, 2);

            if ($order->agent_id && $agentPercent > 0 && $agentAmount > 0) {
                CommissionPayment::firstOrCreate(
                    ['order_id' => $order->id, 'auto' => true],
                    [
                        'agent_id' => $order->agent_id,
                        'amount' => $agentAmount,
                        'percent' => $agentPercent,
                        'period' => now()->translatedFormat('F Y'),
                        'method' => 'transfer',
                        'status' => 'pending',
                        'notes' => 'Komisi otomatis dari penjualan '.$product->name.' (Pesanan '.$order->number.').',
                    ]
                );
            }
        });
    }

    /**
     * Once the first party pays the broker invoice, release (mark paid) the
     * agent commission tied to the same order.
     */
    public function releaseAgentCommissions(BrokerInvoice $invoice): void
    {
        if ($invoice->status !== 'paid' || ! $invoice->order_id) {
            return;
        }

        CommissionPayment::where('order_id', $invoice->order_id)
            ->where('auto', true)
            ->where('status', 'pending')
            ->update([
                'status' => 'paid',
                'paid_at' => now()->toDateString(),
            ]);
    }
}
