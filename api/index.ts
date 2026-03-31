// dotenv sudah di-load oleh server.ts sebelum file ini di-import.
// Jangan panggil dotenv.config() di sini agar tidak ada konflik urutan load.
import express from "express";
import cors from "cors";
import axios from "axios";
import { createClient } from '@supabase/supabase-js';
import midtransClient from 'midtrans-client';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY harus diisi di file .env"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Midtrans Snap API
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
});

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes

// Helper untuk respon error standar
const handleError = (res: any, error: any, message: string = "Internal Server Error") => {
  console.error(message, error);
  return res.status(500).json({ error: message, details: error.message || error });
};

// 1. Products
app.get("/api/products", async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = supabase.from('products').select('*');

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category && category !== 'Semua') {
      query = query.eq('category', category);
    }

    if (sort === 'termurah') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'termahal') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('id', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return res.json(data || []);
  } catch (error) {
    return handleError(res, error, "Gagal mengambil produk");
  }
});

// Payment Token Endpoint
app.post("/api/payments/token", async (req, res) => {
  try {
    const { orderId, totalAmount, customerDetails } = req.body;
    
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount
      },
      customer_details: {
        first_name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone
      }
    };

    const transaction = await snap.createTransaction(parameter);
    return res.json({ token: transaction.token });
  } catch (error) {
    return handleError(res, error, "Gagal membuat token pembayaran");
  }
});

