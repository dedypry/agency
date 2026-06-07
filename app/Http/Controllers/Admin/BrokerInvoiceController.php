<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BrokerInvoice;
use App\Models\CompanyProfile;
use App\Services\CommissionService;
use App\Support\Terbilang;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class BrokerInvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $invoices = BrokerInvoice::with('agent')
            ->when($request->string('q')->toString(), function ($q, $term) {
                $q->where('number', 'like', "%{$term}%")
                    ->orWhere('first_party_name', 'like', "%{$term}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/broker-invoices/index', [
            'invoices' => $invoices,
            'filters' => $request->only('q'),
            'stats' => [
                'unpaid' => (float) BrokerInvoice::where('status', 'unpaid')->sum('amount'),
                'paid' => (float) BrokerInvoice::where('status', 'paid')->sum('amount'),
                'count' => BrokerInvoice::count(),
            ],
        ]);
    }

    public function show(BrokerInvoice $brokerInvoice): Response
    {
        $brokerInvoice->load(['agent', 'product', 'order']);

        return Inertia::render('admin/broker-invoices/show', [
            'invoice' => $brokerInvoice,
            'company' => CompanyProfile::current(),
        ]);
    }

    public function update(Request $request, BrokerInvoice $brokerInvoice, CommissionService $commissions): RedirectResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:unpaid,paid,cancelled'],
        ]);

        $brokerInvoice->update([
            'status' => $data['status'],
            'paid_at' => $data['status'] === 'paid' ? ($brokerInvoice->paid_at ?? now()->toDateString()) : null,
        ]);

        if ($data['status'] === 'paid') {
            $commissions->releaseAgentCommissions($brokerInvoice);
            Inertia::flash('toast', ['type' => 'success', 'message' => 'Penagihan lunas. Komisi agen otomatis dirilis (dibayar).']);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Status penagihan diperbarui.']);

        return back();
    }

    public function destroy(BrokerInvoice $brokerInvoice): RedirectResponse
    {
        $brokerInvoice->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Penagihan dihapus.']);

        return to_route('admin.broker-invoices.index');
    }

    public function downloadPdf(BrokerInvoice $brokerInvoice): HttpResponse
    {
        $brokerInvoice->load(['agent', 'product']);

        $options = new Options;
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'DejaVu Sans');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml(view('pdf.broker-invoice', [
            'invoice' => $brokerInvoice,
            'company' => CompanyProfile::current(),
            'terbilang' => Terbilang::rupiah((float) $brokerInvoice->amount),
        ])->render());
        $dompdf->setPaper('A4');
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$brokerInvoice->number.'.pdf"',
        ]);
    }
}
