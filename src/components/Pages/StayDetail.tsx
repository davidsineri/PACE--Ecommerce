import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MapPin, Star, Share2, Heart, Info, 
  Wifi, Coffee, Car, Wind, Tv, Utensils,
  ChevronRight, Calendar, Users, ShieldCheck, RefreshCcw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { accommodations } from '../../data/accommodations';
import BookingCard from '../Booking/BookingCard';

export default function StayDetail() {
  const { id } = useParams();
  const stay = accommodations.find(a => a.id === id);
  const [activeTab, setActiveTab] = useState('deskripsi');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!stay) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black italic mb-4">Penginapan tidak ditemukan</h2>
          <Link to="/wisata" className="text-emerald-600 font-bold hover:underline">Kembali ke Wisata & Penginapan</Link>
        </div>
      </div>
    );
  }

  const facilityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Sarapan': Coffee,
    'Parkir': Car,
    'AC': Wind,
    'TV': Tv,
    'Restoran': Utensils,
    'Kolam Renang': Wind, // Fallback
  };

  return (
    <div className="bg-white dark:bg-stone-950 min-h-screen pb-20 transition-colors duration-300">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm font-bold text-stone-400 uppercase tracking-widest">
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/wisata" className="hover:text-black dark:hover:text-white transition-colors">Penginapan</Link>
          <ChevronRight size={14} />
          <span className="text-stone-600 dark:text-stone-300 truncate">{stay.name}</span>
        </div>
      </div>

      {/* Hero & Gallery */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white italic tracking-tighter uppercase mb-2">
              {stay.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
              <div className="flex items-center gap-1 text-emerald-600">
                <Star size={16} fill="currentColor" />
                <span>{stay.rating}</span>
                <span className="text-stone-400 dark:text-stone-500">({stay.reviews} Review)</span>
              </div>
              <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                <MapPin size={16} />
                <span>{stay.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 border border-stone-200 dark:border-stone-800 rounded-full hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors text-stone-600 dark:text-stone-400">
              <Share2 size={20} />
            </button>
            <button className="p-3 border border-stone-200 dark:border-stone-800 rounded-full hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors text-stone-600 dark:text-stone-400">
              <Heart size={20} />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px] md:h-[500px] rounded-[40px] overflow-hidden">
          <div className="md:col-span-2 h-full">
            <img 
              src={stay.image_url} 
              alt={stay.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-4 h-full">
            <img 
              src={`https://picsum.photos/seed/${stay.id}1/800/600`} 
              alt="Gallery 1" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              referrerPolicy="no-referrer"
            />
            <img 
              src={`https://picsum.photos/seed/${stay.id}2/800/600`} 
              alt="Gallery 2" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden md:block h-full relative">
            <img 
              src={`https://picsum.photos/seed/${stay.id}3/800/600`} 
              alt="Gallery 3" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
              referrerPolicy="no-referrer"
            />
            <button className="absolute bottom-6 right-6 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:bg-white dark:hover:bg-stone-800 transition-all text-black dark:text-white">
              Lihat Semua Foto
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-8 border-b border-stone-100 dark:border-stone-800 sticky top-20 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md z-10 py-2 transition-colors duration-300">
            {['deskripsi', 'fasilitas', 'ulasan', 'lokasi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-black dark:text-white' : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-black dark:bg-white rounded-full" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-12">
            {activeTab === 'deskripsi' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-stone dark:prose-invert max-w-none"
              >
                <h3 className="text-2xl font-black italic text-black dark:text-white uppercase tracking-tighter mb-6">Tentang Penginapan</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-lg">
                  {stay.description}
                </p>
                <div className="mt-8 p-8 bg-stone-50 dark:bg-stone-900 rounded-[32px] border border-stone-100 dark:border-stone-800">
                  <h4 className="flex items-center gap-2 text-black dark:text-white font-black italic mb-4">
                    <Info size={20} className="text-emerald-600" />
                    Informasi Penting
                  </h4>
                  <ul className="space-y-3 text-sm font-medium text-stone-600 dark:text-stone-400">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      Check-in mulai pukul 14:00 WIT
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      Check-out maksimal pukul 12:00 WIT
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      Dilarang merokok di dalam kamar
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      Membawa identitas diri (KTP/Passport) saat check-in
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'fasilitas' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-6"
              >
                {stay.facilities.map((facility, idx) => {
                  const Icon = facilityIcons[facility] || Info;
                  return (
                    <div key={idx} className="flex items-center gap-4 p-6 bg-stone-50 dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800">
                      <div className="w-12 h-12 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                        <Icon size={24} />
                      </div>
                      <span className="font-bold text-black dark:text-white">{facility}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {activeTab === 'lokasi' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="w-full h-[400px] bg-stone-100 dark:bg-stone-900 rounded-[40px] overflow-hidden border border-stone-200 dark:border-stone-800 relative group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin size={48} className="text-emerald-600 mx-auto mb-4" />
                      <p className="font-black italic text-black dark:text-white text-xl mb-2">{stay.location}</p>
                      <p className="text-stone-500 dark:text-stone-400 font-medium mb-6">Papua, Indonesia</p>
                      <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                        Buka di Google Maps
                      </button>
                    </div>
                  </div>
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                </div>
              </motion.div>
            )}

            {activeTab === 'ulasan' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-5xl font-black text-black dark:text-white italic">{stay.rating}</h3>
                    <div>
                      <div className="flex text-emerald-600">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < Math.floor(stay.rating) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mt-1">Dari {stay.reviews} Review</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-8 bg-stone-50 dark:bg-stone-900 rounded-[32px] border border-stone-100 dark:border-stone-800">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-black italic">U</div>
                          <div>
                            <p className="font-black text-black dark:text-white italic">User {i}</p>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Maret 2026</p>
                          </div>
                        </div>
                        <div className="flex text-emerald-600">
                          {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
                        Pengalaman menginap yang luar biasa! Pelayanan sangat ramah dan fasilitas lengkap. Sangat direkomendasikan untuk keluarga.
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingCard 
              price={stay.price}
              title={stay.name}
              isInstantConfirmation={stay.isInstantConfirmation}
              isFreeCancellation={stay.isFreeCancellation}
              type="penginapan"
              onBook={(details) => console.log('Booking stay:', details)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
