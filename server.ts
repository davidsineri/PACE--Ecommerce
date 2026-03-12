import express from "express"
import cors from "cors"
import { createServer as createViteServer } from "vite"
import { createClient } from "@supabase/supabase-js"

const app = express()

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || "development"

app.use(cors())
app.use(express.json())

// Supabase
const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  "https://gskufvyviaxetkwrhsgn.supabase.co"

const supabaseKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  "YOUR_SUPABASE_ANON_KEY"

const supabase = createClient(supabaseUrl, supabaseKey)

// helper id generator
function generateId() {
  return Math.random().toString(36).substring(2, 10)
}

//
// PRODUCTS
//
app.get("/api/products", async (req, res) => {
  try {
    const { search, category, sort } = req.query

    let query = supabase.from("products").select("*")

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      )
    }

    if (category && category !== "Semua") {
      query = query.eq("category", category)
    }

    if (sort === "termurah") {
      query = query.order("price", { ascending: true })
    } else if (sort === "termahal") {
      query = query.order("price", { ascending: false })
    } else {
      query = query.order("createdAt", { ascending: false })
    }

    const { data, error } = await query

    if (error) throw error

    res.json(data || [])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/api/products/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .single()

    if (error) throw error

    res.json(data)
  } catch (err: any) {
    res.status(404).json({ error: "Product not found" })
  }
})

//
// REVIEWS
//
app.get("/api/products/:id/reviews", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("productId", req.params.id)
      .order("createdAt", { ascending: false })

    if (error) throw error

    res.json(data || [])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.post("/api/products/:id/reviews", async (req, res) => {
  try {
    const { userName, rating, comment } = req.body

    const { error } = await supabase.from("reviews").insert({
      id: generateId(),
      productId: req.params.id,
      userName: userName || "Anonim",
      rating,
      comment
    })

    if (error) throw error

    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

//
// POSTS
//
app.get("/api/posts", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("createdAt", { ascending: false })

    if (error) throw error

    res.json(data || [])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.post("/api/posts", async (req, res) => {
  try {
    const { userName, content } = req.body

    const { error } = await supabase.from("posts").insert({
      id: generateId(),
      userName: userName || "Anonim",
      content
    })

    if (error) throw error

    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

//
// ORDERS
//
app.post("/api/orders", async (req, res) => {
  try {
    const { userId, total, items } = req.body

    const orderId = generateId().toUpperCase()

    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      userId: userId || "guest",
      total,
      status: "PAID"
    })

    if (orderError) throw orderError

    const orderItems = items.map((item: any) => ({
      id: generateId(),
      orderId,
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) throw itemsError

    res.json({ success: true, orderId })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

//
// ADMIN STATS
//
app.get("/api/admin/stats", async (req, res) => {
  try {
    const { count: users } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    const { count: products } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })

    const { count: orders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })

    res.json({
      users: users || 0,
      products: products || 0,
      orders: orders || 0
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

//
// DEV MODE (VITE)
//
async function startServer() {
  if (NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    })

    app.use(vite.middlewares)
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
