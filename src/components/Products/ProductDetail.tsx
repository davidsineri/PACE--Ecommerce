import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ArrowLeft, Users, MapPin, Clock } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { Product } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showGroupBuyModal, setShowGroupBuyModal] = useState(false);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchProductAndReviews = async () => {
    setLoading(true);
    try {
      const [productRes, reviewsRes] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch(`/api/products/${id}/reviews`)
      ]);

      if (!productRes.ok) throw new Error('Produk tidak ditemukan');
      
      const productData = await productRes.json();
      const reviewsData = reviewsRes.ok ? await reviewsRes.json() : [];

      setProduct(productData);
      setReviews(reviewsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductAndReviews();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Silakan login untuk memberikan ulasan.');
      return;
    }
    if (!newReview.comment.trim()) {
      alert('Komentar tidak boleh kosong.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonim',
          rating: newReview.rating,
          comment: newReview.comment
        })
      });

      if (res.ok) {
        setNewReview({ rating: 5, comment: '' });
        fetchProductAndReviews();
      } else {
        const errData = await res.json();
        alert(`Gagal mengirim ulasan: ${errData.error || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat mengirim ulasan.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-24 text-center">Memuat produk...</div>;
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-red-500 font-bold mb-4">{error || 'Produk tidak ditemukan'}</p>
        <Link to="/" className="text-emerald-600 hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft size={20} />
        <span className="font-bold">Kembali ke Katalog</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        {/* Product Image */}
        <div className="aspect-square rounded-[40px] overflow-hidden bg-stone-100">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-4 py-1.5 bg-stone-100 text-stone-600 text-xs font-black uppercase tracking-[0.2em] rounded-full">
                {product.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-[0.1em] rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                100% Asli Papua
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-black italic mb-4">{product.name}</h1>
            <p className="text-3xl font-black text-emerald-600 mb-6">Rp {product.price.toLocaleString('id-ID')}</p>
            <p className="text-stone-600 leading-relaxed text-lg mb-6">{product.description}</p>
            
            {product.story && (
              <div className="p-8 bg-stone-50 rounded-[32px] border border-stone-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <h4 className="text-xl font-black text-black italic mb-4 uppercase tracking-widest">Cerita di Balik Produk</h4>
                <p className="text-xl font-serif italic text-stone-700 leading-relaxed">"{product.story}"</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 bg-stone-100 px-6 py-3 rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="font-bold text-xl">-</button>
                <span className="font-black w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="font-bold text-xl">+</button>
              </div>
              <p className="text-sm font-bold text-stone-400">Stok: {product.stock > 0 ? product.stock : 'Tersedia'}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) addToCart(product);
                    showToast('Produk berhasil ditambahkan ke keranjang!');
                  }}
                  className="flex-1 bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  Tambah ke Keranjang
                </button>
                <button 
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) addToCart(product);
                    navigate('/checkout');
                  }}
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  Beli Sekarang
                </button>
                <button 
                  onClick={() => {
                    if (isInWishlist(product.id)) removeFromWishlist(product.id);
                    else addToWishlist(product);
                  }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isInWishlist(product.id) 
                      ? 'border-red-500 bg-red-50 text-red-500' 
                      : 'border-stone-200 text-stone-400 hover:border-black hover:text-black'
                  }`}
                >
                  <Heart size={24} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                </button>
              </div>

              {/* Beli Bareng Button */}
              <button 
                onClick={() => setShowGroupBuyModal(true)}
                className="w-full bg-emerald-50 text-emerald-700 border-2 border-emerald-200 py-4 rounded-full font-bold text-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
              >
                <Users size={20} />
                Beli Bareng (Patungan Ongkir)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-stone-100 pt-16">
        <h3 className="text-3xl font-black text-black italic mb-8">ULASAN PELANGGAN</h3>
        
        {user ? (
          <form onSubmit={handleSubmitReview} className="mb-12 bg-stone-50 p-8 rounded-[32px] border border-stone-100">
            <h4 className="text-xl font-black italic mb-4">Tulis Ulasan Anda</h4>
            <div className="mb-4">
              <label className="block text-sm font-bold text-stone-500 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star size={24} className={star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-300'} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-stone-500 mb-2">Komentar</label>
              <textarea
                required
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-black outline-none"
                rows={3}
                placeholder="Bagaimana pendapat Anda tentang produk ini?"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </form>
        ) : (
          <div className="mb-12 bg-stone-50 p-6 rounded-[24px] border border-stone-100 text-center">
            <p className="text-stone-500 font-medium">Silakan <Link to="/login" className="text-emerald-600 font-bold hover:underline">login</Link> untuk memberikan ulasan.</p>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="bg-stone-50 rounded-[32px] p-8 text-center border border-stone-100">
            <p className="text-stone-500 font-medium">Belum ada ulasan untuk produk ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-stone-200 p-6 rounded-[24px]">
                <div className="flex items-center gap-2 mb-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? 'fill-current' : 'text-stone-200'} />
                  ))}
                </div>
                <p className="text-stone-700 mb-4">"{review.comment}"</p>
                <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">{review.user_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group Buy Modal */}
      <AnimatePresence>
        {showGroupBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="bg-emerald-600 p-8 text-white relative shrink-0">
                <button 
                  onClick={() => setShowGroupBuyModal(false)} 
                  className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <h3 className="text-3xl font-black italic mb-2">BELI BARENG</h3>
                <p className="text-emerald-100 font-medium">Gabung dengan pembeli lain di kotamu untuk patungan ongkos kirim dari Papua.</p>
              </div>

              <div className="p-8 overflow-y-auto flex-grow space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xl text-black">Grup Aktif di Sekitarmu</h4>
                  <div className="flex items-center gap-1 text-stone-500 text-sm font-bold bg-stone-100 px-3 py-1 rounded-full">
                    <MapPin size={14} /> Jakarta Selatan
                  </div>
                </div>

                {/* Mock Group 1 */}
                <div className="border-2 border-emerald-100 bg-emerald-50/50 rounded-[24px] p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h5 className="font-black text-lg italic text-emerald-900">Grup Kakak Budi</h5>
                      <p className="text-sm text-emerald-700 flex items-center gap-1 mt-1">
                        <Clock size={14} /> Berangkat dalam 2 hari
                      </p>
                    </div>
                    <span className="bg-emerald-200 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Kapasitas 80%
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-bold text-emerald-800 mb-2">
                      <span>Terkumpul: 8kg</span>
                      <span>Target: 10kg</span>
                    </div>
                    <div className="w-full bg-emerald-200 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-emerald-200/50">
                    <div>
                      <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Estimasi Ongkir</p>
                      <p className="text-xl font-black text-emerald-900">Rp 15.000 <span className="text-sm font-medium line-through text-emerald-600/50">Rp 100.000</span></p>
                    </div>
                    <button 
                      onClick={() => {
                        alert('Berhasil bergabung dengan grup Beli Bareng! Pesanan Anda telah ditambahkan ke keranjang grup.');
                        setShowGroupBuyModal(false);
                      }}
                      className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Gabung Grup
                    </button>
                  </div>
                </div>

                {/* Mock Group 2 */}
                <div className="border border-stone-200 rounded-[24px] p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h5 className="font-black text-lg italic text-black">Grup Mbak Siti</h5>
                      <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
                        <Clock size={14} /> Berangkat dalam 5 hari
                      </p>
                    </div>
                    <span className="bg-stone-100 text-stone-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Kapasitas 30%
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-bold text-stone-600 mb-2">
                      <span>Terkumpul: 3kg</span>
                      <span>Target: 10kg</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-3">
                      <div className="bg-stone-400 h-3 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-stone-100">
                    <div>
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Estimasi Ongkir</p>
                      <p className="text-xl font-black text-black">Rp 35.000 <span className="text-sm font-medium line-through text-stone-300">Rp 100.000</span></p>
                    </div>
                    <button 
                      onClick={() => {
                        alert('Berhasil bergabung dengan grup Beli Bareng! Pesanan Anda telah ditambahkan ke keranjang grup.');
                        setShowGroupBuyModal(false);
                      }}
                      className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-stone-800 transition-colors"
                    >
                      Gabung Grup
                    </button>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-stone-500 font-medium mb-4">Tidak menemukan grup yang cocok?</p>
                  <button className="text-black font-black uppercase tracking-widest text-sm hover:underline underline-offset-8">
                    + Buat Grup Baru
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
