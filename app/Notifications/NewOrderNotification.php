<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification
{
    use Queueable;

    public function __construct(public Order $order) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'number' => $this->order->number,
            'customer_name' => $this->order->customer_name,
            'product_name' => $this->order->product_name,
            'total' => (float) $this->order->total,
            'message' => "Pesanan baru #{$this->order->number} dari {$this->order->customer_name}",
        ];
    }
}
