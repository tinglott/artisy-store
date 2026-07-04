-- Invoice Variance B2B SaaS Schema
-- Supabase PostgreSQL database

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    business_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    monthly_invoice_volume INT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    current_quantity INT DEFAULT 0,
    reorder_quantity INT DEFAULT 10,
    unit_cost DECIMAL(10, 2),
    vendor_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(business_id, sku)
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    vendor_name VARCHAR(255),
    invoice_number VARCHAR(100),
    invoice_date DATE,
    total_amount DECIMAL(12, 2),
    file_url VARCHAR(500),
    extracted_text TEXT,
    raw_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Extracted items from invoices
CREATE TABLE IF NOT EXISTS extracted_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_name VARCHAR(255),
    sku VARCHAR(100),
    quantity INT,
    unit_price DECIMAL(10, 2),
    line_total DECIMAL(12, 2),
    matched_inventory_id UUID REFERENCES inventory(id),
    match_confidence DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Missing inventory detections
CREATE TABLE IF NOT EXISTS missing_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    extracted_item_id UUID REFERENCES extracted_items(id),
    item_name VARCHAR(255),
    sku VARCHAR(100),
    quantity_ordered INT,
    quantity_in_stock INT DEFAULT 0,
    shortage_quantity INT,
    variance_percentage DECIMAL(5, 2),
    status VARCHAR(50) DEFAULT 'pending', -- pending, po_generated, resolved
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Auto-generated purchase orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    po_number VARCHAR(100),
    vendor_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'draft', -- draft, generated, sent, confirmed
    total_amount DECIMAL(12, 2),
    po_pdf_url VARCHAR(500),
    triggered_by_invoice_id UUID REFERENCES invoices(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- PO line items
CREATE TABLE IF NOT EXISTS po_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    sku VARCHAR(100),
    item_name VARCHAR(255),
    quantity INT,
    unit_cost DECIMAL(10, 2),
    line_total DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_inventory_business_id ON inventory(business_id);
CREATE INDEX idx_invoices_business_id ON invoices(business_id);
CREATE INDEX idx_extracted_items_invoice_id ON extracted_items(invoice_id);
CREATE INDEX idx_missing_inventory_business_id ON missing_inventory(business_id);
CREATE INDEX idx_purchase_orders_business_id ON purchase_orders(business_id);

-- Row Level Security (Supabase)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE missing_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE po_items ENABLE ROW LEVEL SECURITY;
