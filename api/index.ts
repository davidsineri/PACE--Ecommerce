import express from "express";
import cors from "cors";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gskufvyviaxetkwrhsgn.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdza3Vmdnl2aWF4ZXRrd3Joc2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjA1NTUsImV4cCI6MjA4ODczNjU1NX0.VmK75_KWJ7xVjxAovEZakfnWu2yBW1uGfJHvKAdHinU';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes

// 1. Products
app.get("/api/products", async (req, res) => {
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
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

app.get("/api/products/:id", async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// 2. Reviews
app.get("/api/products/:id/reviews", async (req, res) => {
  const { data, error } = await supabase.from('reviews').select('*').eq('product_id', req.params.id).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

app.post("/api/products/:id/reviews", async (req, res) => {
  const { userName, rating, comment } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  
  const { error } = await supabase.from('reviews').insert({
    id,
    product_id: req.params.id,
    user_name: userName || 'Anonim',
    rating,
    comment
  });
  
  if (error) return res.status(500).json({ error: error.message });

  // Update product rating and count
  const { data: reviews } = await supabase.from('reviews').select('rating').eq('product_id', req.params.id);
  if (reviews) {
    const newRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
    await supabase.from('products').update({ rating: newRating, reviews_count: reviews.length }).eq('id', req.params.id);
  }
  
  return res.json({ success: true });
});

// 3. Community Posts
app.get("/api/posts", async (req, res) => {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

app.post("/api/posts", async (req, res) => {
  const { userName, content } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  
  const { error } = await supabase.from('posts').insert({
    id, user_name: userName || 'Anonim', content
  });
  if (error) return res.status(500).json({ error: error.message });
  
  return res.json({ success: true });
});

// 4. Orders
app.get("/api/orders", async (req, res) => {
  const { userId } = req.query;
  const { data: orders, error } = await supabase.from('orders').select('*').eq('user_id', userId || 'guest').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  
  if (orders) {
    for (let order of orders) {
      const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
      order.items = items || [];
    }
  }
  return res.json(orders || []);
});

app.post("/api/orders", async (req, res) => {
  const { userId, total, items } = req.body;
  const id = Math.random().toString(36).substr(2, 9).toUpperCase();
  
  const orderItems = items.map((item: any) => ({
    id: Math.random().toString(36).substr(2, 9),
    order_id: id,
    product_id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image_url: item.image_url
  }));

  const { error: orderError } = await supabase.from('orders').insert({
    id, user_id: userId || 'guest', total, status: 'PENDING_PAYMENT'
  });
  
  if (orderError) return res.status(500).json({ error: orderError.message });

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) return res.status(500).json({ error: itemsError.message });
  
  return res.json({ success: true, order_id: id });
});

// 5. Shops
app.get("/api/shops/:userId", async (req, res) => {
  const { data, error } = await supabase.from('shops').select('*').eq('user_id', req.params.userId).single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || null);
});

app.post("/api/shops", async (req, res) => {
  const { userId, name, description } = req.body;
  const id = Math.random().toString(36).substr(2, 9);
  
  const { data, error } = await supabase.from('shops').insert({
    id, user_id: userId, name, description
  }).select().single();
  
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// 6. Seller Dashboard
app.get("/api/seller/products", async (req, res) => {
  const { shopId } = req.query;
  if (!shopId) return res.status(400).json({ error: "Shop ID is required" });
  
  const { data, error } = await supabase.from('products').select('*').eq('shop_id', shopId);
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

app.get("/api/seller/orders", async (req, res) => {
  const { shopId } = req.query;
  const { data: orders, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  
  if (orders) {
    for (let order of orders) {
      const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
      order.items = items || [];
    }
  }
  return res.json(orders || []);
});

app.put("/api/seller/orders/:id/status", async (req, res) => {
  const { status, resi } = req.body;
  const updateData: any = { status };
  if (resi) updateData.resi = resi;
  
  const { error } = await supabase.from('orders').update(updateData).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
});

app.post("/api/seller/products", async (req, res) => {
  const { name, description, price, category, image_url, shopId } = req.body;
  if (!shopId) return res.status(400).json({ error: "Shop ID is required" });
  const id = Math.random().toString(36).substr(2, 9);
  
  const { error } = await supabase.from('products').insert({
    id, name, description, price, 
    image_url: image_url || 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=800&auto=format&fit=crop', 
    category, shop_id: shopId
  });
  
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
});

app.put("/api/seller/products/:id", async (req, res) => {
  const { name, description, price, category, image_url, shopId } = req.body;
  const { id } = req.params;
  
  if (!shopId) return res.status(400).json({ error: "Shop ID is required" });
  
  const { error } = await supabase.from('products').update({
    name, description, price, image_url, category
  }).eq('id', id).eq('shop_id', shopId);
  
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
});

app.delete("/api/seller/products/:id", async (req, res) => {
  const { shopId } = req.query;
  const { id } = req.params;
  
  const { error } = await supabase.from('products').delete().eq('id', id).eq('shop_id', shopId);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
});

// 6. Admin Dashboard Routes
app.get("/api/admin/stats", async (req, res) => {
  const { count: users, error: usersError } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: products, error: productsError } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: orders, error: ordersError } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  
  if (usersError || productsError || ordersError) return res.status(500).json({ error: "Failed to fetch stats" });

  return res.json({
    users: users || 0,
    products: products || 0,
    orders: orders || 0
  });
});

app.get("/api/admin/users", async (req, res) => {
  const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

app.delete("/api/admin/users/:id", async (req, res) => {
  const { error } = await supabase.from('users').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
});

app.get("/api/admin/products", async (req, res) => {
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

app.delete("/api/admin/products/:id", async (req, res) => {
  const { error } = await supabase.from('products').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
});

app.get("/api/admin/orders", async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data || []);
});

export default app;
