import { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, productsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/products'),
        fetch('/api/admin/orders')
      ]);
      
      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
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

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Hapus pengguna ini?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-24 text-center">Memuat admin panel...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-black italic mb-8">SUPER ADMIN</h1>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('Dashboard')}
          className={`px-6 py-3 rounded-full font-bold transition-colors ${activeTab === 'Dashboard' ? 'bg-black text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('Pengguna')}
          className={`px-6 py-3 rounded-full font-bold transition-colors ${activeTab === 'Pengguna' ? 'bg-black text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
        >
          Pengguna
        </button>
        <button 
          onClick={() => setActiveTab('Produk')}
          className={`px-6 py-3 rounded-full font-bold transition-colors ${activeTab === 'Produk' ? 'bg-black text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
        >
          Produk
        </button>
      </div>

      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-stone-50 p-8 rounded-[32px] border border-stone-200 flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Users size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Total Pengguna</p>
              <p className="text-4xl font-black italic">{stats.users}</p>
            </div>
          </div>
          <div className="bg-stone-50 p-8 rounded-[32px] border border-stone-200 flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <Package size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Total Produk</p>
              <p className="text-4xl font-black italic">{stats.products}</p>
            </div>
          </div>
          <div className="bg-stone-50 p-8 rounded-[32px] border border-stone-200 flex items-center gap-6">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
              <ShoppingBag size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Total Pesanan</p>
              <p className="text-4xl font-black italic">{stats.orders}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Pengguna' && (
        <div className="bg-white border border-stone-200 rounded-[32px] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="p-4 font-bold text-stone-500">Email</th>
                <th className="p-4 font-bold text-stone-500">Role</th>
                <th className="p-4 font-bold text-stone-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-stone-100 last:border-0">
                  <td className="p-4 font-medium">{u.email}</td>
                  <td className="p-4"><span className="px-3 py-1 bg-stone-100 rounded-full text-xs font-bold uppercase">{u.role || 'User'}</span></td>
                  <td className="p-4">
                    <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Produk' && (
        <div className="bg-white border border-stone-200 rounded-[32px] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="p-4 font-bold text-stone-500">Produk</th>
                <th className="p-4 font-bold text-stone-500">Harga</th>
                <th className="p-4 font-bold text-stone-500">Kategori</th>
                <th className="p-4 font-bold text-stone-500">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-stone-100 last:border-0">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <span className="font-bold">{p.name}</span>
                  </td>
                  <td className="p-4 font-medium">Rp {p.price.toLocaleString('id-ID')}</td>
                  <td className="p-4 text-sm text-stone-500">{p.category}</td>
                  <td className="p-4">
                    <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
