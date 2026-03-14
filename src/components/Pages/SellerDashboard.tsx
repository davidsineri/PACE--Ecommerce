import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Plus, Trash2, FileText, Store, Bot, Sparkles, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { generateProductDescription, getPackagingAdvice } from '../../services/aiService';

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

  // ... (existing state)
  const [newShop, setNewShop] = useState({ name: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', category: 'Kriya & Kerajinan', image_url: ''
  });
  const [uploading, setUploading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // ... (existing functions: handleFileChange, fetchData, handleCreateShop, handleAddProduct, handleEditClick, handleDeleteProduct, handleUpdateOrderStatus)

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

  // ... (existing render logic)

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
