export interface Attraction {
  id: string;
  name: string;
  location: string;
  description: string;
  story: string;
  image_url: string;
  category: string;
  productId?: string;
  price: number;
  rating: number;
  reviews: number;
  facilities: string[];
  isInstantConfirmation?: boolean;
  isFreeCancellation?: boolean;
}

export const attractions: Attraction[] = [
  {
    id: 'raja-ampat',
    name: 'Raja Ampat',
    location: 'Papua Barat Daya',
    description: 'Kepulauan yang dikenal sebagai jantung segitiga terumbu karang dunia.',
    story: 'Legenda setempat menceritakan tentang seorang wanita yang menemukan tujuh telur. Empat di antaranya menetas menjadi pangeran yang kemudian menjadi raja di empat pulau utama: Waigeo, Misool, Salawati, dan Batanta. Itulah sebabnya tempat ini dinamakan Raja Ampat (Empat Raja). Keindahannya bukan hanya di permukaan, tapi juga di kedalaman lautnya yang menyimpan kekayaan hayati luar biasa.',
    image_url: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=1920&auto=format&fit=crop',
    category: 'Bahari',
    productId: 'p6',
    price: 1500000,
    rating: 4.9,
    reviews: 1240,
    facilities: ['Snorkeling', 'Diving', 'Resort', 'Guide'],
    isInstantConfirmation: true,
    isFreeCancellation: true
  },
  {
    id: 'lembah-baliem',
    name: 'Lembah Baliem',
    location: 'Papua Pegunungan',
    description: 'Lembah hijau yang megah di ketinggian 1.600 meter di atas permukaan laut.',
    story: 'Lembah Baliem ditemukan secara tidak sengaja oleh ekspedisi udara Richard Archbold pada tahun 1938. Lembah ini merupakan rumah bagi suku Dani, Lani, dan Yali yang masih memegang teguh tradisi leluhur. Setiap tahun, Festival Budaya Lembah Baliem diadakan sebagai simbol perdamaian antar suku, di mana mereka mempertunjukkan simulasi perang yang spektakuler dengan pakaian adat lengkap.',
    image_url: 'https://images.unsplash.com/photo-1544441893-675973e31d85?q=80&w=1920&auto=format&fit=crop',
    category: 'Budaya & Alam',
    productId: 'p7',
    price: 850000,
    rating: 4.8,
    reviews: 850,
    facilities: ['Cultural Tour', 'Trekking', 'Homestay', 'Local Guide'],
    isInstantConfirmation: true
  },
  {
    id: 'danau-sentani',
    name: 'Danau Sentani',
    location: 'Jayapura, Papua',
    description: 'Danau luas dengan 22 pulau kecil yang tersebar di dalamnya.',
    story: 'Danau Sentani bukan sekadar perairan, ia adalah sumber kehidupan bagi masyarakat sekitarnya. Legenda mengatakan bahwa nenek moyang suku Sentani datang dari arah timur menunggangi naga raksasa. Naga tersebut kelelahan dan jatuh, membentuk lekukan dan pulau-pulau di danau ini. Setiap pulau memiliki keunikan kerajinan tangan, seperti lukisan kulit kayu yang terkenal.',
    image_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1920&auto=format&fit=crop',
    category: 'Danau',
    productId: 'p8',
    price: 250000,
    rating: 4.7,
    reviews: 520,
    facilities: ['Boat Tour', 'Art Workshop', 'Restaurant', 'Photography'],
    isInstantConfirmation: true,
    isFreeCancellation: true
  },
  {
    id: 'taman-nasional-lorentz',
    name: 'Taman Nasional Lorentz',
    location: 'Papua Tengah',
    description: 'Situs Warisan Dunia UNESCO dengan ekosistem terlengkap di Asia Pasifik.',
    story: 'Lorentz adalah satu-satunya tempat di dunia yang memiliki padang salju di daerah tropis, yaitu di Puncak Jaya (Cartensz Pyramid). Taman ini mencakup wilayah dari puncak gunung yang tertutup salju hingga pesisir pantai tropis. Nama Lorentz diambil dari seorang penjelajah Belanda, Hendrikus Albertus Lorentz, yang memimpin ekspedisi ke wilayah ini pada awal abad ke-20.',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop',
    category: 'Pegunungan',
    productId: 'p9',
    price: 2500000,
    rating: 4.9,
    reviews: 310,
    facilities: ['Expedition', 'Camping', 'Photography', 'Expert Guide'],
    isInstantConfirmation: false
  },
  {
    id: 'pantai-base-g',
    name: 'Pantai Base G',
    location: 'Jayapura, Papua',
    description: 'Pantai bersejarah dengan pasir putih dan air laut yang jernih.',
    story: 'Nama "Base G" berasal dari sejarah Perang Dunia II. Pantai ini dulunya merupakan pangkalan militer (Base) ke-7 (G adalah huruf ke-7) bagi pasukan Sekutu di bawah pimpinan Jenderal Douglas MacArthur pada tahun 1944. Kini, bekas pangkalan militer tersebut telah berubah menjadi destinasi wisata favorit warga Jayapura untuk menikmati matahari terbit.',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop',
    category: 'Pantai',
    productId: 'p10',
    price: 50000,
    rating: 4.6,
    reviews: 2100,
    facilities: ['Swimming', 'Gazebo', 'Parking', 'Snacks'],
    isInstantConfirmation: true,
    isFreeCancellation: true
  }
];
