import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, ArrowRight } from 'lucide-react';
import { attractions } from '../../data/attractions';

export default function Attractions() {
  return (
    <div className="pb-24">
      {/* Editorial Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center text-center px-4 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=1920&auto=format&fit=crop" 
            alt="Raja Ampat" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-6 py-2 bg-emerald-500 text-white text-xs font-black uppercase tracking-[0.4em] rounded-full mb-8">
              Explore Papua
            </span>
            <h1 className="text-[15vw] md:text-[12vw] font-black leading-[0.85] text-white uppercase tracking-tighter mb-8 italic">
              SURGA <br />
              <span className="text-emerald-500">TERSEMBUNYI</span>
            </h1>
            <p className="text-xl md:text-2xl font-serif italic text-stone-300 max-w-2xl mx-auto leading-relaxed">
              "Setiap jengkal tanah Papua menyimpan cerita, setiap ombak membawa legenda."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Attractions Grid */}
      <section className="max-w-7xl mx-auto px-4 -mt-32 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {attractions.map((attraction, index) => (
            <motion.div
              key={attraction.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-stone-900 rounded-[40px] overflow-hidden border border-stone-100 dark:border-stone-800 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img 
                  src={attraction.image_url} 
                  alt={attraction.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                    {attraction.category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                  <MapPin size={14} />
                  <span className="text-xs font-black uppercase tracking-widest">{attraction.location}</span>
                </div>
                <h3 className="text-3xl font-black text-black dark:text-white italic mb-4 uppercase tracking-tighter">
                  {attraction.name}
                </h3>
                <p className="text-stone-500 dark:text-stone-400 font-medium mb-8 line-clamp-2">
                  {attraction.description}
                </p>
                <Link 
                  to={`/wisata/${attraction.id}`}
                  className="inline-flex items-center gap-3 text-black dark:text-white font-black uppercase tracking-widest text-sm group/link"
                >
                  Baca Cerita
                  <div className="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center group-hover/link:bg-black group-hover/link:text-white dark:group-hover/link:bg-white dark:group-hover/link:text-black transition-all">
                    <ArrowRight size={18} />
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cultural Note Section */}
      <section className="max-w-4xl mx-auto px-4 mt-32 text-center">
        <div className="w-20 h-1 bg-emerald-500 mx-auto mb-12"></div>
        <h2 className="text-4xl font-black text-black dark:text-white italic mb-8">MENJAGA WARISAN ALAM</h2>
        <p className="text-xl font-serif italic text-stone-600 dark:text-stone-400 leading-relaxed mb-12">
          "Kami percaya bahwa pariwisata bukan hanya tentang melihat tempat baru, tetapi tentang memahami jiwa dari tanah tersebut. Melalui PACE, kami mengajak Anda untuk menjelajahi Papua dengan rasa hormat terhadap alam dan budaya setempat."
        </p>
        <Link to="/planner" className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.35 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>
          Rencanakan Liburan dengan AI
        </Link>
      </section>
    </div>
  );
}
