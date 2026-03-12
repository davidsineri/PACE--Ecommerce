import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Plus, Trash2 } from 'lucide-react';

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('Produk');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: 'Kriya & Kerajinan', image_url: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/seller/products'),
        fetch('/api/seller/orders')
      ]);
      
      if (productsRes.ok) setProducts(await productsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseInt(newProduct.price)
        })
      });
      if (res.ok) {
        setShowAddForm(false);
        setNewProduct({ name: '', description: '', price: '', category: 'Kriya & Kerajinan', image_url: '' });
        fetchData();
      } else {
        const errorData = await res.json();
        alert(`Gagal menambah produk: ${errorData.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menambah produk.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return;
    try {
      const res = await fetch(`/api/seller/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/seller/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-24 text-center">Memuat dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-black italic mb-8">DASHBOARD TOKO</h1>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('Produk')}
          className={`px-6 py-3 rounded-full font-bold transition-colors ${activeTab === 'Produk' ? 'bg-black text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
        >
          <Package className="inline-block mr-2" size={20} /> Produk Saya
        </button>
        <button 
          onClick={() => setActiveTab('Pesanan')}
          className={`px-6 py-3 rounded-full font-bold transition-colors ${activeTab === 'Pesanan' ? 'bg-black text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
        >
          <ShoppingBag className="inline-block mr-2" size={20} /> Pesanan Masuk
        </button>
      </div>

      {activeTab === 'Produk' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black italic">Daftar Produk</h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 flex items-center gap-2"
            >
              <Plus size={20} /> Tambah Produk
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddProduct} className="bg-stone-50 p-8 rounded-[32px] border border-stone-200 space-y-4">
              <h3 className="font-bold text-lg mb-4">Tambah Produk Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Nama Produk" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="p-4 rounded-xl border border-stone-200 w-full" />
                <input required type="number" placeholder="Harga (Rp)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="p-4 rounded-xl border border-stone-200 w-full" />
                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="p-4 rounded-xl border border-stone-200 w-full bg-white">
                  <option>Kriya & Kerajinan</option>
                  <option>Fashion & Kain</option>
                  <option>Seni & Ukiran</option>
                  <option>Makanan & Minuman</option>
                  <option>Hasil Bumi</option>
                </select>
                <input type="url" placeholder="URL Gambar (Opsional)" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="p-4 rounded-xl border border-stone-200 w-full" />
              </div>
              <textarea required placeholder="Deskripsi Produk" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="p-4 rounded-xl border border-stone-200 w-full h-32"></textarea>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 font-bold text-stone-500 hover:text-black">Batal</button>
                <button type="submit" className="px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-stone-800">Simpan Produk</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="border border-stone-200 rounded-[24px] p-4 flex gap-4">
                <img src={product.image_url} alt={product.name} className="w-24 h-24 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-black italic line-clamp-1">{product.name}</h4>
                    <p className="text-emerald-600 font-bold text-sm">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                  <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 text-sm font-bold flex items-center gap-1 hover:underline w-fit">
                    <Trash2 size={16} /> Hapus
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && !showAddForm && (
              <p className="text-stone-500 col-span-full">Belum ada produk. Silakan tambah produk pertama Anda.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Pesanan' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black italic mb-6">Pesanan Masuk</h2>
          {orders.map(order => (
            <div key={order.id} className="border border-stone-200 rounded-[32px] p-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-stone-100">
                <div>
                  <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Order #{order.id}</p>
                  <p className="text-lg font-black italic">Rp {order.total.toLocaleString('id-ID')}</p>
                </div>
                <select 
                  value={order.status}
                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  className={`p-2 rounded-xl font-bold text-sm border-2 ${
                    order.status === 'PAID' ? 'border-yellow-400 text-yellow-600' : 
                    order.status === 'SHIPPED' ? 'border-blue-400 text-blue-600' : 
                    'border-emerald-400 text-emerald-600'
                  }`}
                >
                  <option value="PAID">Perlu Dikirim</option>
                  <option value="SHIPPED">Sedang Dikirim</option>
                  <option value="COMPLETED">Selesai</option>
                </select>
              </div>
              <div className="space-y-2">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-stone-500">Belum ada pesanan masuk.</p>
          )}
        </div>
      )}
    </div>
  );
}
