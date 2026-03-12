import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { Product } from '../../types';

interface ProductListProps {
  searchTerm: string;
  sortBy: string;
  filterCategory: string;
}

export default function ProductList({ searchTerm, sortBy, filterCategory }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filterCategory && filterCategory !== 'Semua') params.append('category', filterCategory);
        if (sortBy) params.append('sort', sortBy);

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) throw new Error('Gagal memuat produk');
        
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, sortBy, filterCategory]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="bg-stone-200 rounded-[32px] aspect-square mb-4"></div>
            <div className="h-6 bg-stone-200 rounded-full w-3/4 mb-2"></div>
            <div className="h-4 bg-stone-200 rounded-full w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24 bg-stone-50 rounded-[40px] border border-stone-100">
        <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <h3 className="text-2xl font-black text-black italic mb-2">PRODUK TIDAK DITEMUKAN</h3>
        <p className="text-stone-500 font-medium">Coba gunakan kata kunci lain atau ubah filter kategori.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="group"
        >
          <div className="relative aspect-square rounded-[32px] overflow-hidden bg-stone-100 mb-4">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product);
                }}
                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                title="Tambah ke Keranjang"
              >
                <ShoppingBag size={20} strokeWidth={2.5} />
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist(product);
                  }
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl ${
                  isInWishlist(product.id) ? 'bg-red-500 text-white' : 'bg-white text-black'
                }`}
                title="Wishlist"
              >
                <Heart size={20} strokeWidth={2.5} className={isInWishlist(product.id) ? 'fill-current' : ''} />
              </button>
            </div>
          </div>
          
          <Link to={`/product/${product.id}`} className="block">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-lg font-black text-black italic group-hover:text-emerald-600 transition-colors line-clamp-1">{product.name}</h4>
              <p className="text-lg font-black text-black whitespace-nowrap ml-4">Rp {product.price.toLocaleString('id-ID')}</p>
            </div>
            <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">{product.category}</p>
            {product.story && (
              <p className="text-xs text-emerald-700 italic line-clamp-2 leading-relaxed mt-1">"{product.story}"</p>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
