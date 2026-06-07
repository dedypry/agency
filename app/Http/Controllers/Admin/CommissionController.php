<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\CommissionPayment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommissionController extends Controller
{
    public function index(Request $request): Response
    {
        $payments = CommissionPayment::with('agent')
            ->when($request->integer('agent_id'), fn ($q, $id) => $q->where('agent_id', $id))
            ->latest('paid_at')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/commissions/index', [
            'payments' => $payments,
            'agents' => Agent::orderBy('name')->get([
                'id', 'name', 'bank_name', 'bank_account', 'bank_holder',
            ]),
            'filters' => ['agent_id' => $request->integer('agent_id') ?: null],
            'stats' => [
                'total_paid' => (float) CommissionPayment::where('status', 'paid')->sum('amount'),
                'total_pending' => (float) CommissionPayment::where('status', 'pending')->sum('amount'),
                'count' => CommissionPayment::count(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'agent_id' => ['required', 'exists:agents,id'],
            'amount' => ['required', 'numeric', 'min:0'],
            'period' => ['nullable', 'string', 'max:255'],
            'method' => ['nullable', 'string', 'max:255'],
            'reference' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:pending,paid'],
            'paid_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        CommissionPayment::create($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pembayaran komisi dicatat.']);

        return back();
    }

    public function update(Request $request, CommissionPayment $commission): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,paid'],
        ]);

        $commission->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Status komisi diperbarui.']);

        return back();
    }

    public function destroy(CommissionPayment $commission): RedirectResponse
    {
        $commission->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pembayaran komisi dihapus.']);

        return back();
    }
}
