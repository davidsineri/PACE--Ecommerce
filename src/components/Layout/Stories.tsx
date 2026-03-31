import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Stories() {
  const stories = [
    {
      id: 1,
      title: "Merajut Harapan dengan Noken",
      author: "Mama Yosepha",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
      excerpt: "Bagi Mama Yosepha, Noken bukan sekadar tas. Ini adalah warisan leluhur yang mengajarkan kesabaran dan ketekunan.",
      date: "12 Maret 2026"
    },
    {
      id: 2,
      title: "Aroma Kopi dari Lembah Baliem",
      author: "Piet Kogoya",
      image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop",
      excerpt: "Di ketinggian 1.600 mdpl, Piet merawat pohon-pohon kopi Arabika yang kini dinikmati oleh pecinta kopi di seluruh dunia.",
      date: "10 Maret 2026"
    },
    {
      id: 3,
      title: "Pahatan Asmat: Suara dari Hutan",
      author: "Amatus",
      image: "https://media.dekoruma.com/article/2021/05/23175316/ukiran-tradisional-khas-papua-berbentuk-pahatan-orang-min.jpg?resize=856,570&ssl=1",
      excerpt: "Setiap pahatan kayu menceritakan kisah roh leluhur dan hubungan manusia dengan alam semesta.",
      date: "5 Maret 2026"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl md:text-7xl font-black text-black italic mb-6">CERITA PACE</h1>
        <p className="text-xl text-stone-500 font-medium">Mengenal lebih dekat para seniman, pengrajin, dan petani di balik karya-karya luar biasa dari Papua.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((story, index) => (
          <motion.div 
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-6">
              <img 
                src={story.image} 
                alt={story.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <button className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm w-full hover:bg-stone-200 transition-colors">
                  Baca Selengkapnya
                </button>
              </div>
            </div>
            <div className="px-2">
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">{story.date} • {story.author}</p>
              <h3 className="text-2xl font-black italic mb-3 group-hover:text-emerald-600 transition-colors">{story.title}</h3>
              <p className="text-stone-600 font-medium leading-relaxed line-clamp-3">{story.excerpt}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 bg-stone-50 rounded-[40px] p-12 md:p-24 text-center border border-stone-200">
        <h2 className="text-3xl md:text-5xl font-black italic mb-6">PUNYA CERITA INSPIRATIF?</h2>
        <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-10">Bagikan perjalanan Anda bersama UMKM Papua dan inspirasi lebih banyak orang.</p>
        <Link to="/community" className="inline-block px-8 py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-stone-800 transition-colors">
          Bagikan Cerita Anda
        </Link>
      </div>
    </div>
  );
}