app.get("/api/products/:id", async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// 2. Reviews
app.get("/api/products/:id/reviews", async (req, res) => {
  try {
    const { data, error } = await supabase.from('reviews').select('*').eq('product_id', req.params.id).order('created_at', { ascending: false });
    if (error) throw error;
    return res.json(data || []);
  } catch (error) {
    return handleError(res, error, "Gagal mengambil ulasan");
  }
});

app.post("/api/products/:id/reviews", async (req, res) => {
  try {
    const { userName, rating, comment } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    
    const { error } = await supabase.from('reviews').insert({
      id,
      product_id: req.params.id,
      user_name: userName || 'Anonim',
      rating,
      comment
    });
    
    if (error) throw error;

    // Update product rating and count
    const { data: reviews } = await supabase.from('reviews').select('rating').eq('product_id', req.params.id);
    if (reviews) {
      const newRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
      await supabase.from('products').update({ rating: newRating, reviews_count: reviews.length }).eq('id', req.params.id);
    }
    
    return res.json({ success: true });
  } catch (error) {
    return handleError(res, error, "Gagal menambahkan ulasan");
  }
});

// 3. Community Posts
app.get("/api/posts", async (req, res) => {
  try {
    // Attempt to fetch posts with counts
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        likes_count:post_likes(count),
        comments_count:post_comments(count)
      `)
      .order('created_at', { ascending: false });
      
    if (error) {
      // If join fails (e.g. missing relationship), fallback to simple fetch
      console.warn("Supabase join failed, falling back to simple fetch:", error.message);
      const { data: simpleData, error: simpleError } = await supabase
        .from('posts')
        .select('*');
        
      if (simpleError) throw simpleError;
      
      // Sort in JS if needed, or just return
      const sortedData = simpleData?.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      return res.json(sortedData?.map(post => ({
        ...post,
        likesCount: 0,
        commentsCount: 0
      })) || []);
    }
    
    // Transform counts from array of objects to numbers
    const transformedData = data?.map(post => ({
      ...post,
      likesCount: post.likes_count?.[0]?.count || 0,
      commentsCount: post.comments_count?.[0]?.count || 0
    }));
    
    return res.json(transformedData || []);
  } catch (error) {
    return handleError(res, error, "Gagal mengambil postingan komunitas");
  }
});

app.post("/api/posts/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.id;
    
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
      
    if (existingLike) {
      // Unlike
      await supabase.from('post_likes').delete().eq('id', existingLike.id);
      return res.json({ success: true, action: 'unliked' });
    } else {
      // Like
      await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
      return res.json({ success: true, action: 'liked' });
    }
  } catch (error) {
    return handleError(res, error, "Gagal memproses suka pada postingan");
  }
});

app.get("/api/posts/:id/comments", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', req.params.id)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    return res.json(data || []);
  } catch (error) {
    return handleError(res, error, "Gagal mengambil komentar");
  }
});

app.post("/api/posts/:id/comments", async (req, res) => {
  try {
    const { userId, userName, content } = req.body;
    const postId = req.params.id;
    
    const { error } = await supabase.from('post_comments').insert({
      post_id: postId,
      user_id: userId,
      user_name: userName || 'Anonim',
      content
    });
    
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    return handleError(res, error, "Gagal menambahkan komentar");
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    const { userName, content } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    
    const { error } = await supabase.from('posts').insert({
      id, user_name: userName || 'Anonim', content
    });
    if (error) throw error;
    
    return res.json({ success: true });
  } catch (error) {
    return handleError(res, error, "Gagal membuat postingan");
  }
});

// 4. Orders
app.get("/api/orders", async (req, res) => {
  try {
    const { userId } = req.query;
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId || 'guest')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (orders) {
      for (let order of orders) {
        const { data: shopOrders } = await supabase
          .from('shop_orders')
          .select('*, order_items(*)')
          .eq('order_id', order.id);
        
        order.shop_orders = shopOrders || [];
        order.items = (shopOrders || []).flatMap(so => so.order_items || []);
      }
    }
    return res.json(orders || []);
  } catch (error) {
    return handleError(res, error, "Gagal mengambil pesanan");
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { userId, total, items } = req.body;
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId, 
      user_id: userId || 'guest', 
      total_amount: total, 
      status: 'PENDING'
    });
    
    if (orderError) throw orderError;

    const itemsByShop: { [key: string]: any[] } = {};
    items.forEach((item: any) => {
      const shopId = item.shop_id || 'default_shop';
      if (!itemsByShop[shopId]) itemsByShop[shopId] = [];
      itemsByShop[shopId].push(item);
    });

    for (const [shopId, shopItems] of Object.entries(itemsByShop)) {
      const shopOrderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const subtotal = shopItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      const { error: soError } = await supabase.from('shop_orders').insert({
        id: shopOrderId,
        order_id: orderId,
        shop_id: shopId === 'default_shop' ? null : shopId,
        subtotal: subtotal,
        shipping_cost: 0,
        total: subtotal,
        status: 'PENDING'
      });

      if (soError) continue;

      const orderItems = shopItems.map((item: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        shop_order_id: shopOrderId,
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url
      }));

      await supabase.from('order_items').insert(orderItems);
    }
    
    return res.json({ success: true, order_id: orderId });
  } catch (error) {
    return handleError(res, error, "Gagal membuat pesanan");
  }
});

// Webhook Midtrans
app.post("/api/payments/webhook", async (req, res) => {
  try {
    const notification = req.body;
    
    // Verifikasi notifikasi (dalam produksi, gunakan signature key)
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    
    let status = 'PENDING';
    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
      status = 'PAID';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'expire' || transactionStatus === 'deny') {
      status = 'CANCELLED';
    }
    
    // Update status pesanan di database
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) throw error;
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return handleError(res, error, "Gagal memproses webhook pembayaran");
  }
});

// Logistics API (RajaOngkir)
const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY || 'xsnYG4Fb4129ed1aae4bad62shw3wZv4';
const RAJAONGKIR_ACCOUNT_TYPE = process.env.RAJAONGKIR_ACCOUNT_TYPE || 'starter';
const RAJAONGKIR_BASE_URL = `https://api.rajaongkir.com/${RAJAONGKIR_ACCOUNT_TYPE}`;

app.get("/api/logistics/cities", async (req, res) => {
  try {
    const fallbackCities = [
      { city_id: '154', city_name: 'Jayapura', type: 'Kota' },
      { city_id: '151', city_name: 'Jakarta Pusat', type: 'Kota' },
      { city_id: '444', city_name: 'Surabaya', type: 'Kota' },
      { city_id: '23', city_name: 'Bandung', type: 'Kota' },
      { city_id: '256', city_name: 'Malang', type: 'Kota' },
      { city_id: '210', city_name: 'Makassar', type: 'Kota' },
      { city_id: '457', city_name: 'Tangerang', type: 'Kota' },
      { city_id: '399', city_name: 'Semarang', type: 'Kota' },
      { city_id: '501', city_name: 'Yogyakarta', type: 'Kota' },
      { city_id: '114', city_name: 'Denpasar', type: 'Kota' },
      { city_id: '327', city_name: 'Palembang', type: 'Kota' },
      { city_id: '278', city_name: 'Medan', type: 'Kota' },
      { city_id: '17', city_name: 'Balikpapan', type: 'Kota' },
      { city_id: '41', city_name: 'Banjarmasin', type: 'Kota' },
      { city_id: '255', city_name: 'Maluku Tengah', type: 'Kabupaten' },
      { city_id: '430', city_name: 'Sorong', type: 'Kota' },
      { city_id: '252', city_name: 'Manokwari', type: 'Kabupaten' },
      { city_id: '292', city_name: 'Merauke', type: 'Kabupaten' },
      { city_id: '293', city_name: 'Mimika', type: 'Kabupaten' }
    ];

    if (!RAJAONGKIR_API_KEY || RAJAONGKIR_API_KEY === '') {
      console.log("No RajaOngkir API Key found, using fallback cities.");
      return res.json(fallbackCities);
    }
    
    try {
      console.log(`Fetching cities from RajaOngkir (${RAJAONGKIR_BASE_URL})...`);
      const response = await axios.get(`${RAJAONGKIR_BASE_URL}/city`, {
        headers: { 'key': RAJAONGKIR_API_KEY }
      });
      
      if (response.data?.rajaongkir?.results) {
        console.log(`Successfully fetched ${response.data.rajaongkir.results.length} cities from RajaOngkir.`);
        return res.json(response.data.rajaongkir.results);
      } else {
        console.warn("RajaOngkir response format unexpected:", response.data);
        return res.json(fallbackCities);
      }
    } catch (apiError: any) {
      console.error("RajaOngkir Cities API failed:", apiError.message);
      if (apiError.response) {
        console.error("RajaOngkir API Error Response:", apiError.response.data);
      }
      return res.json(fallbackCities);
    }
  } catch (error) {
    return handleError(res, error, "Gagal mengambil data kota");
  }
});

app.post("/api/logistics/shipping-cost", async (req, res) => {
  try {
    const { origin, destination, weight, courier } = req.body;
    
    // Realistic fallback cost calculation based on weight and destination
    // Jayapura (154) to other cities is generally expensive
    const calculateSimulatedCost = (w: number, dest: string, cour: string) => {
      const weightKg = Math.ceil(w / 1000) || 1;
      let baseRate = 85000; // Base rate from Papua to outside
      
      // Add some variance based on destination ID to make it look "real"
      const destId = parseInt(dest) || 151;
      const distanceFactor = (Math.abs(destId - 154) % 20) * 2000;
      
      let courierMultiplier = 1;
      if (cour.toLowerCase() === 'jne') courierMultiplier = 1.1;
      if (cour.toLowerCase() === 'tiki') courierMultiplier = 1.05;
      if (cour.toLowerCase() === 'pos') courierMultiplier = 0.95;
      
      return Math.round((baseRate + distanceFactor) * weightKg * courierMultiplier);
    };

    if (!RAJAONGKIR_API_KEY) {
      // Fallback to simulation if no API key
      const cost = calculateSimulatedCost(weight, destination, courier);
      return res.json({ 
        success: true, 
        data: { 
          courier: courier.toUpperCase(), 
          cost, 
          estimated_delivery: "3-5 hari (Simulasi)" 
        }
      });
    }

    // RajaOngkir requires city IDs.
    const originId = origin || '154'; // Default: Jayapura (City ID 154)
    const destinationId = destination || '151'; // Default: Jakarta (City ID 151)

    try {
      const params = new URLSearchParams();
      params.append('origin', originId);
      params.append('destination', destinationId);
      params.append('weight', weight.toString());
      params.append('courier', courier.toLowerCase());

      const response = await axios.post(`${RAJAONGKIR_BASE_URL}/cost`, params, {
        headers: { 
          'key': RAJAONGKIR_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      if (response.data.rajaongkir.status.code !== 200) {
        throw new Error(response.data.rajaongkir.status.description);
      }

      const result = response.data.rajaongkir.results[0];
      if (!result.costs || result.costs.length === 0) {
        throw new Error("No shipping service available for this route");
      }

      const cost = result.costs[0].cost[0].value;
      const etd = result.costs[0].cost[0].etd;

      return res.json({ 
        success: true, 
        data: {
          courier: result.name,
          cost,
          estimated_delivery: `${etd} hari`
        }
      });
    } catch (apiError: any) {
      console.warn("RajaOngkir API failed, falling back to simulation:", apiError.message);
      const cost = calculateSimulatedCost(weight, destination, courier);
      return res.json({ 
        success: true, 
        data: { 
          courier: courier.toUpperCase(), 
          cost, 
          estimated_delivery: "4-7 hari (Simulasi)" 
        }
      });
    }
  } catch (error) {
    return handleError(res, error, "Gagal menghitung ongkos kirim");
  }
});

// 5. Shops
app.get("/api/shops/:userId", async (req, res) => {
  try {
    const { data, error } = await supabase.from('shops').select('*').eq('user_id', req.params.userId).maybeSingle();
    if (error) throw error;
    return res.json(data || null);
  } catch (error) {
    return handleError(res, error, "Gagal mengambil data toko");
  }
});

app.post("/api/shops", async (req, res) => {
  try {
    const { userId, name, description } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    
    const { data, error } = await supabase.from('shops').insert({
      id, user_id: userId, name, description
    }).select().single();
    
    if (error) throw error;
    return res.json(data);
  } catch (error) {
    return handleError(res, error, "Gagal membuat toko");
  }
});

// 6. Seller Dashboard
app.get("/api/seller/products", async (req, res) => {
  try {
    const { shopId } = req.query;
    if (!shopId) throw new Error("Shop ID is required");
    
    const { data, error } = await supabase.from('products').select('*').eq('shop_id', shopId);
    if (error) throw error;
    return res.json(data || []);
  } catch (error) {
    return handleError(res, error, "Gagal mengambil produk toko");
  }
});

app.get("/api/seller/orders", async (req, res) => {
  try {
    const { shopId } = req.query;
    if (!shopId) throw new Error("Shop ID is required");

    const { data: shopOrders, error } = await supabase
      .from('shop_orders')
      .select('*, order_items(*)')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(shopOrders || []);
  } catch (error) {
    return handleError(res, error, "Gagal mengambil pesanan toko");
  }
});

app.put("/api/seller/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const { error } = await supabase.from('shop_orders').update({ status }).eq('id', req.params.id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    return handleError(res, error, "Gagal memperbarui status pesanan");
  }
});

app.post("/api/seller/products", async (req, res) => {
  try {
    const { name, description, price, category, image_url, shopId } = req.body;
    if (!shopId) throw new Error("Shop ID is required");
    const id = Math.random().toString(36).substr(2, 9);
    
    const { error } = await supabase.from('products').insert({
      id, name, description, price, 
      image_url: image_url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', 
      category, shop_id: shopId
    });
    
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    return handleError(res, error, "Gagal menambahkan produk");
  }
});

app.put("/api/seller/products/:id", async (req, res) => {
  try {
    const { name, description, price, category, image_url, shopId } = req.body;
    const { id } = req.params;
    
    if (!shopId) throw new Error("Shop ID is required");
    
    const { error } = await supabase.from('products').update({
      name, description, price, image_url, category
    }).eq('id', id).eq('shop_id', shopId);
    
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    return handleError(res, error, "Gagal memperbarui produk");
  }
});

app.delete("/api/seller/products/:id", async (req, res) => {
  try {
    const { shopId } = req.query;
    const { id } = req.params;
    
    const { error } = await supabase.from('products').delete().eq('id', id).eq('shop_id', shopId);
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    return handleError(res, error, "Gagal menghapus produk");
  }
});

// 6. Admin Dashboard Routes
app.get("/api/admin/stats", async (req, res) => {
  try {
    const { count: users, error: usersError } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: products, error: productsError } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: orders, error: ordersError } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    
    if (usersError || productsError || ordersError) throw new Error("Gagal mengambil statistik");

    return res.json({
      users: users || 0,
      products: products || 0,
      orders: orders || 0
    });
  } catch (error) {
    return handleError(res, error, "Gagal mengambil statistik admin");
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return res.json(data || []);
  } catch (error) {
    return handleError(res, error, "Gagal mengambil daftar pengguna");
  }
});

app.delete("/api/admin/users/:id", async (req, res) => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', req.params.id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    return handleError(res, error, "Gagal menghapus pengguna");
  }
});

app.get("/api/admin/products", async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return res.json(data || []);
  } catch (error) {
    return handleError(res, error, "Gagal mengambil daftar produk");
  }
});

