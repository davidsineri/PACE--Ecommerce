import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Map, Calendar, Wallet, Sparkles, Loader2, ArrowRight, ShoppingBag } from 'lucide-react';
import { generateTravelItinerary, smartSearchProducts } from '../../services/aiService';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

export default function TravelPlanner() {
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState('Alam & Budaya');
  const [budget, setBudget] = useState('Menengah');
  const [itinerary, setItinerary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setItinerary('');
    setRecommendedProducts([]);
    
    try {
      const result = await generateTravelItinerary(days, interests, budget);
      setItinerary(result);

      // Find recommended products based on the itinerary
      if (allProducts.length > 0) {
        // Create a summary query from the itinerary to avoid sending too much text
        const query = `Rekomendasi paket wisata, tiket, atau oleh-oleh untuk itinerary: ${interests} di Papua selama ${days} hari dengan budget ${budget}.`;
        const recommendations = await smartSearchProducts(query, allProducts);
        // Take top 3 recommendations
        setRecommendedProducts(recommendations.slice(0, 3));
      }

    } catch (error) {
      console.error(error);
      setItinerary('Maaf, terjadi kesalahan saat membuat rencana perjalanan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-6 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-xs font-black uppercase tracking-[0.4em] rounded-full mb-6">
            PACE AI Planner
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white italic uppercase tracking-tighter mb-6">
            RENCANAKAN <span className="text-emerald-600">PERJALANANMU</span>
          </h1>
          <p className="text-xl font-serif italic text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
            Biarkan AI kami menyusun itinerary sempurna untuk liburan Anda di Papua, lengkap dengan rekomendasi destinasi dan oleh-oleh lokal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-stone-900 p-8 rounded-[40px] shadow-xl border border-stone-100 dark:border-stone-800 sticky top-32">
              <h2 className="text-2xl font-black text-black dark:text-white italic uppercase tracking-tight mb-8">Detail Liburan</h2>
              
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-widest">Durasi (Hari)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                    <input 
                      type="number" 
                      min="1" 
                      max="14"
                      value={days}
                      onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-black dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-widest">Minat Utama</label>
                  <div className="relative">
                    <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                    <select 
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-black dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                    >
                      <option value="Alam & Budaya">Alam & Budaya</option>
                      <option value="Pantai & Diving">Pantai & Diving</option>
                      <option value="Petualangan Ekstrem">Petualangan Ekstrem</option>
                      <option value="Kuliner & Santai">Kuliner & Santai</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-widest">Gaya Liburan (Budget)</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                    <select 
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pl-12 pr-4 text-black dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                    >
                      <option value="Backpacker (Hemat)">Backpacker (Hemat)</option>
                      <option value="Menengah (Nyaman)">Menengah (Nyaman)</option>
                      <option value="Mewah (Premium)">Mewah (Premium)</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full nike-button flex items-center justify-center gap-2 mt-8"
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Buat Itinerary
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[40px] shadow-xl border border-stone-100 dark:border-stone-800 min-h-[600px]">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-6 py-32">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-stone-100 dark:border-stone-800 rounded-full"></div>
                    <div className="w-24 h-24 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
                    <Sparkles className="absolute inset-0 m-auto text-emerald-500 animate-pulse" size={32} />
                  </div>
                  <p className="text-xl font-serif italic animate-pulse">AI sedang meracik perjalanan impianmu...</p>
                </div>
              ) : itinerary ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-emerald-600 prose-li:marker:text-emerald-500"
                >
                  <ReactMarkdown>{itinerary}</ReactMarkdown>
                  
                  {recommendedProducts.length > 0 && (
                    <div className="mt-12 pt-12 border-t border-stone-100 dark:border-stone-800">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                        <Sparkles className="text-emerald-500" size={24} />
                        Rekomendasi AI untuk Anda
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {recommendedProducts.map(product => (
                          <Link to={`/product/${product.id}`} key={product.id} className="group block bg-stone-50 dark:bg-stone-950 rounded-3xl overflow-hidden border border-stone-100 dark:border-stone-800 hover:border-emerald-500 transition-colors">
                            <div className="aspect-square overflow-hidden bg-stone-200 dark:bg-stone-800">
                              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                            </div>
                            <div className="p-4">
                              <p className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1">{product.category}</p>
                              <h4 className="font-bold text-black dark:text-white line-clamp-1 mb-2">{product.name}</h4>
                              <p className="text-emerald-600 font-black">Rp {product.price.toLocaleString('id-ID')}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-16 pt-12 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <p className="font-bold text-stone-500">Siap untuk memulai petualangan?</p>
                    <Link to="/wisata" className="nike-button px-8 flex items-center gap-2 text-sm">
                      Lihat Semua Tiket Wisata <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-6 py-32 text-center">
                  <div className="w-24 h-24 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center">
                    <Map size={40} className="text-stone-300 dark:text-stone-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-stone-300 dark:text-stone-600 italic uppercase tracking-tighter mb-2">Belum Ada Rencana</h3>
                    <p className="text-lg font-serif italic">Isi form di samping untuk mulai merencanakan liburanmu.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
