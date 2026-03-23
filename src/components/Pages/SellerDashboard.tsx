import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Plus, Trash2, FileText, Store } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function SellerDashboard() {
  const { user, shop, refreshShop } = useAuth();
  const [activeTab, setActiveTab] = useState('Produk');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Shop Form State
  const [newShop, setNewShop] = useState({ name: '', description: '' });

  // New Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: 'Kriya & Kerajinan', image_url: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB for base64)
    if (file.size > 2 * 1024 * 1024) {
      alert('File terlalu besar. Maksimal 2MB.');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct({ ...newProduct, image_url: reader.result as string });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const fetchData = async () => {
    if (!shop) return;
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch(`/api/seller/products?shopId=${shop.id}`),
        fetch(`/api/seller/orders?shopId=${shop.id}`)
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
    if (shop) fetchData();
    else setLoading(false);
  }, [shop]);

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleCreateShop triggered');
    if (!user) {
      alert('User tidak ditemukan. Silakan login ulang.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Sending request to /api/shops with data:', { userId: user.id, ...newShop });
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...newShop
        })
      });
      
      console.log('Response status:', res.status);
      if (res.ok) {
        const data = await res.json();
        console.log('Shop created successfully:', data);
        await refreshShop();
      } else {
        const errData = await res.json();
        console.error('Server error:', errData);
        alert(`Gagal membuat toko: ${errData.error || 'Terjadi kesalahan di server'}`);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      alert(`Terjadi kesalahan koneksi: ${err.message || 'Gagal menghubungi server'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseInt(newProduct.price),
          shopId: shop.id
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Hapus produk ini?') || !shop) return;
    try {
      const res = await fetch(`/api/seller/products/${id}?shopId=${shop.id}`, { method: 'DELETE' });
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

  if (!user) return <div className="p-24 text-center">Silakan masuk untuk mengakses dashboard.</div>;
  if (loading) return <div className="p-24 text-center">Memuat dashboard...</div>;

  if (!shop) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24">
        <div className="bg-white p-12 rounded-[48px] shadow-xl border border-stone-100 text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Store size={40} />
          </div>
          <h1 className="text-3xl font-black italic mb-4">BUAT TOKO ANDA</h1>
          <p className="text-stone-500 mb-8 font-medium">Mulai berjualan produk kreatif Papua Anda hari ini. Satu akun, satu toko.</p>
          
          <form onSubmit={handleCreateShop} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest">Nama Toko</label>
              <input 
                required 
                type="text" 
                placeholder="Contoh: Noken Papua Jaya" 
                value={newShop.name} 
                onChange={e => setNewShop({...newShop, name: e.target.value})} 
                className="w-full p-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-widest">Deskripsi Singkat</label>
              <textarea 
                required 
                placeholder="Ceritakan sedikit tentang toko Anda..." 
                value={newShop.description} 
                onChange={e => setNewShop({...newShop, description: e.target.value})} 
                className="w-full p-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-black outline-none transition-all h-32"
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              onClick={() => console.log('Create shop button clicked')}
              className="w-full py-5 bg-black text-white rounded-full font-black italic text-lg hover:bg-stone-800 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Memproses...' : 'BUAT TOKO SEKARANG'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black text-black italic">DASHBOARD TOKO</h1>
          <p className="text-stone-500 font-bold flex items-center gap-2 mt-2">
            <Store size={18} className="text-emerald-600" /> {shop.name}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('Produk')}
            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'Produk' ? 'bg-black text-white shadow-lg shadow-black/20' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          >
            <Package className="inline-block mr-2" size={20} /> Produk
          </button>
          <button 
            onClick={() => setActiveTab('Pesanan')}
            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'Pesanan' ? 'bg-black text-white shadow-lg shadow-black/20' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
          >
            <ShoppingBag className="inline-block mr-2" size={20} /> Pesanan
          </button>
        </div>
      </div>

      {activeTab === 'Produk' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black italic">Daftar Produk</h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus size={20} /> Tambah Produk
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddProduct} className="bg-white p-8 rounded-[40px] border-2 border-stone-100 shadow-xl space-y-6">
              <h3 className="text-xl font-black italic mb-4">Tambah Produk Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400">Nama Produk</label>
                  <input required type="text" placeholder="Contoh: Noken Anggrek" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="p-4 rounded-2xl border border-stone-200 w-full focus:ring-2 focus:ring-black outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400">Harga (Rp)</label>
                  <input required type="number" placeholder="Harga" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="p-4 rounded-2xl border border-stone-200 w-full focus:ring-2 focus:ring-black outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400">Kategori</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="p-4 rounded-2xl border border-stone-200 w-full bg-white focus:ring-2 focus:ring-black outline-none">
                    <option>Kriya & Kerajinan</option>
                    <option>Fashion & Kain</option>
                    <option>Seni & Ukiran</option>
                    <option>Makanan & Minuman</option>
                    <option>Hasil Bumi</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400">Gambar Produk</label>
                  <div className="flex flex-col gap-4">
                    {newProduct.image_url && (
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-stone-100">
                        <img src={newProduct.image_url} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button 
                          type="button" 
                          onClick={() => setNewProduct({...newProduct, image_url: ''})}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <label className="flex-grow cursor-pointer bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl p-4 flex flex-col items-center justify-center hover:border-black transition-all group">
                        <Plus size={24} className="text-stone-300 group-hover:text-black mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover:text-black">
                          {uploading ? 'Memproses...' : 'Upload dari Perangkat'}
                        </span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </label>
                      <div className="flex-grow">
                        <input 
                          type="url" 
                          placeholder="Atau tempel URL gambar (https://...)" 
                          value={newProduct.image_url.startsWith('data:') ? '' : newProduct.image_url} 
                          onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} 
                          className="p-4 rounded-2xl border border-stone-200 w-full focus:ring-2 focus:ring-black outline-none h-full" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-stone-400">Deskripsi Lengkap</label>
                <textarea required placeholder="Jelaskan keunikan produk Anda..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="p-4 rounded-2xl border border-stone-200 w-full h-32 focus:ring-2 focus:ring-black outline-none"></textarea>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-8 py-3 font-bold text-stone-500 hover:text-black transition-colors">Batal</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-10 py-4 bg-black text-white rounded-full font-black italic text-lg hover:bg-stone-800 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white border border-stone-100 rounded-[32px] p-5 flex gap-5 hover:shadow-lg transition-all group">
                <div className="relative overflow-hidden rounded-2xl shrink-0">
                  <img src={product.image_url} alt={product.name} className="w-24 h-24 object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-black italic line-clamp-1 text-lg">{product.name}</h4>
                    <p className="text-emerald-600 font-black italic">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                  <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:text-red-700 transition-colors">
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && !showAddForm && (
              <div className="col-span-full py-20 text-center bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
                <Package size={48} className="mx-auto text-stone-300 mb-4" />
                <p className="text-stone-500 font-bold">Belum ada produk. Mulai jualan sekarang!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Pesanan' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black italic mb-6">Pesanan Masuk</h2>
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-stone-100 rounded-[40px] p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-stone-50">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Order #{order.id}</p>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'PAID' ? 'bg-yellow-100 text-yellow-700' : 
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : 
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {order.status === 'PAID' ? 'Perlu Dikirim' : order.status === 'SHIPPED' ? 'Dikirim' : 'Selesai'}
                    </span>
                  </div>
                  <p className="text-2xl font-black italic text-black">Rp {order.total.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs font-bold text-stone-500">Ubah Status:</p>
                  <select 
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    className="p-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-stone-100 bg-stone-50 outline-none focus:border-black transition-all"
                  >
                    <option value="PAID">Perlu Dikirim</option>
                    <option value="SHIPPED">Sedang Dikirim</option>
                    <option value="COMPLETED">Selesai</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-stone-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-black text-white rounded-lg flex items-center justify-center text-[10px] font-black">{item.quantity}</span>
                      <span className="font-bold text-stone-700">{item.name}</span>
                    </div>
                    <span className="font-black italic">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="py-20 text-center bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
              <ShoppingBag size={48} className="mx-auto text-stone-300 mb-4" />
              <p className="text-stone-500 font-bold">Belum ada pesanan masuk.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
