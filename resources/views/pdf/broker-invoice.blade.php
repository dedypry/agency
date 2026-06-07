<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <style>
        * { box-sizing: border-box; }
        body {
            color: #111827;
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            margin: 0;
        }
        .page { padding: 34px; }
        .header, .bill-row, .footer-row { display: table; width: 100%; }
        .col { display: table-cell; vertical-align: top; }
        .right { text-align: right; }
        .muted { color: #6b7280; }
        .tiny { font-size: 10px; }
        .company { font-size: 20px; font-weight: 700; margin: 0; }
        .invoice-title { font-size: 26px; font-weight: 700; letter-spacing: 1px; margin: 0; }
        .subtitle { color: #6b7280; font-size: 11px; margin-top: 2px; }
        .badge {
            border: 1px solid #d1d5db;
            border-radius: 4px;
            display: inline-block;
            font-size: 10px;
            font-weight: 700;
            margin-top: 6px;
            padding: 3px 8px;
        }
        .logo { border-radius: 8px; height: 58px; margin-right: 12px; object-fit: cover; width: 58px; }
        .company-row { display: table; }
        .company-logo, .company-copy { display: table-cell; vertical-align: top; }
        .section { margin-top: 30px; }
        table { border-collapse: collapse; margin-top: 28px; width: 100%; }
        th {
            border-bottom: 2px solid #d1d5db;
            color: #374151;
            font-size: 11px;
            padding: 8px 6px;
            text-align: left;
            text-transform: uppercase;
        }
        td { border-bottom: 1px solid #e5e7eb; padding: 9px 6px; }
        .number { text-align: right; }
        .totals { margin-left: auto; margin-top: 18px; width: 290px; }
        .totals div { display: table; width: 100%; }
        .totals span { display: table-cell; padding: 3px 0; }
        .grand-total {
            border-top: 2px solid #d1d5db;
            font-size: 15px;
            font-weight: 700;
            margin-top: 6px;
            padding-top: 6px;
        }
        .terbilang {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-style: italic;
            margin-top: 22px;
            padding: 10px 12px;
        }
        .notes { border-top: 1px solid #e5e7eb; margin-top: 26px; padding-top: 14px; }
        .thanks { color: #9ca3af; font-size: 11px; margin-top: 36px; text-align: center; }
    </style>
</head>
<body>
    @php
        $statusLabels = [
            'paid' => 'LUNAS',
            'unpaid' => 'BELUM DIBAYAR',
            'cancelled' => 'DIBATALKAN',
        ];

        $logo = null;
        if ($company->logo) {
            $logo = str_starts_with($company->logo, 'http')
                ? $company->logo
                : public_path('storage/'.$company->logo);
        }
    @endphp

    <div class="page">
        <div class="header">
            <div class="col">
                <div class="company-row">
                    @if ($logo)
                        <div class="company-logo">
                            <img class="logo" src="{{ $logo }}" alt="{{ $company->name }}">
                        </div>
                    @endif
                    <div class="company-copy">
                        <h1 class="company">{{ $company->name }}</h1>
                        @if ($company->tagline)
                            <div class="muted tiny">{{ $company->tagline }}</div>
                        @endif
                        @if ($company->address)
                            <div class="muted tiny" style="max-width: 280px;">{{ $company->address }}</div>
                        @endif
                        <div class="muted tiny">{{ collect([$company->phone, $company->email])->filter()->join(' · ') }}</div>
                    </div>
                </div>
            </div>
            <div class="col right">
                <h2 class="invoice-title">INVOICE KOMISI</h2>
                <div class="subtitle">Penagihan Komisi Broker</div>
                <div><strong>{{ $invoice->number }}</strong></div>
                <div class="badge">{{ $statusLabels[$invoice->status] ?? strtoupper($invoice->status) }}</div>
            </div>
        </div>

        <div class="bill-row section">
            <div class="col">
                <div class="muted tiny"><strong>DITAGIHKAN KEPADA (PIHAK PERTAMA)</strong></div>
                <div><strong>{{ $invoice->first_party_name }}</strong></div>
                @if ($invoice->first_party_address)
                    <div class="muted">{{ $invoice->first_party_address }}</div>
                @endif
                @if ($invoice->first_party_phone)
                    <div class="muted">{{ $invoice->first_party_phone }}</div>
                @endif
            </div>
            <div class="col right">
                <div><span class="muted">Tanggal Terbit:</span> {{ $invoice->issue_date->format('d M Y') }}</div>
                @if ($invoice->due_date)
                    <div><span class="muted">Jatuh Tempo:</span> {{ $invoice->due_date->format('d M Y') }}</div>
                @endif
                @if ($invoice->agent)
                    <div><span class="muted">Agen:</span> {{ $invoice->agent->name }}</div>
                @endif
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Deskripsi</th>
                    <th class="number">Nilai Acuan</th>
                    <th class="number">Komisi</th>
                    <th class="number">Jumlah</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $invoice->description }}</td>
                    <td class="number">Rp {{ number_format((float) $invoice->base_amount, 0, ',', '.') }}</td>
                    <td class="number">{{ rtrim(rtrim(number_format((float) $invoice->percent, 2, ',', '.'), '0'), ',') }}%</td>
                    <td class="number">Rp {{ number_format((float) $invoice->amount, 0, ',', '.') }}</td>
                </tr>
            </tbody>
        </table>

        <div class="totals">
            <div class="grand-total"><span>Total Tagihan</span><span class="right">Rp {{ number_format((float) $invoice->amount, 0, ',', '.') }}</span></div>
        </div>

        <div class="terbilang">
            <strong>Terbilang:</strong> {{ $terbilang }}
        </div>

        @if ($company->bank_name || $invoice->notes)
            <div class="notes footer-row">
                @if ($company->bank_name)
                    <div class="col">
                        <strong>Pembayaran ke {{ $company->name }}</strong><br>
                        {{ $company->bank_name }}<br>
                        {{ $company->bank_account }} @if($company->bank_holder) a.n. {{ $company->bank_holder }} @endif
                    </div>
                @endif
                @if ($invoice->notes)
                    <div class="col">
                        <strong>Catatan</strong><br>
                        {!! nl2br(e($invoice->notes)) !!}
                    </div>
                @endif
            </div>
        @endif

        <p class="thanks">Dokumen ini sah dan diproses oleh komputer.</p>
    </div>
</body>
</html>
