import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Plus, Trash2, FileText, Store, Bot, Sparkles, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { generateProductDescription, getPackagingAdvice } from '../../services/aiService';
import { supabase } from '../../lib/supabase';

export default function SellerDashboard() {
  const { user, shop, refreshShop } = useAuth();
  const [activeTab, setActiveTab] = useState('Produk');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Halo! Saya asisten pengemasan Anda. Ada yang bisa saya bantu terkait pengemasan atau pengiriman?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [newShop, setNewShop] = useState({ name: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: 'Kriya & Kerajinan', image_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    if (shop) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [shop]);

  const fetchData = async () => {
    if (!shop) return;
    setLoading(true);
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shop.id)
        .order('created_at', { ascending: false });
      
      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('shop_orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('shop_id', shop.id)
        .order('created_at', { ascending: false });
        
      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('shops')
        .insert([{ user_id: user.id, name: newShop.name, description: newShop.description }]);
      
      if (error) throw error;
      await refreshShop();
    } catch (error) {
      console.error('Error creating shop:', error);
      alert('Gagal membuat toko.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('public').getPublicUrl(filePath);
      setNewProduct(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal mengupload gambar.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;
    setIsSubmitting(true);
    try {
      const productData = {
        shop_id: shop.id,
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        image_url: newProduct.image_url
      };

      if (editingProductId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProductId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
      }
      
      setShowAddForm(false);
      setEditingProductId(null);
      setNewProduct({ name: '', description: '', price: '', category: 'Kriya & Kerajinan', image_url: '' });
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Gagal menyimpan produk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (product: any) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url
    });
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Gagal menghapus produk.');
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('shop_orders')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Gagal mengupdate status pesanan.');
    }
  };

  const handleGenerateDescription = async () => {
    if (!newProduct.image_url) {
      alert('Silakan upload atau masukkan URL gambar terlebih dahulu.');
      return;
    }
    setAiGenerating(true);
    try {
      const description = await generateProductDescription(newProduct.image_url);
      setNewProduct(prev => ({ ...prev, description }));
    } catch (err) {
      console.error(err);
      alert('Gagal membuat deskripsi dengan AI.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsChatLoading(true);
    try {
      const response = await getPackagingAdvice(userMessage);
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, terjadi kesalahan.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-stone-100 text-center">
            <Store size={64} className="mx-auto text-stone-300 mb-6" />
            <h1 className="text-3xl font-black italic mb-4">Buka Toko Anda</h1>
            <p className="text-stone-500 mb-8">Mulai berjualan produk kreatif Papua Anda ke seluruh dunia.</p>
            
            <form onSubmit={handleCreateShop} className="max-w-md mx-auto space-y-4 text-left">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Nama Toko</label>
                <input
                  type="text"
                  required
                  value={newShop.name}
                  onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-stone-50 border-2 border-stone-100 focus:border-black outline-none transition-all"
                  placeholder="Contoh: Noken Asli Papua"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Deskripsi Toko</label>
                <textarea
                  required
                  value={newShop.description}
                  onChange={(e) => setNewShop({ ...newShop, description: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-stone-50 border-2 border-stone-100 focus:border-black outline-none transition-all h-32 resize-none"
                  placeholder="Ceritakan tentang toko Anda..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Membuka Toko...' : 'Buka Toko Sekarang'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-stone-100 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black italic mb-2">{shop.name}</h1>
            <p className="text-stone-500">{shop.description}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-stone-50 px-6 py-4 rounded-3xl text-center">
              <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-1">Total Produk</p>
              <p className="text-2xl font-black">{products.length}</p>
            </div>
            <div className="bg-emerald-50 px-6 py-4 rounded-3xl text-center">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-600/60 mb-1">Pesanan</p>
              <p className="text-2xl font-black text-emerald-600">{orders.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['Produk', 'Pesanan', 'AI Assistant'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-black text-white shadow-lg'
                  : 'bg-white text-stone-500 hover:bg-stone-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'Produk' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black italic">Daftar Produk</h2>
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  if (!showAddForm) {
                    setEditingProductId(null);
                    setNewProduct({ name: '', description: '', price: '', category: 'Kriya & Kerajinan', image_url: '' });
                  }
                }}
                className="bg-black text-white px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-stone-800 transition-colors"
              >
                {showAddForm ? 'Batal' : <><Plus size={16} /> Tambah Produk</>}
              </button>
            </div>

            {showAddForm && (
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-stone-100 mb-8">
                <h3 className="text-xl font-black italic mb-6">{editingProductId ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Nama Produk</label>
                      <input
                        type="text"
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-stone-50 border-2 border-stone-100 focus:border-black outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Harga (Rp)</label>
                      <input
                        type="number"
                        required
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-stone-50 border-2 border-stone-100 focus:border-black outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Kategori</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-stone-50 border-2 border-stone-100 focus:border-black outline-none transition-all"
                      >
                        <option>Kriya & Kerajinan</option>
                        <option>Fashion & Aksesoris</option>
                        <option>Kuliner</option>
                        <option>Seni Rupa</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Gambar Produk</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="URL Gambar"
                          value={newProduct.image_url}
                          onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                          className="flex-grow p-4 rounded-2xl bg-stone-50 border-2 border-stone-100 focus:border-black outline-none transition-all"
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading}
                          />
                          <button
                            type="button"
                            className="h-full px-6 bg-stone-200 text-stone-700 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-stone-300 transition-colors disabled:opacity-50"
                          >
                            {uploading ? 'Upload...' : 'File'}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-full">
                      <div className="flex justify-between items-end mb-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500">Deskripsi</label>
                        <button
                          type="button"
                          onClick={handleGenerateDescription}
                          disabled={aiGenerating || !newProduct.image_url}
                          className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1 hover:text-indigo-800 disabled:opacity-50"
                        >
                          <Sparkles size={14} /> {aiGenerating ? 'Generating...' : 'Generate with AI'}
                        </button>
                      </div>
                      <textarea
                        required
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-stone-50 border-2 border-stone-100 focus:border-black outline-none transition-all h-32 resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                    </button>
                  </div>
                </form>
              </div>
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
                    <div className="flex gap-4 mt-2">
                      <button onClick={() => handleEditClick(product)} className="text-stone-500 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:text-black transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:text-red-700 transition-colors">
                        <Trash2 size={14} /> Hapus
                      </button>
                    </div>
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
                  {order.order_items?.map((item: any, i: number) => (
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

        {activeTab === 'AI Assistant' && (
          <div className="bg-white border border-stone-100 rounded-[40px] p-8 shadow-sm h-[600px] flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-stone-50">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black italic">Asisten Pengemasan AI</h2>
                <p className="text-sm text-stone-500">Tanya tips packing aman untuk produk Anda</p>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 mb-6 pr-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl ${
                    msg.role === 'user' 
                      ? 'bg-black text-white rounded-br-none' 
                      : 'bg-stone-50 text-stone-800 rounded-bl-none border border-stone-100'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-stone-50 p-4 rounded-3xl rounded-bl-none border border-stone-100 flex gap-2">
                    <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ketik pertanyaan Anda di sini..."
                className="flex-grow p-4 rounded-2xl bg-stone-50 border-2 border-stone-100 focus:border-black outline-none transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={isChatLoading || !chatInput.trim()}
                className="bg-black text-white px-6 rounded-2xl flex items-center justify-center hover:bg-stone-800 transition-colors disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