app.delete("/api/admin/products/:id", async (req, res) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    return handleError(res, error, "Gagal menghapus produk");
  }
});

app.get("/api/admin/orders", async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return res.json(data || []);
  } catch (error) {
    return handleError(res, error, "Gagal mengambil daftar pesanan");
  }
});

// ==========================================
// AI Routes — semua panggilan Gemini ada di sini,
// bukan di frontend, supaya API key tidak terekspos.
// ==========================================

import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  if (!apiKey) throw new Error("GEMINI_API_KEY belum diisi di file .env");
  return new GoogleGenAI({ apiKey });
};

const ATTRACTIONS_CONTEXT = [
  "Raja Ampat (Papua Barat Daya) — Bahari, snorkeling, diving",
  "Lembah Baliem (Papua Pegunungan) — Budaya suku Dani, festival",
  "Danau Sentani (Jayapura) — Danau, tur perahu, lukisan kulit kayu",
  "Taman Nasional Lorentz (Papua Tengah) — UNESCO, ekspedisi, Puncak Jaya",
  "Pantai Base G (Jayapura) — Pantai bersejarah, snorkeling",
];

// POST /api/ai/itinerary — generate travel itinerary
app.post("/api/ai/itinerary", async (req, res) => {
  try {
    const { days, interests, budget, originCity } = req.body;
    if (!days || !interests || !budget) {
      return res.status(400).json({ error: "days, interests, dan budget wajib diisi" });
    }

    const ai = getAI();
    const systemInstruction = `Anda adalah "PACE Travel Planner AI", ahli perencana perjalanan khusus destinasi Papua Indonesia.
Buatkan itinerary yang detail, menarik, dan realistis. Sertakan rekomendasi dari destinasi berikut jika relevan:
${ATTRACTIONS_CONTEXT.join('\n')}

Aturan format:
- Gunakan Markdown dengan heading ## untuk tiap hari
- Tiap hari berisi pagi/siang/sore/malam
- Sertakan estimasi biaya per aktivitas (opsional)
- Di hari terakhir, rekomendasikan oleh-oleh khas Papua yang bisa dibeli di PACE
- Tambahkan tips perjalanan di bagian akhir
- Gunakan bahasa Indonesia yang hangat dan antusias`;

    const prompt = `Buatkan itinerary liburan ke Papua:
- Durasi: ${days} hari
- Minat: ${interests}
- Budget: ${budget}${originCity ? `\n- Kota asal wisatawan: ${originCity} (sertakan info penerbangan & tips dari kota ini ke Papua)` : ''}

Buat per hari (Hari 1, Hari 2, dst) lengkap dengan aktivitas, kuliner, dan tips praktis.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    if (!response.text) throw new Error("AI tidak menghasilkan respons");
    return res.json({ itinerary: response.text });
  } catch (error: any) {
    if (error.message?.includes('API_KEY')) {
      return res.status(401).json({ error: "GEMINI_API_KEY tidak valid atau belum diisi di .env" });
    }
    return handleError(res, error, "Gagal membuat itinerary");
  }
});

// POST /api/ai/chat — chatbot PACE AI
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history = [], productsContext = [] } = req.body;
    if (!message) return res.status(400).json({ error: "message wajib diisi" });

    const ai = getAI();
    const systemInstruction = `Anda adalah "PACE AI", asisten virtual untuk e-commerce & pariwisata Papua.
Persona: ramah, antusias, pakai sapaan khas Papua (Pace/Mace/Kaka).

Destinasi wisata tersedia: ${ATTRACTIONS_CONTEXT.join('; ')}
Produk tersedia: ${productsContext.slice(0, 10).map((p: any) => `${p.name} (Rp ${p.price?.toLocaleString('id-ID')})`).join(', ')}

Aturan:
- Jawab dalam Bahasa Indonesia menggunakan Markdown
- Rekomendasikan produk & destinasi dari konteks di atas
- Untuk pertanyaan harga pengiriman, info bahwa PACE pakai JNE/POS/TIKI via RajaOngkir`;

    const contents: any[] = history.slice(-10).map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: { systemInstruction, temperature: 0.7 }
    });

    if (!response.text) throw new Error("AI tidak menghasilkan respons");
    return res.json({ reply: response.text });
  } catch (error: any) {
    if (error.message?.includes('API_KEY')) {
      return res.status(401).json({ error: "GEMINI_API_KEY tidak valid" });
    }
    return handleError(res, error, "Gagal memproses pesan chatbot");
  }
});

// POST /api/ai/smart-search — cari produk dengan AI
app.post("/api/ai/smart-search", async (req, res) => {
  try {
    const { query, products = [] } = req.body;
    if (!query || products.length === 0) return res.json({ ids: [] });

    const ai = getAI();
    const catalog = products.map((p: any) =>
      `ID: ${p.id} | Nama: ${p.name} | Kategori: ${p.category}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Dari katalog berikut, kembalikan array JSON berisi ID produk yang paling relevan dengan query "${query}". Hanya balas dengan array JSON, tanpa teks lain.\n\nKatalog:\n${catalog}`,
      config: { temperature: 0.1, responseMimeType: "application/json" }
    });

    const ids = JSON.parse(response.text || '[]');
    return res.json({ ids: Array.isArray(ids) ? ids : [] });
  } catch (error) {
    return res.json({ ids: [] }); // fallback diam-diam, frontend handle sendiri
  }
});

// POST /api/ai/packaging-advice — saran pengemasan untuk seller
app.post("/api/ai/packaging-advice", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "question wajib diisi" });

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Anda adalah ahli pengemasan dan pengiriman untuk penjual online produk UMKM Papua. Berikan saran yang aman, efisien, dan ramah lingkungan. Gunakan Bahasa Indonesia. Pertanyaan: ${question}`,
      config: { temperature: 0.5 }
    });

    return res.json({ advice: response.text || '' });
  } catch (error: any) {
    return handleError(res, error, "Gagal mendapatkan saran pengemasan");
  }
});

