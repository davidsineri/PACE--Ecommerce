-- Hapus tabel jika sudah ada (opsional, untuk reset)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS shop_orders CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Tabel Users (Untuk Admin/KYC/Pembeli)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Tabel Shops
CREATE TABLE shops (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Tabel Products
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  category TEXT,
  shop_id TEXT REFERENCES shops(id) ON DELETE CASCADE,
  rating REAL DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Tabel Reviews
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  user_name TEXT,
  rating INTEGER,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Tabel Posts (Komunitas)
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  user_name TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Tabel Orders (Transaksi Induk / Checkout)
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'PENDING', -- PENDING, PAID, CANCELLED
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Tabel Payments (Pembayaran Gateway)
CREATE TABLE payments (
  id TEXT PRIMARY KEY,
  order_id TEXT UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  payment_method TEXT,
  payment_gateway_ref TEXT, -- Referensi dari Midtrans/Xendit
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'PENDING', -- PENDING, SUCCESS, FAILED
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. Tabel Shop Orders (Pecahan Pesanan per Toko)
CREATE TABLE shop_orders (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  shop_id TEXT REFERENCES shops(id) ON DELETE SET NULL,
  subtotal INTEGER NOT NULL,
  shipping_cost INTEGER NOT NULL,
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'PENDING', -- PENDING, PROCESSING, SHIPPED, COMPLETED
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. Tabel Shipments (Pengiriman per Toko)
CREATE TABLE shipments (
  id TEXT PRIMARY KEY,
  shop_order_id TEXT UNIQUE REFERENCES shop_orders(id) ON DELETE CASCADE,
  courier TEXT NOT NULL, -- JNE, J&T, Pos, dll
  tracking_number TEXT, -- Nomor Resi
  shipping_address TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING', -- PENDING, IN_TRANSIT, DELIVERED
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 10. Tabel Order Items (Detail Barang)
CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  shop_order_id TEXT REFERENCES shop_orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  image_url TEXT
);

-- ==========================================
-- INSERT DUMMY DATA
-- ==========================================

INSERT INTO users (id, name, email, role) VALUES
('user1', 'Penjual Satu', 'penjual1@test.com', 'seller'),
('user2', 'Penjual Dua', 'penjual2@test.com', 'seller'),
('user3', 'Penjual Tiga', 'penjual3@test.com', 'seller'),
('buyer1', 'Pembeli Satu', 'pembeli1@test.com', 'buyer');

INSERT INTO shops (id, user_id, name, description) VALUES
('shop1', 'user1', 'Noken Papua Jaya', 'Toko kerajinan tangan asli Papua'),
('shop2', 'user2', 'Kopi Pegunungan', 'Hasil bumi terbaik dari pegunungan tengah'),
('shop3', 'user3', 'Seni Asmat', 'Ukiran kayu otentik dari suku Asmat');

INSERT INTO products (id, name, description, price, image_url, category, shop_id, rating, reviews_count) VALUES 
('p1', 'Noken Anggrek Asli Papua', 'Tas tradisional Papua yang dirajut dari serat kulit kayu dan anggrek. Sangat kuat dan tahan lama.', 350000, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', 'Kriya & Kerajinan', 'shop1', 4.8, 24),
('p2', 'Kopi Arabika Wamena 250g', 'Kopi Arabika asli dari pegunungan Wamena. Ditanam secara organik di ketinggian 1.600 mdpl.', 850000, 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop', 'Makanan & Minuman', 'shop2', 4.9, 56),
('p3', 'Ukiran Kayu Asmat', 'Pajangan ukiran kayu khas suku Asmat, melambangkan roh leluhur. Dibuat dari kayu besi.', 1200000, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop', 'Seni & Ukiran', 'shop1', 5.0, 12),
('p4', 'Kain Batik Motif Burung Cendrawasih', 'Kain batik tulis dengan motif khas burung Cendrawasih Papua. Bahan katun primisima.', 450000, 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800&auto=format&fit=crop', 'Fashion & Kain', 'shop3', 4.7, 18),
('p5', 'Buah Merah Papua (Minyak)', 'Minyak Buah Merah murni hasil perasan buah merah pilihan dari pegunungan tengah Papua. Kaya akan antioksidan.', 250000, 'https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800&auto=format&fit=crop', 'Hasil Bumi', 'shop2', 4.9, 42),
('p6', 'Paket Wisata Raja Ampat 3D2N', 'Paket wisata eksklusif menjelajahi keindahan bawah laut Raja Ampat. Termasuk penginapan, makan, dan transportasi lokal.', 4500000, 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=800&auto=format&fit=crop', 'Tempat Wisata', 'shop1', 5.0, 15),
('p7', 'Tur Budaya Lembah Baliem', 'Rasakan pengalaman hidup bersama suku Dani di Lembah Baliem. Termasuk kunjungan ke mumi dan festival budaya.', 3200000, 'https://images.unsplash.com/photo-1544441893-675973e31d85?q=80&w=800&auto=format&fit=crop', 'Tempat Wisata', 'shop2', 4.8, 8),
('p8', 'Eksplorasi Danau Sentani', 'Tur perahu mengelilingi pulau-pulau di Danau Sentani dan belajar melukis di kulit kayu.', 1500000, 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop', 'Tempat Wisata', 'shop3', 4.9, 21),
('p9', 'Ekspedisi Taman Nasional Lorentz', 'Jelajahi keanekaragaman hayati Taman Nasional Lorentz, dari pesisir hingga pegunungan bersalju.', 5500000, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop', 'Tempat Wisata', 'shop1', 5.0, 5),
('p10', 'Tiket Masuk Pantai Base G', 'Tiket masuk harian untuk menikmati keindahan dan sejarah Pantai Base G di Jayapura.', 50000, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop', 'Tempat Wisata', 'shop2', 4.7, 120);

