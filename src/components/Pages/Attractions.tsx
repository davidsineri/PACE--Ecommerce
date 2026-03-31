import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Star, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { attractions } from '../../data/attractions';
import { accommodations } from '../../data/accommodations';
import BookingSearch from '../Booking/BookingSearch';

export default function Attractions() {
  const [activeTab, setActiveTab] = useState<'wisata' | 'penginapan'>('wisata');

  return (
    <div className="pb-24 bg-stone-50 dark:bg-stone-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center px-4 overflow-hidden bg-blue-900">
        <div className="absolute inset-0 z-0">
          <img 
            src={activeTab === 'wisata' 
              ? "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=1920&auto=format&fit=crop"
              : "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1920&auto=format&fit=crop"
            } 
            alt="Hero" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-stone-50 dark:to-stone-950"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
              {activeTab === 'wisata' ? 'Eksplor Wisata Papua' : 'Cari Penginapan Terbaik'}
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">
              {activeTab === 'wisata' 
                ? 'Temukan keajaiban alam dan budaya di setiap sudut tanah Papua.'
                : 'Istirahat dengan nyaman di resort dan hotel pilihan kami.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Bar Component */}
      <BookingSearch activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              {activeTab === 'wisata' ? 'Rekomendasi Wisata' : 'Penginapan Populer'}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 font-medium">
              Pilihan terbaik untuk petualangan Anda selanjutnya
            </p>
          </div>
          <button className="text-blue-600 font-bold hover:underline">Lihat Semua</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeTab === 'wisata' ? (
            attractions.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Link to={`/wisata/${item.id}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1 text-amber-500 mb-2">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-bold text-stone-700 dark:text-stone-300">{item.rating}</span>
                      <span className="text-xs text-stone-400 font-medium">({item.reviews})</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1 line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 text-stone-400 mb-4">
                      <MapPin size={12} />
                      <span className="text-xs font-medium">{item.location}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.isInstantConfirmation && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                          <CheckCircle size={10} /> Konfirmasi Instan
                        </span>
                      )}
                    </div>

                    <div className="flex items-end justify-between pt-4 border-t border-stone-50 dark:border-stone-800">
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Mulai dari</p>
                        <p className="text-lg font-black text-blue-600">
                          Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            accommodations.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold text-stone-700 dark:text-stone-300">{item.rating}</span>
                    <span className="text-xs text-stone-400 font-medium">({item.reviews})</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-stone-400 mb-4">
                    <MapPin size={12} />
                    <span className="text-xs font-medium">{item.location}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.isFreeCancellation && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
                        <CheckCircle size={10} /> Pembatalan Gratis
                      </span>
                    )}
                  </div>

                  <div className="flex items-end justify-between pt-4 border-t border-stone-50 dark:border-stone-800">
                    <div>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Mulai dari</p>
                      <p className="text-lg font-black text-blue-600">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-[10px] text-stone-400 font-medium">per malam</p>
                    </div>
                    <Link 
                      to={`/penginapan/${item.id}`}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all"
                    >
                      Pesan
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* AI Planner CTA */}
      <section className="max-w-7xl mx-auto px-4 mt-24">
        <div className="bg-blue-600 rounded-[40px] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path fill="#FFFFFF" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.5,81.4,29,72.6,41.4C63.8,53.8,51.8,64.1,38.1,71.4C24.4,78.7,9,83,-6.2,83.7C-21.4,84.4,-36.5,81.5,-49.6,74.1C-62.7,66.7,-73.8,54.8,-80.6,41C-87.4,27.2,-89.9,11.6,-88.4,-3.5C-86.9,-18.6,-81.4,-33.2,-72.1,-45.4C-62.8,-57.6,-49.7,-67.4,-35.6,-74.6C-21.5,-81.8,-10.8,-86.4,2.7,-81.1C16.2,-75.8,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Bingung Mau ke Mana? <br />
                Tanya <span className="text-blue-200">PACE AI</span> Saja!
              </h2>
              <p className="text-xl text-blue-100 mb-8 font-medium">
                Dapatkan rekomendasi wisata, penginapan, dan rute perjalanan yang dipersonalisasi khusus untuk Anda.
              </p>
              <Link to="/planner" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">
                Coba AI Planner
                <ArrowRight size={20} />
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white font-black">P</div>
                  <div>
                    <p className="text-white font-bold">PACE AI Assistant</p>
                    <p className="text-blue-200 text-xs">Online & Siap Membantu</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-2xl p-4 text-white text-sm">
                    "Halo! Saya bisa membantu merencanakan liburan Anda di Raja Ampat. Mau penginapan yang dekat dengan spot diving?"
                  </div>
                  <div className="bg-blue-500 rounded-2xl p-4 text-white text-sm ml-8">
                    "Ya, tolong carikan resort yang ramah lingkungan."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
