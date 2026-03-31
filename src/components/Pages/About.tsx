import { motion } from 'motion/react';
import { Heart, Globe, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-24">
      <section className="text-center max-w-3xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold text-black mb-6"
        >
          TENTANG PACE
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-stone-600 font-medium leading-relaxed"
        >
          "PACE hadir sebagai jembatan digital yang menghubungkan karya autentik Papua dengan dunia, berlandaskan kepercayaan dan transparansi."
        </motion.p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-stone-50 p-8 rounded-[32px] text-center border border-stone-200"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={32} />
          </div>
          <h3 className="text-2xl font-black italic mb-4">Misi Kami</h3>
          <p className="text-stone-600 font-medium">Melestarikan warisan budaya Papua melalui pemberdayaan ekonomi kreatif yang berkelanjutan.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-stone-50 p-8 rounded-[32px] text-center border border-stone-200"
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe size={32} />
          </div>
          <h3 className="text-2xl font-black italic mb-4">Visi Global</h3>
          <p className="text-stone-600 font-medium">Menjadikan produk kreatif Papua sebagai ikon kebanggaan Indonesia yang diakui secara internasional.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-stone-50 p-8 rounded-[32px] text-center border border-stone-200"
        >
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={32} />
          </div>
          <h3 className="text-2xl font-black italic mb-4">Komunitas</h3>
          <p className="text-stone-600 font-medium">Membangun ekosistem yang mendukung kolaborasi antara pengrajin, desainer, dan konsumen.</p>
        </motion.div>
      </section>

      <section className="bg-black text-white rounded-[40px] p-12 md:p-24 text-center">
        <h2 className="text-4xl md:text-6xl font-black italic mb-8">BERGABUNG BERSAMA KAMI</h2>
        <p className="text-xl text-stone-400 max-w-2xl mx-auto mb-12">
          Dukung UMKM Papua dan jadilah bagian dari pergerakan ekonomi kreatif yang membawa dampak positif bagi masyarakat lokal.
        </p>
        <button className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform">
          Mulai Belanja
        </button>
      </section>
    </div>
  );
}
