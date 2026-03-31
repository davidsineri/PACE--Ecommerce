import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, ArrowLeft, Share2, Heart, Star, CheckCircle, Info, ShieldCheck, Clock, Map } from 'lucide-react';
import { attractions } from '../../data/attractions';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../components/ui/Toast';
import { Product } from '../../types';
import BookingCard from '../Booking/BookingCard';

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const attraction = attractions.find(a => a.id === id);
  const { addToCart } = useCart();
  const { showToast } = useToast();
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
            setTicketProduct({
              id: attraction.productId,
              name: `Tiket Wisata: ${attraction.name}`,
              description: `Tiket masuk / paket wisata untuk ${attraction.name}`,
              price: attraction.price,
              category: 'Tiket Wisata',
              stock: 100,
              image_url: attraction.image_url,
              created_at: new Date().toISOString()
            });
          }
        })
        .catch(err => {
          console.error(err);
          setTicketProduct({
            id: attraction.productId!,
            name: `Tiket Wisata: ${attraction.name}`,
            description: `Tiket masuk / paket wisata untuk ${attraction.name}`,
            price: attraction.price,
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
        <Link to="/wisata" className="text-blue-600 hover:underline">Kembali ke Wisata</Link>
      </div>
    );
  }

  const handleBook = (details: any) => {
    if (ticketProduct) {
      addToCart(ticketProduct, details.guests);
      showToast(`${details.guests} tiket berhasil ditambahkan ke keranjang!`);
      navigate('/checkout');
    }
  };

  return (
    <div className="pb-24 bg-stone-50 dark:bg-stone-950 min-h-screen">
      {/* Breadcrumbs & Header */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/wisata" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-bold text-sm transition-all">
            <ArrowLeft size={16} /> Kembali ke Wisata
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {attraction.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold text-stone-700 dark:text-stone-300">{attraction.rating}</span>
                  <span className="text-xs text-stone-400 font-medium">({attraction.reviews} ulasan)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-white mb-2 tracking-tight">
                {attraction.name}
              </h1>
              <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
                <MapPin size={18} className="text-blue-600" />
                <span className="font-medium">{attraction.location}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all font-bold text-sm">
                <Share2 size={18} /> Bagikan
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-red-500 hover:border-red-500 transition-all font-bold text-sm">
                <Heart size={18} /> Simpan
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 aspect-[16/9] md:aspect-[21/9]">
              <div className="md:col-span-3 rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src={attraction.image_url} 
                  alt={attraction.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden md:grid grid-rows-2 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1544441893-675973e31d85?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg relative">
                  <img src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-black text-xl">
                    +12 Foto
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation (Internal) */}
            <div className="flex gap-8 border-b border-stone-200 dark:border-stone-800 pb-4">
              <button className="text-blue-600 font-black uppercase tracking-widest text-xs border-b-2 border-blue-600 pb-4 -mb-[18px]">Deskripsi</button>
              <button className="text-stone-400 font-black uppercase tracking-widest text-xs hover:text-stone-600 transition-all pb-4">Fasilitas</button>
              <button className="text-stone-400 font-black uppercase tracking-widest text-xs hover:text-stone-600 transition-all pb-4">Ulasan</button>
              <button className="text-stone-400 font-black uppercase tracking-widest text-xs hover:text-stone-600 transition-all pb-4">Lokasi</button>
            </div>

            {/* Description Section */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-sm border border-stone-100 dark:border-stone-800">
              <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-6 tracking-tight">Tentang {attraction.name}</h2>
              <div className="space-y-6">
                <p className="text-lg text-stone-800 dark:text-stone-200 leading-relaxed font-serif italic">
                  "{attraction.story}"
                </p>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                  {attraction.description}
                </p>
              </div>
            </div>

            {/* Facilities Section */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-sm border border-stone-100 dark:border-stone-800">
              <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-6 tracking-tight">Fasilitas & Layanan</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {attraction.facilities.map((facility, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                      <CheckCircle size={16} />
                    </div>
                    <span className="text-sm font-bold text-stone-700 dark:text-stone-300">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-800/30">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-blue-600" size={24} />
                <h2 className="text-xl font-black text-blue-900 dark:text-blue-100 tracking-tight">Informasi Penting</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-blue-800 dark:text-blue-200 font-medium">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0"></div>
                  Tunjukkan e-tiket di pintu masuk untuk mendapatkan akses.
                </li>
                <li className="flex items-start gap-3 text-sm text-blue-800 dark:text-blue-200 font-medium">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0"></div>
                  Disarankan membawa pakaian ganti dan perlengkapan pribadi.
                </li>
                <li className="flex items-start gap-3 text-sm text-blue-800 dark:text-blue-200 font-medium">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 shrink-0"></div>
                  Patuhi protokol kesehatan dan kebersihan setempat.
                </li>
              </ul>
            </div>

            {/* Map Section */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-sm border border-stone-100 dark:border-stone-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">Lokasi</h2>
                <button className="text-blue-600 font-bold text-sm flex items-center gap-2">
                  <Map size={16} /> Buka di Google Maps
                </button>
              </div>
              <div className="w-full h-[300px] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
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
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-4">
            <BookingCard 
              price={attraction.price} 
              title={attraction.name} 
              type="wisata"
              isInstantConfirmation={attraction.isInstantConfirmation}
              isFreeCancellation={attraction.isFreeCancellation}
              onBook={handleBook}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
