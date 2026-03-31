import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'database.sqlite');
export const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS shops (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    price INTEGER,
    image_url TEXT,
    category TEXT,
    shop_id TEXT,
    stock INTEGER DEFAULT 10,
    rating REAL DEFAULT 0,
    reviews_count INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT,
    user_name TEXT,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    user_name TEXT,
    content TEXT,
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    total INTEGER,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    product_id TEXT,
    name TEXT,
    price INTEGER,
    quantity INTEGER,
    image_url TEXT
  );
`);

// Seed data if empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (count.count === 0) {
  // Seed Shops
  const insertShop = db.prepare('INSERT INTO shops (id, user_id, name, description) VALUES (?, ?, ?, ?)');
  insertShop.run('shop1', 'user1', 'Noken Papua Jaya', 'Toko kerajinan tangan asli Papua');
  insertShop.run('shop2', 'user2', 'Kopi Pegunungan', 'Hasil bumi terbaik dari pegunungan tengah');
  insertShop.run('shop3', 'user3', 'Seni Asmat', 'Ukiran kayu otentik dari suku Asmat');

  const insertProduct = db.prepare('INSERT INTO products (id, name, description, price, image_url, category, shop_id, rating, reviews_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  
  const initialProducts = [
    {
      id: '1',
      name: 'Noken Anggrek Asli',
      description: 'Tas tradisional Papua yang dianyam dari serat kulit kayu dan anggrek hutan. Sangat kuat dan elastis, cocok untuk membawa barang sehari-hari dengan gaya etnik yang elegan.',
      price: 450000,
      image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
      shop_id: 'shop1',
      rating: 4.8,
      reviews_count: 24
    },
    {
      id: '2',
      name: 'Kopi Arabika Tiom',
      description: 'Kopi Arabika spesialti dari pegunungan Tiom, Lanny Jaya. Ditanam di ketinggian 2000 mdpl, menghasilkan cita rasa fruity yang khas dengan body yang tebal.',
      price: 120000,
      image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=800&auto=format&fit=crop',
      category: 'Hasil Bumi',
      shop_id: 'shop2',
      rating: 4.9,
      reviews_count: 56
    },
    {
      id: '3',
      name: 'Ukiran Kayu Asmat',
      description: 'Patung ukiran tangan asli dari suku Asmat. Terbuat dari kayu besi pilihan dengan detail ukiran yang menceritakan mitologi leluhur.',
      price: 1250000,
      image_url: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=800&auto=format&fit=crop',
      category: 'Seni',
      shop_id: 'shop3',
      rating: 5.0,
      reviews_count: 12
    },
    {
      id: '4',
      name: 'Kain Tenun Port Numbay',
      description: 'Kain tenun motif khas Jayapura (Port Numbay) dengan pewarna alami. Cocok untuk dijadikan pakaian formal atau dekorasi ruangan.',
      price: 850000,
      image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
      category: 'Fashion',
      shop_id: 'shop1',
      rating: 4.7,
      reviews_count: 18
    },
    {
      id: '5',
      name: 'Buah Merah Papua (Minyak)',
      description: 'Minyak Buah Merah murni hasil perasan buah merah pilihan dari pegunungan tengah Papua. Kaya akan antioksidan.',
      price: 250000,
      image_url: 'https://images.unsplash.com/photo-1546548970-71785318a17b?q=80&w=800&auto=format&fit=crop',
      category: 'Hasil Bumi',
      shop_id: 'shop2',
      rating: 4.9,
      reviews_count: 42
    }
  ];

  for (const p of initialProducts) {
    insertProduct.run(p.id, p.name, p.description, p.price, p.image_url, p.category, p.shop_id, p.rating, p.reviews_count);
  }

  // Seed some community posts
  const insertPost = db.prepare('INSERT INTO posts (id, user_name, content, likes, comments_count) VALUES (?, ?, ?, ?, ?)');
  insertPost.run('p1', 'Yohanes', 'Baru saja menerima Noken pesanan saya. Kualitas anyamannya luar biasa rapi! Bangga pakai produk lokal Papua.', 12, 3);
  insertPost.run('p2', 'Maria', 'Ada yang tau pengrajin ukiran Asmat yang bisa custom ukuran? Saya butuh untuk dekorasi cafe.', 5, 8);
}
