-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('para_compartir','tacos','tacombos','quesadillas','bebidas','adiciones')),
  available BOOLEAN DEFAULT true,
  has_protein_choice BOOLEAN DEFAULT false,
  max_proteins INTEGER DEFAULT 0,
  has_costra_option BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PROTEINS
CREATE TABLE IF NOT EXISTS proteins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  extra_cost INTEGER DEFAULT 0
);

INSERT INTO proteins (name, extra_cost) VALUES
  ('Birria de res', 0),
  ('Chicharrón', 0),
  ('Chorizo Mexicano', 0),
  ('Tinga de Pollo', 0),
  ('Cochinita Pibil', 0),
  ('Nopal/Vegetariano', 0);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number INTEGER GENERATED ALWAYS AS IDENTITY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('pickup','delivery')),
  delivery_address TEXT,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','preparing','ready','delivered','cancelled')),
  bold_payment_id TEXT,
  bold_status TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_insert_anon" ON orders
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "orders_select_own" ON orders
  FOR SELECT TO anon USING (true);

CREATE POLICY "orders_all_service" ON orders
  FOR ALL TO service_role USING (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
