import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { motion } from 'motion/react';
import { Plus, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  key?: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group flex flex-col h-full"
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-stone-50 mb-6">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          
          {/* Category Tag */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-stone-100 shadow-sm">
              {product.category}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isWishlisted) {
                removeFromWishlist(product.id);
              } else {
                addToWishlist(product);
              }
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md text-stone-400 hover:text-red-500 rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm active:scale-90 z-10"
          >
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-red-500" : ""} />
          </button>

          {/* Quick Add Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="absolute bottom-4 right-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl active:scale-90 z-10"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
        
        {/* Info Container */}
        <div className="px-2 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-black font-black text-xl italic tracking-tight group-hover:text-emerald-600 transition-colors uppercase">
              {product.name}
            </h3>
            <span className="text-lg font-black text-black">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
          </div>
          
          <p className="text-stone-400 text-sm font-medium line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
