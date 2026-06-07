export type ProductType = 'property' | 'service' | 'material' | 'product';

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
    description?: string | null;
    active: boolean;
    products_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Agent {
    id: number;
    name: string;
    title?: string | null;
    email?: string | null;
    phone?: string | null;
    photo?: string | null;
    bio?: string | null;
    active: boolean;
    bank_name?: string | null;
    bank_account?: string | null;
    bank_holder?: string | null;
    products_count?: number;
}

export type CommissionStatus = 'pending' | 'paid';

export interface CommissionPayment {
    id: number;
    agent_id: number;
    order_id?: number | null;
    amount: string | number;
    percent?: string | number | null;
    period?: string | null;
    method?: string | null;
    reference?: string | null;
    status: CommissionStatus;
    auto?: boolean;
    paid_at?: string | null;
    notes?: string | null;
    created_at?: string;
    agent?: Agent | null;
}

export type BrokerInvoiceStatus = 'unpaid' | 'paid' | 'cancelled';

export interface BrokerInvoice {
    id: number;
    number: string;
    order_id?: number | null;
    product_id?: number | null;
    agent_id?: number | null;
    first_party_name: string;
    first_party_phone?: string | null;
    first_party_address?: string | null;
    description: string;
    base_amount: string | number;
    percent: string | number;
    amount: string | number;
    status: BrokerInvoiceStatus;
    issue_date: string;
    due_date?: string | null;
    paid_at?: string | null;
    notes?: string | null;
    created_at?: string;
    agent?: Agent | null;
    product?: Product | null;
    order?: Order | null;
}

export interface Product {
    id: number;
    category_id: number;
    agent_id?: number | null;
    name: string;
    slug: string;
    type: ProductType;
    short_description?: string | null;
    description?: string | null;
    price: string | number;
    broker_commission_percent?: string | number | null;
    agent_commission_percent?: string | number | null;
    first_party_name?: string | null;
    first_party_phone?: string | null;
    first_party_address?: string | null;
    unit?: string | null;
    location?: string | null;
    image?: string | null;
    featured: boolean;
    status: 'published' | 'draft';
    category?: Category;
    agent?: Agent | null;
    images?: ProductImage[];
}

export interface ProductImage {
    id: number;
    product_id: number;
    path: string;
    alt?: string | null;
    sort: number;
}

export interface Banner {
    id: number;
    title: string;
    subtitle?: string | null;
    image: string;
    cta_label?: string | null;
    cta_link?: string | null;
    sort: number;
    active: boolean;
}

export interface CompanyProfile {
    id: number;
    name: string;
    tagline?: string | null;
    logo?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
    address?: string | null;
    tax_number?: string | null;
    bank_name?: string | null;
    bank_account?: string | null;
    bank_holder?: string | null;
    about?: string | null;
}

export interface InvoiceItem {
    id?: number;
    invoice_id?: number;
    product_id?: number | null;
    description: string;
    quantity: string | number;
    unit_price: string | number;
    total?: string | number;
    product?: Product | null;
}

export interface Invoice {
    id: number;
    number: string;
    agent_id?: number | null;
    customer_name: string;
    customer_email?: string | null;
    customer_phone?: string | null;
    customer_address?: string | null;
    issue_date: string;
    due_date?: string | null;
    status: 'unpaid' | 'paid' | 'cancelled';
    subtotal: string | number;
    discount: string | number;
    tax_percent: string | number;
    tax_amount: string | number;
    total: string | number;
    notes?: string | null;
    agent?: Agent | null;
    items?: InvoiceItem[];
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
    id: number;
    number: string;
    product_id?: number | null;
    agent_id?: number | null;
    product_name: string;
    customer_name: string;
    customer_email?: string | null;
    customer_phone: string;
    customer_address?: string | null;
    quantity: number;
    unit_price: string | number;
    total: string | number;
    status: OrderStatus;
    notes?: string | null;
    created_at?: string;
    agent?: Agent | null;
    product?: Product | null;
}

export interface AppNotification {
    id: string;
    read_at: string | null;
    created_at: string;
    data: {
        order_id: number;
        number: string;
        customer_name: string;
        product_name: string;
        total: number;
        message: string;
    };
}

export interface NotificationBag {
    unread_count: number;
    items: AppNotification[];
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}
