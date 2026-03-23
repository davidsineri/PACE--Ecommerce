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
  metadata JSONB DEFAULT '{}',
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

INSERT INTO products (id, name, description, price, image_url, category, shop_id, rating, reviews_count, metadata) VALUES 
('p1', 'Noken Anggrek Asli Papua', 'Tas tradisional Papua yang dirajut dari serat kulit kayu dan anggrek. Sangat kuat dan tahan lama.', 350000, 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?q=80&w=800&auto=format&fit=crop', 'Kriya & Kerajinan', 'shop1', 4.8, 24, '{"origin": "Wamena, Papua", "artisan": "Yohanes Wenda", "material": "Serat kulit kayu & anggrek hutan", "story_id": "Noken adalah tas tradisional suku Dani yang sudah dibuat sejak ratusan tahun lalu. Setiap helai Noken ditenun dengan penuh kesabaran, menceritakan tentang kekayaan alam Papua yang melimpah. Anggrek hutan yang digunakan bukan hanya untuk keindahan, tetapi juga memiliki makna spiritual bagi masyarakat setempat.", "story_en": "The Noken is a traditional bag of the Dani tribe, crafted for centuries. Each strand is woven with patience, telling the story of Papua''s abundant nature. Forest orchids are used not only for beauty but hold spiritual meaning for the local community.", "culture": "Warisan budaya Suku Dani yang telah berlangsung selama berabad-abad"}'),
('p2', 'Kopi Arabika Wamena 250g', 'Kopi Arabika asli dari pegunungan Wamena. Ditanam secara organik di ketinggian 1.600 mdpl.', 850000, 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop', 'Makanan & Minuman', 'shop2', 4.9, 56, '{"origin": "Wamena, Jayawijaya, Papua", "artisan": "Koperasi Tani Wamena", "material": "Biji kopi arabika organik", "story_id": "Dipetik tangan oleh petani kopi suku Lanny di ketinggian 1.600 meter di atas permukaan laut. Kopi ini tumbuh subur di tanah vulkanis pegunungan tengah Papua yang kaya akan mineral. Setiap cangkir kopi adalah cerita tentang kerja keras petani lokal yang menjaga tradisi menanam kopi secara organik.", "story_en": "Hand-picked by Lanny tribe coffee farmers at 1,600 meters above sea level. This coffee thrives in the volcanic soil of central Papua''s mountains, rich in minerals. Every cup tells the story of local farmers maintaining organic farming traditions.", "culture": "Hasil bumi terbaik dari dataran tinggi Papua yang dikelola secara tradisional"}'),
('p3', 'Ukiran Kayu Asmat', 'Pajangan ukiran kayu khas suku Asmat, melambangkan roh leluhur. Dibuat dari kayu besi.', 1200000, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop', 'Seni & Ukiran', 'shop1', 5.0, 12, '{"origin": "Agats, Asmat, Papua", "artisan": "Amos Yewangara", "material": "Kayu besi pilihan (Driftwood)", "story_id": "Ukiran Asmat adalah simbol spiritual suku Asmat dalam menghormati leluhur. Pembuatannya memerlukan waktu berminggu-minggu, setiap goresan pahat menceritakan kisah-kisah luhur tentang hubungan manusia dengan alam dan roh leluhur. Ukiran ini bukan sekadar pajangan, melainkan saksi bisu keberanian suku Asmat.", "story_en": "Asmat wood carvings are spiritual symbols honoring ancestors. Creation takes weeks, each chisel mark tells stories of the profound relationship between humans, nature, and ancestral spirits. This carving is not merely decor, but a silent witness to the Asmat tribe''s courage.", "culture": "Warisan budaya Suku Asmat yang diakui UNESCO"}'),
('p4', 'Kain Batik Motif Burung Cendrawasih', 'Kain batik tulis dengan motif khas burung Cendrawasih Papua. Bahan katun primisima.', 450000, 'https://images.unsplash.com/photo-1605001011155-2ee7b2b11225?q=80&w=800&auto=format&fit=crop', 'Fashion & Kain', 'shop3', 4.7, 18, '{"origin": "Sentani, Jayapura, Papua", "artisan": "Ibu Metchy Yikwa", "material": "Kain katun primisima", "story_id": "Motif Burung Cendrawasih dalam batik Papua melambangkan keindahan dan kebebasan. Burung yang hanya hidup di tanah Papua ini menjadi simbol kebanggaan masyarakat setempat. Setiap helai kain dibuat dengan teknik batik tulis yang telah diwariskan turun-temurun dari generasi ke generasi.", "story_en": "The Bird of Paradise motif in Papua batik symbolizes beauty and freedom. This bird, native only to Papua, represents local pride. Each piece is crafted using traditional batik tulis technique passed down through generations.", "culture": "Warisan budaya Papua dengan motif khas Cendrawasih"}'),
('p5', 'Buah Merah Papua (Minyak)', 'Minyak Buah Merah murni hasil perasan buah merah pilihan dari pegunungan tengah Papua. Kaya akan antioksidan.', 250000, 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?q=80&w=800&auto=format&fit=crop', 'Hasil Bumi', 'shop2', 4.9, 42, '{"origin": "Baliem, Jayawijaya, Papua", "artisan": "Kampung Wesaput", "material": "Buah Merah murni (Pandanus conoideus)", "story_id": "Buah Merah telah lama dikenal masyarakat Papua sebagai obat tradisional dan bahan kecantikan alami. Dipanen langsung dari pegunungan Baliem yang segar, buah ini diolah secara tradisional menjadi minyak yang kaya akan vitamin E dan antioksidan. Dulu hanya para tetua adat yang mengetahui rahasianya.", "story_en": "Red Fruit has long been known to Papuans as traditional medicine and natural beauty ingredient. Harvested fresh from the fresh Baliem mountains, this fruit is traditionally processed into oil rich in vitamin E and antioxidants. Once, only tribal elders knew its secrets.", "culture": "Obat tradisional Papua yang telah digunakan sejak turun-temurun"}');

