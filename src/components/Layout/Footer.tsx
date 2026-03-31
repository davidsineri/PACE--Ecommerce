import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 group shrink-0 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                <span className="text-black font-black text-xl italic">P</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white italic">PACE</span>
            </Link>
            <p className="text-stone-400 font-medium max-w-sm leading-relaxed">
              Papua Creative Economy. Membawa keajaiban seni dan budaya Papua ke panggung dunia melalui ekonomi kreatif digital.
            </p>
          </div>
          
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6">Jelajahi</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-stone-400 hover:text-white transition-colors font-medium">Katalog Produk</Link></li>
              <li><Link to="/about" className="text-stone-400 hover:text-white transition-colors font-medium">Tentang Kami</Link></li>
              <li><Link to="/stories" className="text-stone-400 hover:text-white transition-colors font-medium">Cerita Pengrajin</Link></li>
              <li><Link to="/community" className="text-stone-400 hover:text-white transition-colors font-medium">Komunitas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6">Bantuan</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-stone-400 hover:text-white transition-colors font-medium">Cara Pemesanan</a></li>
              <li><a href="#" className="text-stone-400 hover:text-white transition-colors font-medium">Pengiriman</a></li>
              <li><a href="#" className="text-stone-400 hover:text-white transition-colors font-medium">Hubungi Kami</a></li>
              <li><a href="#" className="text-stone-400 hover:text-white transition-colors font-medium">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} PACE - Papua Creative Economy. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-stone-500 hover:text-white transition-colors text-sm font-medium">Syarat & Ketentuan</a>
            <a href="#" className="text-stone-500 hover:text-white transition-colors text-sm font-medium">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
