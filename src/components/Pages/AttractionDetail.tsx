import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, ArrowLeft, Share2, Heart, ShoppingBag } from 'lucide-react';
import { attractions } from '../../data/attractions';
import { useCart } from '../../contexts/CartContext';
import { Product } from '../../types';

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  const attraction = attractions.find(a => a.id === id);
  const { addToCart } = useCart();
  const [ticketProduct, setTicketProduct] = useState<Product | null>(null);
  const [loadingTicket, setLoadingTicket] = useState(false);

  useEffect(() => {
    if (attraction?.productId) {
      setLoadingTicket(true);
      fetch(`/api/products/${attraction.productId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setTicketProduct(data);
          } else {
            // Create a mock product for the ticket if not in DB
            setTicketProduct({
              id: attraction.productId,
              name: `Tiket Wisata: ${attraction.name}`,
              description: `Tiket masuk / paket wisata untuk ${attraction.name}`,
              price: 150000,
              category: 'Tiket Wisata',
              stock: 100,
              image_url: attraction.image_url,
              created_at: new Date().toISOString()
            });
          }
        })
        .catch(err => {
          console.error(err);
          // Fallback to mock product on error
          setTicketProduct({
            id: attraction.productId!,
            name: `Tiket Wisata: ${attraction.name}`,
            description: `Tiket masuk / paket wisata untuk ${attraction.name}`,
            price: 150000,
            category: 'Tiket Wisata',
            stock: 100,
            image_url: attraction.image_url,
            created_at: new Date().toISOString()
          });
        })
        .finally(() => setLoadingTicket(false));
    }
  }, [attraction]);

  if (!attraction) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="text-red-500 font-bold mb-4">Tempat wisata tidak ditemukan</p>
        <Link to="/wisata" className="text-emerald-600 hover:underline">Kembali ke Wisata</Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Editorial Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center text-center px-4 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={attraction.image_url} 
            alt={attraction.name} 
            className="w-full h-full object-cover opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to="/wisata" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-12 transition-colors uppercase tracking-[0.3em] text-xs font-black">
              <ArrowLeft size={16} /> Kembali ke Wisata
            </Link>
            <h1 className="text-[18vw] md:text-[14vw] font-black leading-[0.8] text-white uppercase tracking-tighter mb-8 italic">
              {attraction.name}
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/80">
              <MapPin size={20} className="text-emerald-500" />
              <span className="text-xl md:text-2xl font-black uppercase tracking-widest italic">{attraction.location}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Content */}
      <section className="max-w-4xl mx-auto px-4 -mt-24 relative z-20">
        <div className="bg-white dark:bg-stone-900 p-12 md:p-20 rounded-[60px] shadow-2xl border border-stone-100 dark:border-stone-800">
          <div className="flex justify-between items-center mb-12">
             <span className="px-6 py-2 bg-stone-100 dark:bg-stone-800 text-black dark:text-white text-xs font-black uppercase tracking-[0.3em] rounded-full">
              {attraction.category}
            </span>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-400 hover:text-red-500 hover:border-red-500 transition-all">
                <Heart size={20} />
              </button>
              <button className="w-12 h-12 rounded-full border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-400 hover:text-emerald-500 hover:border-emerald-500 transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          <h2 className="text-4xl font-black text-black dark:text-white italic mb-8 uppercase tracking-tighter">CERITA DI BALIKNYA</h2>
          
          <div className="space-y-8">
            <p className="text-2xl font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-emerald-600">
              {attraction.story}
            </p>
            <p className="text-xl text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
              {attraction.description}
            </p>
          </div>

          <div className="mt-20 pt-12 border-t border-stone-100 dark:border-stone-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/><line x1="3" y1="13" x2="21" y2="13"/></svg>
              </div>
              <div>
                <p className="text-xs font-black text-stone-400 uppercase tracking-widest">Tiket & Paket Wisata</p>
                {loadingTicket ? (
                  <p className="text-lg font-bold text-black dark:text-white">Memuat harga...</p>
                ) : ticketProduct ? (
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Rp {ticketProduct.price.toLocaleString('id-ID')}</p>
                ) : (
                  <p className="text-lg font-bold text-black dark:text-white">Tersedia di Lokasi</p>
                )}
              </div>
            </div>
            
            {ticketProduct ? (
              <button 
                onClick={() => addToCart(ticketProduct)}
                className="nike-button px-8 flex items-center gap-3"
              >
                <ShoppingBag size={20} />
                Pesan Tiket Sekarang
              </button>
            ) : (
              <Link to="/" className="nike-button px-12">Jelajahi Produk Lokal</Link>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 mt-32">
         <h3 className="text-3xl font-black text-black dark:text-white italic mb-12 uppercase tracking-tighter text-center">GALERI VISUAL</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
            <div className="rounded-[40px] overflow-hidden">
               <img src={attraction.image_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="grid grid-rows-2 gap-8">
               <div className="rounded-[40px] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1544441893-675973e31d85?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               </div>
               <div className="rounded-[40px] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               </div>
            </div>
         </div>
      </section>

      {/* Interactive Map Section */}
      <section className="max-w-7xl mx-auto px-4 mt-32 relative z-20">
        <div className="bg-stone-100 dark:bg-stone-900 rounded-[60px] p-8 md:p-16 border border-stone-200 dark:border-stone-800">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
              <span className="inline-block px-6 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-[0.4em] rounded-full mb-6">
                Peta Lokasi
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-black dark:text-white italic uppercase tracking-tighter">
                TEMUKAN <br />
                <span className="text-emerald-600 dark:text-emerald-500">LOKASI</span>
              </h2>
            </div>
            <p className="text-stone-600 dark:text-stone-400 font-medium max-w-md text-lg">
              Jelajahi area sekitar {attraction.name} dan rencanakan rute perjalanan Anda dengan mudah.
            </p>
          </div>
          
          <div className="w-full h-[400px] md:h-[500px] rounded-[40px] overflow-hidden shadow-2xl bg-stone-200 dark:bg-stone-800 relative">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src={`https://maps.google.com/maps?q=${encodeURIComponent(attraction.name + ' Papua')}&t=m&z=12&output=embed&iwloc=near`}
              title={`Peta Lokasi ${attraction.name}`}
              className="absolute inset-0 w-full h-full filter dark:invert-[90%] dark:hue-rotate-180 dark:contrast-150"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
