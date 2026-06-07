<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\CompanyProfile;
use App\Models\Invoice;
use App\Models\Product;
use App\Support\Terbilang;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
    {
        $invoices = Invoice::with('agent')
            ->when($request->string('q')->toString(), function ($q, $term) {
                $q->where('number', 'like', "%{$term}%")
                    ->orWhere('customer_name', 'like', "%{$term}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/invoices/index', [
            'invoices' => $invoices,
            'filters' => $request->only('q'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/invoices/form', [
            'invoice' => null,
            'number' => Invoice::generateNumber(),
            'agents' => Agent::where('active', true)->orderBy('name')->get(),
            'products' => Product::orderBy('name')->get(['id', 'name', 'price', 'unit']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateData($request);

        $invoice = DB::transaction(function () use ($data) {
            $totals = $this->computeTotals($data);

            $invoice = Invoice::create([
                'number' => $data['number'] ?? Invoice::generateNumber(),
                'agent_id' => $data['agent_id'] ?? null,
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
                'customer_address' => $data['customer_address'] ?? null,
                'issue_date' => $data['issue_date'],
                'due_date' => $data['due_date'] ?? null,
                'status' => $data['status'],
                'discount' => $data['discount'] ?? 0,
                'tax_percent' => $data['tax_percent'] ?? 0,
                'notes' => $data['notes'] ?? null,
                ...$totals,
            ]);

            $this->syncItems($invoice, $data['items']);

            return $invoice;
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Invoice dibuat.']);

        return to_route('admin.invoices.show', $invoice);
    }

    public function show(Invoice $invoice): Response
    {
        $invoice->load(['agent', 'items.product']);

        return Inertia::render('admin/invoices/show', [
            'invoice' => $invoice,
            'company' => CompanyProfile::current(),
        ]);
    }

    public function downloadPdf(Invoice $invoice): HttpResponse
    {
        $invoice->load(['agent', 'items.product']);

        $options = new Options;
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'DejaVu Sans');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml(view('pdf.invoice', [
            'invoice' => $invoice,
            'company' => CompanyProfile::current(),
            'terbilang' => Terbilang::rupiah((float) $invoice->total),
        ])->render());
        $dompdf->setPaper('A4');
        $dompdf->render();

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$invoice->number.'.pdf"',
        ]);
    }

    public function edit(Invoice $invoice): Response
    {
        $invoice->load('items');

        return Inertia::render('admin/invoices/form', [
            'invoice' => $invoice,
            'number' => $invoice->number,
            'agents' => Agent::where('active', true)->orderBy('name')->get(),
            'products' => Product::orderBy('name')->get(['id', 'name', 'price', 'unit']),
        ]);
    }

    public function update(Request $request, Invoice $invoice): RedirectResponse
    {
        $data = $this->validateData($request);

        DB::transaction(function () use ($invoice, $data) {
            $totals = $this->computeTotals($data);

            $invoice->update([
                'agent_id' => $data['agent_id'] ?? null,
                'customer_name' => $data['customer_name'],
                'customer_email' => $data['customer_email'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
                'customer_address' => $data['customer_address'] ?? null,
                'issue_date' => $data['issue_date'],
                'due_date' => $data['due_date'] ?? null,
                'status' => $data['status'],
                'discount' => $data['discount'] ?? 0,
                'tax_percent' => $data['tax_percent'] ?? 0,
                'notes' => $data['notes'] ?? null,
                ...$totals,
            ]);

            $invoice->items()->delete();
            $this->syncItems($invoice, $data['items']);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Invoice diperbarui.']);

        return to_route('admin.invoices.show', $invoice);
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        $invoice->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Invoice dihapus.']);

        return to_route('admin.invoices.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validateData(Request $request): array
    {
        return $request->validate([
            'number' => ['nullable', 'string', 'max:255'],
            'agent_id' => ['nullable', 'exists:agents,id'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:50'],
            'customer_address' => ['nullable', 'string'],
            'issue_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date'],
            'status' => ['required', 'in:unpaid,paid,cancelled'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'tax_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['nullable', 'exists:products,id'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'numeric', 'min:0'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, float>
     */
    private function computeTotals(array $data): array
    {
        $subtotal = collect($data['items'])->sum(fn ($item) => (float) $item['quantity'] * (float) $item['unit_price']);
        $discount = (float) ($data['discount'] ?? 0);
        $taxPercent = (float) ($data['tax_percent'] ?? 0);
        $taxable = max($subtotal - $discount, 0);
        $taxAmount = round($taxable * $taxPercent / 100, 2);

        return [
            'subtotal' => round($subtotal, 2),
            'tax_amount' => $taxAmount,
            'total' => round($taxable + $taxAmount, 2),
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    private function syncItems(Invoice $invoice, array $items): void
    {
        foreach ($items as $item) {
            $invoice->items()->create([
                'product_id' => $item['product_id'] ?? null,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total' => round((float) $item['quantity'] * (float) $item['unit_price'], 2),
            ]);
        }
    }
}