// POST /api/ai/describe-product — generate deskripsi dari gambar produk (Seller Dashboard)
app.post("/api/ai/describe-product", async (req, res) => {
  try {
    const { base64Image, imageUrl } = req.body;
    if (!base64Image && !imageUrl) {
      return res.status(400).json({ error: "base64Image atau imageUrl wajib diisi" });
    }

    const ai = getAI();
    let imagePart: any;

    if (base64Image) {
      // Sudah base64 dari upload langsung
      imagePart = {
        inlineData: {
          data: base64Image.replace(/^data:image\/\w+;base64,/, ''),
          mimeType: 'image/jpeg',
        }
      };
    } else {
      // Fetch dari URL lalu convert ke base64
      const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const b64 = Buffer.from(imgRes.data).toString('base64');
      const mimeType = imgRes.headers['content-type'] || 'image/jpeg';
      imagePart = { inlineData: { data: b64, mimeType } };
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: {
        parts: [
          imagePart,
          { text: 'Buatkan deskripsi produk yang profesional dan menarik untuk produk ini. Gunakan Bahasa Indonesia yang menggugah. Fokus pada keunikan produk khas Papua.' }
        ]
      }
    });

    return res.json({ description: response.text || '' });
  } catch (error: any) {
    if (error.message?.includes('API_KEY')) {
      return res.status(401).json({ error: "GEMINI_API_KEY tidak valid" });
    }
    return handleError(res, error, "Gagal membuat deskripsi produk");
  }
});

export default app;
