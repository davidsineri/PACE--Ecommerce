import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gskufvyviaxetkwrhsgn.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdza3Vmdnl2aWF4ZXRrd3Joc2duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjA1NTUsImV4cCI6MjA4ODczNjU1NX0.VmK75_KWJ7xVjxAovEZakfnWu2yBW1uGfJHvKAdHinU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

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

    try {
      const { data, error } = await query;
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Database error" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
    if (error || !data) return res.status(404).json({ error: "Product not found" });
    res.json(data);
  });

  // 2. Reviews
  app.get("/api/products/:id/reviews", async (req, res) => {
    const { data, error } = await supabase.from('reviews').select('*').eq('productId', req.params.id).order('createdAt', { ascending: false });
    res.json(data || []);
  });

  app.post("/api/products/:id/reviews", async (req, res) => {
    const { userName, rating, comment } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    try {
      const { error } = await supabase.from('reviews').insert({
        id,
        productId: req.params.id,
        userName: userName || 'Anonim',
        rating,
        comment
      });
      if (error) throw error;
      
      // Update product rating and count
      const { data: reviews } = await supabase.from('reviews').select('rating').eq('productId', req.params.id);
      if (reviews && reviews.length > 0) {
        const newRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        await supabase.from('products').update({ rating: newRating, reviewsCount: reviews.length }).eq('id', req.params.id);
      }

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to add review" });
    }
  });

  // 3. Community Posts
  app.get("/api/posts", async (req, res) => {
    const { data, error } = await supabase.from('posts').select('*').order('createdAt', { ascending: false });
    res.json(data || []);
  });

  app.post("/api/posts", async (req, res) => {
    const { userName, content } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    try {
      const { error } = await supabase.from('posts').insert({
        id, userName: userName || 'Anonim', content
      });
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to add post" });
    }
  });

  // 4. Orders
  app.get("/api/orders", async (req, res) => {
    const { userId } = req.query;
    try {
      const { data: orders, error } = await supabase.from('orders').select('*').eq('userId', userId || 'guest').order('createdAt', { ascending: false });
      if (error) throw error;
      
      if (orders) {
        for (let order of orders) {
          const { data: items } = await supabase.from('order_items').select('*').eq('orderId', order.id);
          order.items = items || [];
        }
      }
      res.json(orders || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    const { userId, total, items } = req.body;
    const id = Math.random().toString(36).substr(2, 9).toUpperCase();
    try {
      const { error: orderError } = await supabase.from('orders').insert({
        id, userId: userId || 'guest', total, status: 'PAID'
      });
      if (orderError) throw orderError;

      const orderItems = items.map((item: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        orderId: id,
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      res.json({ success: true, orderId: id });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to create order" });
    }
  });

  // 5. Seller Dashboard
  app.get("/api/seller/products", async (req, res) => {
    const { data, error } = await supabase.from('products').select('*').eq('sellerId', 'seller1');
    res.json(data || []);
  });

  app.get("/api/seller/orders", async (req, res) => {
    try {
      const { data: orders, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
      if (error) throw error;
      
      if (orders) {
        for (let order of orders) {
          const { data: items } = await supabase.from('order_items').select('*').eq('orderId', order.id);
          order.items = items || [];
        }
      }
      res.json(orders || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch seller orders" });
    }
  });

  app.put("/api/seller/orders/:id/status", async (req, res) => {
    const { status, resi } = req.body;
    try {
      const updateData: any = { status };
      if (resi) updateData.resi = resi;
      
      const { error } = await supabase.from('orders').update(updateData).eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to update order status" });
    }
  });

  app.post("/api/seller/products", async (req, res) => {
    const { name, description, price, category, image_url } = req.body;
    const id = Math.random().toString(36).substr(2, 9);
    try {
      const { error } = await supabase.from('products').insert({
        id, name, description, price, 
        image_url: image_url || 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=800&auto=format&fit=crop', 
        category, sellerId: 'seller1'
      });
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to add product" });
    }
  });

  app.delete("/api/seller/products/:id", async (req, res) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', req.params.id).eq('sellerId', 'seller1');
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to delete product" });
    }
  });

  // 6. Admin Dashboard Routes
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const { count: users } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: products } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: orders } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      
      res.json({
        users: users || 0,
        products: products || 0,
        orders: orders || 0
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      const { data, error } = await supabase.from('users').select('*').order('createdAt', { ascending: false });
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch users" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to delete user" });
    }
  });

  app.get("/api/admin/products", async (req, res) => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('createdAt', { ascending: false });
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch products" });
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to delete product" });
    }
  });

  app.get("/api/admin/orders", async (req, res) => {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
      if (error) throw error;
      res.json(data || []);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch orders" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
