<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Banner;
use App\Models\Category;
use App\Models\CompanyProfile;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            ['name' => 'Admin', 'password' => Hash::make('password'), 'role' => 'admin']
        )->update(['role' => 'admin']);

        CompanyProfile::current()->update([
            'name' => 'Rumah90 Group',
            'tagline' => 'Properti, Jasa & Material Bangunan dalam Satu Atap',
            'email' => 'halo@rumah90.id',
            'phone' => '+62 812-3456-7890',
            'website' => 'https://rumah90.id',
            'address' => 'Jl. Merdeka No. 90, Jakarta, Indonesia',
            'tax_number' => '01.234.567.8-901.000',
            'bank_name' => 'Bank Central Asia (BCA)',
            'bank_account' => '1234567890',
            'bank_holder' => 'PT Rumah90 Group',
            'about' => 'Rumah90 Group adalah mitra terpercaya untuk kebutuhan properti, jasa pembuatan website, dan material bangunan berkualitas.',
        ]);

        $banners = [
            [
                'title' => 'Temukan Hunian Impian Anda',
                'subtitle' => 'Ratusan pilihan rumah & properti dengan agen profesional siap membantu.',
                'image' => 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
                'cta_label' => 'Lihat Properti',
                'cta_link' => '/catalog?type=property',
                'sort' => 1,
            ],
            [
                'title' => 'Jasa Pembuatan Website Profesional',
                'subtitle' => 'Website modern, cepat, dan SEO friendly untuk bisnis Anda.',
                'image' => 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1600&q=80',
                'cta_label' => 'Mulai Sekarang',
                'cta_link' => '/catalog?type=service',
                'sort' => 2,
            ],
            [
                'title' => 'Material Bangunan Berkualitas',
                'subtitle' => 'Harga bersaing, stok lengkap, pengiriman cepat ke lokasi proyek.',
                'image' => 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
                'cta_label' => 'Belanja Material',
                'cta_link' => '/catalog?type=material',
                'sort' => 3,
            ],
        ];

        foreach ($banners as $banner) {
            Banner::create($banner);
        }

        $agents = [
            ['name' => 'Sari Wijaya', 'title' => 'Senior Property Agent', 'email' => 'sari@rumah90.id', 'phone' => '+62 811-1111-1111', 'photo' => 'https://i.pravatar.cc/300?img=47', 'bio' => 'Spesialis properti residensial dengan pengalaman 8 tahun.', 'bank_name' => 'BCA', 'bank_account' => '1234567890', 'bank_holder' => 'Sari Wijaya'],
            ['name' => 'Budi Santoso', 'title' => 'Web Solutions Consultant', 'email' => 'budi@rumah90.id', 'phone' => '+62 811-2222-2222', 'photo' => 'https://i.pravatar.cc/300?img=12', 'bio' => 'Membantu bisnis tumbuh lewat website yang efektif.', 'bank_name' => 'Mandiri', 'bank_account' => '0987654321', 'bank_holder' => 'Budi Santoso'],
            ['name' => 'Dewi Lestari', 'title' => 'Building Material Specialist', 'email' => 'dewi@rumah90.id', 'phone' => '+62 811-3333-3333', 'photo' => 'https://i.pravatar.cc/300?img=32', 'bio' => 'Ahli material bangunan & solusi proyek konstruksi.', 'bank_name' => 'BNI', 'bank_account' => '1122334455', 'bank_holder' => 'Dewi Lestari'],
        ];

        $agentModels = collect($agents)->map(fn ($a) => Agent::create($a));

        $categories = [
            ['name' => 'Properti & Rumah', 'slug' => 'properti-rumah', 'icon' => 'home', 'description' => 'Rumah, apartemen, tanah, dan properti komersial.'],
            ['name' => 'Jasa Pembuatan Website', 'slug' => 'jasa-website', 'icon' => 'code', 'description' => 'Pembuatan website, toko online, dan aplikasi.'],
            ['name' => 'Material Bangunan', 'slug' => 'material-bangunan', 'icon' => 'hammer', 'description' => 'Semen, besi, cat, dan kebutuhan konstruksi lainnya.'],
        ];

        $categoryModels = collect($categories)->map(fn ($c) => Category::create($c));

        $products = [
            // Properti
            ['cat' => 0, 'type' => 'property', 'name' => 'Rumah Minimalis Modern 2 Lantai', 'price' => 1250000000, 'unit' => '/unit', 'location' => 'Bandung', 'image' => 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80', 'short' => 'Rumah 3 kamar tidur, 2 kamar mandi, carport.', 'featured' => true],
            ['cat' => 0, 'type' => 'property', 'name' => 'Apartemen Studio City View', 'price' => 650000000, 'unit' => '/unit', 'location' => 'Jakarta Selatan', 'image' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 'short' => 'Fully furnished, lokasi strategis dekat MRT.', 'featured' => true],
            ['cat' => 0, 'type' => 'property', 'name' => 'Tanah Kavling Siap Bangun', 'price' => 850000000, 'unit' => '/kavling', 'location' => 'Tangerang', 'image' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', 'short' => 'Luas 200m², SHM, bebas banjir.', 'featured' => false],
            // Jasa Website
            ['cat' => 1, 'type' => 'service', 'name' => 'Paket Website Company Profile', 'price' => 5000000, 'unit' => '/paket', 'location' => null, 'image' => 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1200&q=80', 'short' => '5 halaman, desain custom, responsive, SEO dasar.', 'featured' => true],
            ['cat' => 1, 'type' => 'service', 'name' => 'Paket Toko Online (E-Commerce)', 'price' => 12000000, 'unit' => '/paket', 'location' => null, 'image' => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80', 'short' => 'Katalog produk, keranjang, pembayaran online.', 'featured' => true],
            ['cat' => 1, 'type' => 'service', 'name' => 'Paket Maintenance Bulanan', 'price' => 1500000, 'unit' => '/bulan', 'location' => null, 'image' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80', 'short' => 'Update konten, backup, dan keamanan website.', 'featured' => false],
            // Material
            ['cat' => 2, 'type' => 'material', 'name' => 'Semen Portland 50kg', 'price' => 65000, 'unit' => '/sak', 'location' => null, 'image' => 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', 'short' => 'Semen berkualitas untuk struktur kuat.', 'featured' => true],
            ['cat' => 2, 'type' => 'material', 'name' => 'Besi Beton Ulir 10mm', 'price' => 95000, 'unit' => '/batang', 'location' => null, 'image' => 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80', 'short' => 'SNI, panjang 12 meter, anti karat.', 'featured' => false],
            ['cat' => 2, 'type' => 'material', 'name' => 'Cat Tembok Premium 25kg', 'price' => 450000, 'unit' => '/pail', 'location' => null, 'image' => 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80', 'short' => 'Daya tutup tinggi, tahan cuaca, low odor.', 'featured' => true],
        ];

        foreach ($products as $index => $p) {
            $product = Product::create([
                'category_id' => $categoryModels[$p['cat']]->id,
                'agent_id' => $agentModels[$p['cat']]->id,
                'name' => $p['name'],
                'slug' => Str::slug($p['name']),
                'type' => $p['type'],
                'short_description' => $p['short'],
                'description' => $p['short'].' '.fake()->paragraph(4),
                'price' => $p['price'],
                'broker_commission_percent' => $p['type'] === 'property' ? 2.5 : 5,
                'agent_commission_percent' => $p['type'] === 'property' ? 1 : 2,
                'first_party_name' => 'Pemilik '.$p['name'],
                'unit' => $p['unit'],
                'location' => $p['location'],
                'image' => $p['image'],
                'featured' => $p['featured'],
                'status' => 'published',
            ]);

            foreach ([1, 2] as $sort) {
                $product->images()->create([
                    'path' => $p['image'].'&gallery='.$index.'-'.$sort,
                    'alt' => $p['name'],
                    'sort' => $sort,
                ]);
            }
        }
    }
}
