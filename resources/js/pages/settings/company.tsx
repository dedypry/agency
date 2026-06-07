import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { assetUrl } from '@/lib/utils';
import type { CompanyProfile } from '@/types';

export default function CompanySettings({
    company,
}: {
    company: CompanyProfile;
}) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        tagline: string;
        email: string;
        phone: string;
        website: string;
        address: string;
        tax_number: string;
        bank_name: string;
        bank_account: string;
        bank_holder: string;
        about: string;
        logo: File | null;
    }>({
        name: company.name ?? '',
        tagline: company.tagline ?? '',
        email: company.email ?? '',
        phone: company.phone ?? '',
        website: company.website ?? '',
        address: company.address ?? '',
        tax_number: company.tax_number ?? '',
        bank_name: company.bank_name ?? '',
        bank_account: company.bank_account ?? '',
        bank_holder: company.bank_holder ?? '',
        about: company.about ?? '',
        logo: null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/company', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Company profile" />
            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profil Perusahaan"
                    description="Informasi ini tampil di website dan invoice."
                />

                <form onSubmit={submit} className="space-y-6">
                    <div className="flex items-center gap-4">
                        {company.logo ? (
                            <img
                                src={assetUrl(company.logo)}
                                alt={company.name}
                                className="h-16 w-16 rounded-lg border border-border object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                                Logo
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="logo">Logo</Label>
                            <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData('logo', e.target.files?.[0] ?? null)
                                }
                            />
                            <InputError message={errors.logo} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Perusahaan</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                            id="tagline"
                            value={data.tagline}
                            onChange={(e) => setData('tagline', e.target.value)}
                        />
                        <InputError message={errors.tagline} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Telepon</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                value={data.website}
                                onChange={(e) =>
                                    setData('website', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tax_number">NPWP / Tax ID</Label>
                            <Input
                                id="tax_number"
                                value={data.tax_number}
                                onChange={(e) =>
                                    setData('tax_number', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Alamat</Label>
                        <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="bank_name">Nama Bank</Label>
                            <Input
                                id="bank_name"
                                value={data.bank_name}
                                onChange={(e) =>
                                    setData('bank_name', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bank_account">No. Rekening</Label>
                            <Input
                                id="bank_account"
                                value={data.bank_account}
                                onChange={(e) =>
                                    setData('bank_account', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bank_holder">Atas Nama</Label>
                            <Input
                                id="bank_holder"
                                value={data.bank_holder}
                                onChange={(e) =>
                                    setData('bank_holder', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="about">Tentang Perusahaan</Label>
                        <Textarea
                            id="about"
                            className="min-h-28"
                            value={data.about}
                            onChange={(e) => setData('about', e.target.value)}
                        />
                    </div>

                    <Button type="submit" disabled={processing}>
                        Simpan
                    </Button>
                </form>
            </div>
        </>
    );
}

CompanySettings.layout = {
    breadcrumbs: [
        { title: 'Company profile', href: '/settings/company' },
    ],
};
