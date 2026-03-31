/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { WishlistProvider, useWishlist } from './contexts/WishlistContext';
import { ToastProvider } from './components/ui/Toast';
import { motion, AnimatePresence } from 'motion/react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProductList from './components/Products/ProductList';
import ProductDetail from './components/Products/ProductDetail';
import About from './components/Pages/About';
import Community from './components/Pages/Community';
import Stories from './components/Layout/Stories';
import SellerDashboard from './components/Pages/SellerDashboard';
import AdminDashboard from './components/Pages/AdminDashboard';
import Attractions from './components/Pages/Attractions';
import AttractionDetail from './components/Pages/AttractionDetail';
import StayDetail from './components/Pages/StayDetail';
import TravelPlanner from './components/Pages/TravelPlanner';
import Chatbot from './components/Chatbot';
import Footer from './components/Layout/Footer';
import { ShoppingBag, User, LogOut, Menu, X, Settings, Package, Heart, Moon, Sun, Sparkles } from 'lucide-react';
import { ReactNode, useState, useEffect } from 'react';

declare global {
  interface Window {
    snap: any;
  }
}

function Navbar() {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const isVercel = window.location.hostname.includes('vercel.app');

  return (
    <header className="bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl sticky top-0 z-50 border-b border-stone-100 dark:border-stone-800 transition-colors duration-300">
      {isVercel && (
        <div className="bg-amber-500 text-white text-center py-1 text-xs font-bold">
          PERHATIAN: Anda sedang membuka versi Vercel. Fitur AI mungkin tidak berfungsi. Gunakan URL AI Studio untuk fitur lengkap.
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <span className="text-white dark:text-black font-black text-xl italic">P</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-black dark:text-white italic">PACE</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-6">
            <Link to="/" className="text-sm font-bold text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">Katalog</Link>
            <Link to="/about" className="text-sm font-bold text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">Tentang Kami</Link>
            <Link to="/stories" className="text-sm font-bold text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">Cerita</Link>
            <Link to="/wisata" className="text-sm font-bold text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">Wisata</Link>
            <Link to="/planner" className="text-sm font-bold text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors uppercase tracking-widest flex items-center gap-1">
              <Sparkles size={14} /> AI Planner
            </Link>
            <Link to="/community" className="text-sm font-bold text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest">Komunitas</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-all text-stone-600 dark:text-stone-300"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
            </button>

            <Link to="/checkout" className="relative p-3 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-all active:scale-90">
              <ShoppingBag size={24} strokeWidth={2} className="text-black dark:text-white" />
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 bg-black text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="p-3 hover:bg-stone-100 rounded-full transition-all">
                  <User size={24} strokeWidth={2} className="text-black" />
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="p-3 hover:bg-stone-100 rounded-full transition-all text-red-500"
                  title="Keluar"
                >
                  <LogOut size={24} strokeWidth={2} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden sm:block text-sm font-black uppercase tracking-widest text-black hover:underline underline-offset-8">
                Masuk
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="xl:hidden p-3 hover:bg-stone-100 rounded-full transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="xl:hidden bg-white border-b border-stone-100 p-4 space-y-4"
          >
            <Link to="/" className="block text-lg font-bold text-black" onClick={() => setIsMenuOpen(false)}>Katalog</Link>
            <Link to="/about" className="block text-lg font-bold text-black" onClick={() => setIsMenuOpen(false)}>Tentang Kami</Link>
            <Link to="/stories" className="block text-lg font-bold text-black" onClick={() => setIsMenuOpen(false)}>Cerita</Link>
            <Link to="/wisata" className="block text-lg font-bold text-black" onClick={() => setIsMenuOpen(false)}>Wisata</Link>
            <Link to="/planner" className="block text-lg font-bold text-emerald-600 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <Sparkles size={20} /> AI Planner
            </Link>
            <Link to="/community" className="block text-lg font-bold text-black" onClick={() => setIsMenuOpen(false)}>Komunitas</Link>
            {!user && (
              <Link to="/login" className="block text-lg font-bold text-emerald-600" onClick={() => setIsMenuOpen(false)}>Masuk / Daftar</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function PageWrapper({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const categories = ['Semua', 'Kriya & Kerajinan', 'Fashion & Kain', 'Seni & Ukiran', 'Makanan & Minuman', 'Hasil Bumi', 'Tempat Wisata'];
  const sortOptions = [
    { id: 'terbaru', label: 'Terbaru' },
    { id: 'termurah', label: 'Harga Terendah' },
    { id: 'termahal', label: 'Harga Tertinggi' }
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Nike-style Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center px-4 overflow-hidden rounded-[40px] bg-stone-50">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544441893-675973e31d85?q=80&w=1920&auto=format&fit=crop" 
            alt="" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-[0.3em] rounded-full mb-8">
              Papua Creative Economy
            </span>
            <h2 className="text-6xl md:text-8xl font-extrabold tracking-tight text-black mb-8 leading-[1.1]">
              DARI HATI PAPUA, <br />
              <span className="text-emerald-600">UNTUK INDONESIA</span>
            </h2>
            <p className="text-3xl md:text-4xl font-serif italic text-stone-800 mb-12 max-w-3xl mx-auto leading-tight">
              "Setiap produk bercerita, setiap destinasi menginspirasi."
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                className="nike-button text-lg px-12"
              >
                Jelajahi Kekayaan Papua
              </button>
              <Link to="/community" className="text-black font-black uppercase tracking-widest text-sm hover:underline underline-offset-8">
                Lihat Cerita Kami
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Badges */}
        <div className="absolute bottom-12 left-12 hidden lg:block">
          <div className="bg-white p-4 rounded-2xl shadow-2xl border border-stone-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            </div>
            <div>
              <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Kualitas</p>
              <p className="text-sm font-bold text-black">100% Asli Papua</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories - Bento Grid Style */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
          <div 
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            className="md:col-span-2 md:row-span-2 relative rounded-[32px] overflow-hidden group cursor-pointer"
          >
            <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
              <h4 className="text-3xl font-black text-white italic mb-2">NOKEN</h4>
              <p className="text-stone-300 mb-4">Tas tradisional serat kayu alami.</p>
              <button className="w-fit px-6 py-2 bg-white text-black rounded-full font-bold text-sm">Lihat Koleksi</button>
            </div>
          </div>
          <div 
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            className="md:col-span-2 relative rounded-[32px] overflow-hidden group cursor-pointer"
          >
            <img src="https://media.dekoruma.com/article/2021/05/23175316/ukiran-tradisional-khas-papua-berbentuk-pahatan-orang-min.jpg?resize=856,570&ssl=1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
              <h4 className="text-2xl font-black text-white italic mb-1">UKIRAN ASMAT</h4>
              <button className="w-fit text-white font-bold text-sm underline underline-offset-4">Jelajahi</button>
            </div>
          </div>
          <div 
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative rounded-[32px] overflow-hidden group cursor-pointer"
          >
            <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
              <h4 className="text-xl font-black text-white italic">KOPI</h4>
            </div>
          </div>
          <div 
            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative rounded-[32px] overflow-hidden group cursor-pointer"
          >
            <img src="https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
              <h4 className="text-xl font-black text-white italic">BATIK</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <h3 className="text-4xl font-black text-black italic tracking-tighter">KATALOG TERBARU</h3>
            <p className="text-stone-500 font-medium mt-2">Dibuat dengan cinta oleh UMKM Papua.</p>
          </div>
          
          <div className="flex-grow max-w-md relative">
            <input 
              type="text" 
              placeholder="Cari produk asli Papua..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-100 border-none rounded-full px-12 py-4 font-bold text-sm focus:ring-2 focus:ring-black transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>

          <div className="flex gap-4 relative">
            <div className="relative">
              <button 
                onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                className="px-6 py-2 border-2 border-black rounded-full font-bold text-sm hover:bg-black hover:text-white transition-all"
              >
                {filterCategory === 'Semua' ? 'Kategori' : filterCategory}
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl z-20 py-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setFilterCategory(cat); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-stone-50 ${filterCategory === cat ? 'text-emerald-600' : 'text-stone-600'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                className="px-6 py-2 border-2 border-black rounded-full font-bold text-sm hover:bg-black hover:text-white transition-all"
              >
                Urutkan
              </button>
              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-xl z-20 py-2">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { setSortBy(opt.id); setIsSortOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-stone-50 ${sortBy === opt.id ? 'text-emerald-600' : 'text-stone-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <ProductList searchTerm={searchTerm} sortBy={sortBy} filterCategory={filterCategory} />
      </section>
    </div>
  );
}

function Checkout() {
  const { items, totalPrice, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'waiting_payment' | 'processing' | 'success'>('idle');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState<string>('jne');
  const [dynamicShippingCost, setDynamicShippingCost] = useState<number>(0);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [cities, setCities] = useState<any[]>([
    { city_id: '154', city_name: 'Jayapura', type: 'Kota' },
    { city_id: '151', city_name: 'Jakarta Pusat', type: 'Kota' },
    { city_id: '444', city_name: 'Surabaya', type: 'Kota' },
    { city_id: '23', city_name: 'Bandung', type: 'Kota' },
    { city_id: '210', city_name: 'Makassar', type: 'Kota' },
    { city_id: '430', city_name: 'Sorong', type: 'Kota' }
  ]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [destinationCity, setDestinationCity] = useState<string>('151'); // Jakarta
  const [tipAmount, setTipAmount] = useState<number>(0);

  const physicalItems = items.filter(item => item.category !== 'Tiket Wisata');
  const ticketItems = items.filter(item => item.category === 'Tiket Wisata');
  const hasPhysicalItems = physicalItems.length > 0;

  const totalWeight = physicalItems.reduce((acc, item) => acc + (item.quantity * 250), 0);
  const remainder = totalWeight % 1000;
  const spaceLeft = remainder === 0 ? 0 : 1000 - remainder;
  const weightPercentage = remainder === 0 ? 100 : (remainder / 1000) * 100;

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await fetch('/api/logistics/cities');
        if (res.ok) {
          const data = await res.json();
          console.log('Fetched cities:', data);
          setCities(data);
        }
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (hasPhysicalItems) {
      const fetchShippingCost = async () => {
        setLoadingShipping(true);
        console.log('Fetching shipping cost for:', { destinationCity, totalWeight, shippingMethod });
        try {
          const res = await fetch('/api/logistics/shipping-cost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              origin: '154', // Jayapura
              destination: destinationCity,
              weight: totalWeight,
              courier: shippingMethod
            })
          });
          
          if (res.ok) {
            const result = await res.json();
            console.log('Shipping cost result:', result);
            if (result.success && result.data) {
              setDynamicShippingCost(result.data.cost);
            } else {
              throw new Error('Invalid response format');
            }
          } else {
            const errorData = await res.json();
            console.error('Shipping API error response:', errorData);
            throw new Error('Server responded with error');
          }
        } catch (err) {
          console.error('Failed to fetch shipping cost:', err);
          // Fallback calculation (matching backend simulation logic for consistency)
          const weightKg = Math.ceil(totalWeight / 1000) || 1;
          const destId = parseInt(destinationCity) || 151;
          const distanceFactor = (Math.abs(destId - 154) % 20) * 2000;
          let baseRate = 85000;
          
          let courierMultiplier = 1;
          if (shippingMethod === 'jne') courierMultiplier = 1.1;
          if (shippingMethod === 'tiki') courierMultiplier = 1.05;
          if (shippingMethod === 'pos') courierMultiplier = 0.95;
          
          const fallbackCost = Math.round((baseRate + distanceFactor) * weightKg * courierMultiplier);
          console.log('Using fallback shipping cost:', fallbackCost);
          setDynamicShippingCost(fallbackCost);
        } finally {
          setLoadingShipping(false);
        }
      };
      fetchShippingCost();
    } else {
      setDynamicShippingCost(0);
    }
  }, [shippingMethod, totalWeight, hasPhysicalItems, destinationCity]);

  const totalShipping = hasPhysicalItems ? dynamicShippingCost : 0;
  const finalTotal = totalPrice + totalShipping + tipAmount;
  const totalWeightKg = Math.ceil(totalWeight / 1000) || 1;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-32 text-center px-4">
        <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag size={48} className="text-stone-300" />
        </div>
        <h2 className="text-4xl font-black text-black italic mb-4">KERANJANG KOSONG</h2>
        <p className="text-stone-500 mb-12 font-medium">Anda belum menambahkan produk apa pun ke keranjang belanja.</p>
        <Link to="/" className="nike-button inline-block">Mulai Belanja</Link>
      </div>
    );
  }

  const handleProcessPayment = async () => {
    setPaymentStatus('processing');
    
    try {
      // 1. Create order in database
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'guest',
          total: finalTotal,
          items: items
        })
      });
      
      const orderData = await res.json();
      if (!res.ok) throw new Error('Gagal membuat pesanan');

      // 2. Get Snap Token
      const tokenRes = await fetch('/api/payments/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.order_id,
          totalAmount: finalTotal,
          customerDetails: {
            name: user?.user_metadata?.full_name || 'Guest',
            email: user?.email || 'guest@example.com',
            phone: '08123456789'
          }
        })
      });
      
      const { token } = await tokenRes.json();
      
      // 3. Trigger Snap
      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: (result: any) => {
            setPaymentStatus('success');
            setTimeout(() => {
              clearCart();
              setShowPaymentModal(false);
              navigate('/profile');
            }, 2000);
          },
          onPending: (result: any) => {
            alert('Menunggu pembayaran');
            setPaymentStatus('idle');
          },
          onError: (result: any) => {
            alert('Pembayaran gagal');
            setPaymentStatus('idle');
          },
          onClose: () => {
            setPaymentStatus('idle');
          }
        });
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat memproses pembayaran.');
      setPaymentStatus('idle');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 relative">
      <h2 className="text-5xl font-black text-black italic mb-12 tracking-tighter">KERANJANG ANDA</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-stone-100 group"
            >
              <div className="w-full sm:w-48 aspect-square rounded-3xl overflow-hidden bg-stone-50">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow flex flex-col justify-between py-2">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-2xl font-black text-black italic">{item.name}</h4>
                    <p className="text-xl font-black text-black">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                  </div>
                  <p className="text-stone-500 font-medium mb-4">{item.category}</p>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 bg-stone-100 px-4 py-2 rounded-full">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="font-bold text-xl">-</button>
                      <span className="font-black w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="font-bold text-xl">+</button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="space-y-8">
          {hasPhysicalItems && (
            <>
              {/* Box Optimizer */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-[32px] border border-emerald-100 dark:border-emerald-800/30">
                <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-100 italic mb-2">Box Optimizer</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium mb-4">
                  Total berat: <span className="font-bold">{totalWeight}g</span>. 
                  {spaceLeft > 0 ? ` Masih ada ruang ${spaceLeft}g untuk ongkir 1kg yang sama!` : ' Pas 1kg!'}
                </p>
                <div className="w-full bg-emerald-200 dark:bg-emerald-900/50 rounded-full h-3 mb-2">
                  <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${weightPercentage}%` }}></div>
                </div>
                {spaceLeft > 0 && (
                  <Link to="/" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline uppercase tracking-widest">
                    + Tambah Produk Lain
                  </Link>
                )}
              </div>

              {/* Shipping Method */}
              <div className="bg-stone-50 dark:bg-stone-900 p-8 rounded-[32px] border border-stone-100 dark:border-stone-800">
                <h3 className="text-xl font-black text-black dark:text-white italic mb-4">Tujuan Pengiriman</h3>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Kota Tujuan</label>
                  <select 
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                    disabled={loadingCities}
                  >
                    {cities.map((city) => (
                      <option key={city.city_id} value={city.city_id}>
                        {city.type} {city.city_name}
                      </option>
                    ))}
                    {loadingCities && <option disabled>Memuat daftar lengkap...</option>}
                  </select>
                </div>

                <h3 className="text-xl font-black text-black dark:text-white italic mb-4">Pilih Kurir</h3>
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${shippingMethod === 'jne' ? 'border-black dark:border-white bg-white dark:bg-black' : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" value="jne" checked={shippingMethod === 'jne'} onChange={() => setShippingMethod('jne')} className="w-4 h-4 text-black focus:ring-black" />
                      <div>
                        <p className="font-bold text-sm dark:text-white">JNE Express</p>
                        <p className="text-xs text-stone-500">Reguler</p>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${shippingMethod === 'pos' ? 'border-black dark:border-white bg-white dark:bg-black' : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" value="pos" checked={shippingMethod === 'pos'} onChange={() => setShippingMethod('pos')} className="w-4 h-4 text-black focus:ring-black" />
                      <div>
                        <p className="font-bold text-sm dark:text-white">POS Indonesia</p>
                        <p className="text-xs text-stone-500">Kilat Khusus</p>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${shippingMethod === 'tiki' ? 'border-black dark:border-white bg-white dark:bg-black' : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" value="tiki" checked={shippingMethod === 'tiki'} onChange={() => setShippingMethod('tiki')} className="w-4 h-4 text-black focus:ring-black" />
                      <div>
                        <p className="font-bold text-sm dark:text-white">TIKI</p>
                        <p className="text-xs text-stone-500">Reguler</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Tip untuk Pengrajin */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-[32px] border border-yellow-200 dark:border-yellow-800/30">
            <h3 className="text-xl font-black text-yellow-900 dark:text-yellow-100 italic mb-2">Dukung Pengrajin</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium mb-4">
              100% tip yang Anda berikan akan langsung disalurkan ke pengrajin Papua untuk mendukung kesejahteraan mereka.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[10000, 25000, 50000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTipAmount(amount === tipAmount ? 0 : amount)}
                  className={`py-2 rounded-xl border text-sm font-bold transition-all ${
                    tipAmount === amount 
                      ? 'bg-yellow-400 border-yellow-500 text-yellow-900' 
                      : 'bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-100'
                  }`}
                >
                  Rp {amount / 1000}k
                </button>
              ))}
            </div>
            {tipAmount > 0 && (
              <p className="text-xs font-bold text-yellow-700 text-center">Terima kasih atas dukungan Anda! ❤️</p>
            )}
          </div>

          <div className="bg-stone-50 dark:bg-stone-900 p-8 rounded-[32px] space-y-6 border border-stone-100 dark:border-stone-800">
            <h3 className="text-2xl font-black text-black dark:text-white italic">RINGKASAN</h3>
            <div className="space-y-4">
               <div className="flex justify-between font-medium text-stone-600 dark:text-stone-400">
                <span>Subtotal</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              {hasPhysicalItems && (
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between font-medium text-stone-600 dark:text-stone-400">
                    <span>Pengiriman ({totalWeightKg}kg)</span>
                    {loadingShipping ? (
                      <span className="animate-pulse">Menghitung...</span>
                    ) : (
                      <span>Rp {totalShipping.toLocaleString('id-ID')}</span>
                    )}
                  </div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    Ke: {cities.find(c => c.city_id === destinationCity)?.city_name || 'Jakarta Pusat'}
                  </div>
                </div>
              )}
              {tipAmount > 0 && (
                <div className="flex justify-between font-medium text-yellow-600 dark:text-yellow-500">
                  <span>Tip Pengrajin</span>
                  <span>Rp {tipAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-between text-xl font-black text-black dark:text-white">
                <span>Total</span>
                <span>Rp {finalTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="nike-button w-full py-5 text-lg"
            >
              Pilih Pembayaran
            </button>
          </div>
          
          <div className="p-8 border-2 border-stone-100 rounded-[32px]">
            <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Metode Pembayaran</p>
            <div className="flex gap-4 opacity-30 grayscale">
              <div className="w-12 h-8 bg-stone-200 rounded"></div>
              <div className="w-12 h-8 bg-stone-200 rounded"></div>
              <div className="w-12 h-8 bg-stone-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {paymentStatus === 'success' ? (
              <div className="p-12 text-center space-y-6 overflow-y-auto">
                <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 className="text-3xl font-black italic text-black">🎉 Pesanan Dibuat!</h3>
                <p className="text-stone-500 font-medium">
                  Terima kasih telah mendukung produk Papua.<br />
                  Silakan tunggu konfirmasi pembayaran dari admin.
                </p>
              </div>
            ) : paymentStatus === 'waiting_payment' || paymentStatus === 'processing' ? (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="bg-stone-50 p-6 border-b border-stone-100 flex justify-between items-center shrink-0">
                  <div>
                    <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1">Selesaikan Pembayaran</p>
                    <p className="text-2xl font-black text-black">Rp {finalTotal.toLocaleString('id-ID')}</p>
                  </div>
                  <button onClick={() => setShowPaymentModal(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-stone-400 hover:text-black transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto text-center flex-grow">
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl text-left mb-4">
                    <p className="text-sm text-yellow-800 font-medium">
                      Karena PACE masih dalam tahap pengembangan (Beta), pembayaran saat ini dilakukan melalui <strong>Transfer Manual</strong>.
                    </p>
                  </div>
                  
                  <p className="font-bold text-stone-600">Silakan transfer tepat sebesar:</p>
                  <div className="bg-stone-100 p-6 rounded-3xl">
                    <p className="text-4xl font-black text-black">Rp {finalTotal.toLocaleString('id-ID')}</p>
                  </div>

                  <div className="text-left space-y-2 mt-6">
                    <p className="text-sm text-stone-500">Ke rekening berikut:</p>
                    <div className="p-4 border border-stone-200 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-black">{selectedMethod === 'transfer_bca' ? 'BCA' : selectedMethod === 'transfer_mandiri' ? 'Mandiri' : 'BRI'}</p>
                        <p className="text-xl font-mono font-black tracking-widest text-stone-700">1234 5678 90</p>
                        <p className="text-sm text-stone-500">a.n. PT Papua Creative Economy</p>
                      </div>
                      <button className="text-emerald-600 font-bold text-sm hover:underline">Salin</button>
                    </div>
                  </div>

                  <div className="text-left mt-6">
                    <label className="block text-sm font-bold text-stone-700 mb-2">Upload Bukti Transfer</label>
                    <div className="w-full h-32 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center text-stone-400 bg-stone-50 cursor-pointer hover:border-emerald-500 hover:text-emerald-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      <span className="font-medium text-sm">Klik untuk upload foto/screenshot</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleProcessPayment}
                    disabled={paymentStatus === 'processing'}
                    className={`w-full py-4 rounded-full font-bold text-lg transition-all mt-4 ${
                      paymentStatus === 'processing'
                        ? 'bg-black text-white opacity-80 cursor-wait'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {paymentStatus === 'processing' ? 'Memproses...' : 'Konfirmasi Pembayaran'}
                  </button>
                  
                  <button 
                    onClick={handleProcessPayment}
                    className="w-full py-3 text-stone-500 font-bold text-sm hover:text-black transition-colors flex items-center justify-center gap-2"
                  >
                    Atau Konfirmasi via WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="bg-stone-50 p-6 border-b border-stone-100 flex justify-between items-center shrink-0">
                  <div>
                    <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1">Total Pembayaran</p>
                    <p className="text-2xl font-black text-black">Rp {finalTotal.toLocaleString('id-ID')}</p>
                  </div>
                  <button onClick={() => setShowPaymentModal(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-stone-400 hover:text-black transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                
                <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                  <p className="font-bold text-black">Pilih Metode Pembayaran</p>
                  
                  <div className="space-y-3">
                    {[
                      { id: 'transfer_bca', name: 'Transfer Bank BCA', icon: '🏦' },
                      { id: 'transfer_mandiri', name: 'Transfer Bank Mandiri', icon: '🏦' },
                      { id: 'transfer_bri', name: 'Transfer Bank BRI', icon: '🏦' },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                          selectedMethod === method.id 
                            ? 'border-black bg-stone-50' 
                            : 'border-stone-100 hover:border-stone-200'
                        }`}
                      >
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium text-black">{method.name}</span>
                        {selectedMethod === method.id && (
                          <div className="ml-auto w-6 h-6 bg-black rounded-full flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setPaymentStatus('waiting_payment')}
                    disabled={!selectedMethod}
                    className={`w-full py-4 rounded-full font-bold text-lg transition-all shrink-0 mt-4 ${
                      !selectedMethod 
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                        : 'bg-black text-white hover:bg-stone-800'
                    }`}
                  >
                    Lanjutkan
                  </button>
                  
                  <p className="text-center text-xs text-stone-400 font-medium mt-4">
                    Secured by PACE Mock Payment Gateway
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

function Profile() {
  const { user } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('Pesanan Saya');
  const [orders, setOrders] = useState<any[]>([]);
  const [isStoreSubmitted, setIsStoreSubmitted] = useState(false);
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${user?.id || 'guest'}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders', err);
      }
    };
    fetchOrders();

    if (localStorage.getItem('pace_is_seller') === 'true') {
      setIsSeller(true);
    }
  }, [user?.id]);

  const tabs = [
    { id: 'Pesanan Saya', icon: Package, label: 'Pesanan Saya' },
    { id: 'Wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'Buka Toko', icon: ShoppingBag, label: 'Buka Toko' },
    { id: 'Super Admin', icon: Settings, label: 'Super Admin' },
    { id: 'Pengaturan', icon: Settings, label: 'Pengaturan' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-stone-50 p-8 rounded-[40px] text-center border border-stone-100">
            <div className="w-24 h-24 bg-black rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black italic">
              {user?.email?.[0].toUpperCase()}
            </div>
            <h3 className="text-xl font-black text-black italic truncate">{user?.email}</h3>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-2">Member Sejak 2026</p>
          </div>
          
          <nav className="space-y-2">
            {tabs.map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors font-bold ${
                  activeTab === item.id 
                    ? 'bg-black text-white' 
                    : 'hover:bg-stone-50 text-stone-600'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3 space-y-12">
          <h2 className="text-5xl font-black text-black italic tracking-tighter uppercase">{activeTab}</h2>
          
          {activeTab === 'Pesanan Saya' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100">
                  <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Total Belanja</p>
                  <h4 className="text-4xl font-black text-black italic">
                    Rp {orders.reduce((acc, order) => acc + order.total, 0).toLocaleString('id-ID')}
                  </h4>
                </div>
                <div className="p-8 bg-stone-50 rounded-[40px] border border-stone-100">
                  <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-2">Poin PACE</p>
                  <h4 className="text-4xl font-black text-black italic">
                    {Math.floor(orders.reduce((acc, order) => acc + order.total, 0) / 10000)}
                  </h4>
                </div>
              </div>
              
              {orders.length === 0 ? (
                <div className="bg-stone-50 rounded-[40px] p-12 text-center border border-stone-100">
                  <p className="text-stone-400 font-medium italic">Belum ada riwayat pesanan.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order, i) => (
                    <div key={i} className="bg-white border border-stone-200 rounded-[32px] p-8">
                      <div className="flex justify-between items-center mb-6 pb-6 border-b border-stone-100">
                        <div>
                          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">ID Pesanan: #{order.id}</p>
                          <p className="text-sm font-medium text-stone-600">{new Date(order.created_at || order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                          order.status === 'PAID' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'SHIPPED' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {order.status === 'PAID' ? 'Dibayar' : 
                           order.status === 'SHIPPED' ? 'Dikirim' : 
                           order.status === 'COMPLETED' ? 'Selesai' : 
                           order.status || 'Diproses'}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {order.items.map((item: any, j: number) => (
                          <div key={j} className="flex items-center gap-4">
                            <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                            <div className="flex-grow">
                              <h5 className="font-black text-black italic">{item.name}</h5>
                              <p className="text-sm text-stone-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                            </div>
                            {item.category === 'Tiket Wisata' && (
                              <button 
                                onClick={() => alert('E-Ticket akan dikirim ke email Anda atau dapat diunduh di sini.')}
                                className="px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
                              >
                                E-Ticket
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t border-stone-100 flex justify-between items-center">
                        <span className="font-bold text-stone-500">Total Pembayaran</span>
                        <span className="text-2xl font-black text-black italic">Rp {order.total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'Wishlist' && (
            <div>
              {wishlistItems.length === 0 ? (
                <div className="bg-stone-50 rounded-[40px] p-12 text-center border border-stone-100">
                  <p className="text-stone-400 font-medium italic">Wishlist Anda masih kosong.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border border-stone-200 rounded-3xl group">
                      <img src={item.image_url} alt={item.name} className="w-24 h-24 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                      <div className="flex flex-col justify-center flex-grow">
                        <h4 className="font-black text-black italic">{item.name}</h4>
                        <p className="text-emerald-600 font-bold text-sm mb-2">Rp {item.price.toLocaleString('id-ID')}</p>
                        <div className="flex gap-2">
                          <Link to={`/product/${item.id}`} className="text-xs font-bold bg-black text-white px-4 py-2 rounded-full">Lihat</Link>
                          <button onClick={() => removeFromWishlist(item.id)} className="text-xs font-bold border border-stone-200 px-4 py-2 rounded-full text-stone-500 hover:text-red-500 hover:border-red-200 transition-colors">Hapus</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Buka Toko' && (
            <div className="bg-stone-50 rounded-[40px] p-12 border border-stone-100">
              <div className="max-w-xl mx-auto text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <ShoppingBag size={40} />
                </div>
                {isSeller ? (
                  <>
                    <h3 className="text-3xl font-black text-black italic">Toko Anda Telah Aktif</h3>
                    <p className="text-stone-500 font-medium">
                      Kelola produk, pantau pesanan, dan kembangkan bisnis Anda melalui Dashboard Toko.
                    </p>
                    <button onClick={() => navigate('/seller')} className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-stone-800 transition-colors mt-4">
                      Masuk ke Dashboard Toko
                    </button>
                  </>
                ) : isStoreSubmitted ? (
                  <div className="mt-8 p-6 bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-200 text-left">
                    <h4 className="font-bold text-lg mb-2">Pendaftaran Berhasil! 🎉</h4>
                    <p>Toko Anda telah disetujui. Anda sekarang dapat mulai berjualan.</p>
                    <button onClick={() => navigate('/seller')} className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors mt-4">
                      Masuk ke Dashboard Toko
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-3xl font-black text-black italic">Jual Produk Asli Papua Anda</h3>
                    <p className="text-stone-500 font-medium">
                      Bergabunglah dengan ratusan pengrajin dan UMKM Papua lainnya. Jangkau pasar yang lebih luas dan lestarikan warisan budaya melalui karya Anda.
                    </p>
                    <form className="space-y-4 text-left mt-8" onSubmit={(e) => { 
                      e.preventDefault(); 
                      setIsStoreSubmitted(true); 
                      setIsSeller(true);
                      localStorage.setItem('pace_is_seller', 'true');
                    }}>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Nama Toko / UMKM</label>
                        <input type="text" required className="w-full p-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="Contoh: Noken Indah Wamena" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Kategori Utama</label>
                        <select className="w-full p-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white">
                          <option>Kriya & Kerajinan</option>
                          <option>Fashion & Kain</option>
                          <option>Seni & Ukiran</option>
                          <option>Makanan & Minuman</option>
                          <option>Hasil Bumi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Nomor WhatsApp</label>
                        <input type="tel" required className="w-full p-4 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" placeholder="08xx-xxxx-xxxx" />
                      </div>
                      <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-stone-800 transition-colors mt-4">
                        Ajukan Pendaftaran Toko
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Super Admin' && (
            <div className="bg-stone-50 rounded-[40px] p-12 border border-stone-100 text-center space-y-6">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto text-white">
                <Settings size={40} />
              </div>
              <h3 className="text-3xl font-black text-black italic">Super Admin Panel</h3>
              <p className="text-stone-500 font-medium max-w-md mx-auto">
                Kelola seluruh data pengguna, produk, dan pesanan di platform PACE.
              </p>
              <button onClick={() => navigate('/admin')} className="w-full max-w-sm mx-auto bg-black text-white font-bold py-4 rounded-2xl hover:bg-stone-800 transition-colors mt-4">
                Masuk ke Admin Panel
              </button>
            </div>
          )}

          {activeTab === 'Pengaturan' && (
            <div className="bg-stone-50 rounded-[40px] p-12 border border-stone-100 space-y-6">
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Email</label>
                <input type="email" value={user?.email || ''} disabled className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-stone-500" />
              </div>
              <button className="text-red-500 font-bold text-sm hover:underline">Hapus Akun</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <Router>
              <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                      <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
                      <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
                      <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                      <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                      <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                      <Route path="/stories" element={<PageWrapper><Stories /></PageWrapper>} />
                      <Route path="/wisata" element={<PageWrapper><Attractions /></PageWrapper>} />
                      <Route path="/wisata/:id" element={<PageWrapper><AttractionDetail /></PageWrapper>} />
                      <Route path="/penginapan/:id" element={<PageWrapper><StayDetail /></PageWrapper>} />
                      <Route path="/planner" element={<PageWrapper><TravelPlanner /></PageWrapper>} />
                      <Route path="/community" element={<PageWrapper><Community /></PageWrapper>} />
                      <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
                      <Route path="/seller" element={<PageWrapper><SellerDashboard /></PageWrapper>} />
                      <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                    </Routes>
                  </AnimatePresence>
                </main>
                <Footer />
                <Chatbot />
              </div>
            </Router>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

