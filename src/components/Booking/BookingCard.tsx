import React, { useState } from 'react';
import { Calendar, Users, Info, CheckCircle } from 'lucide-react';

interface BookingCardProps {
  price: number;
  title: string;
  type: 'wisata' | 'penginapan';
  isInstantConfirmation?: boolean;
  isFreeCancellation?: boolean;
  onBook: (details: any) => void;
}

export default function BookingCard({ 
  price, 
  title, 
  type, 
  isInstantConfirmation = true, 
  isFreeCancellation = true, 
  onBook 
}: BookingCardProps) {
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);

  return (
    <div className="sticky top-24 bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-800 p-6">
      <div className="mb-6">
        <p className="text-sm text-stone-400 font-bold uppercase tracking-widest mb-1">Harga mulai dari</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-blue-600">Rp {price.toLocaleString('id-ID')}</span>
          {type === 'penginapan' && <span className="text-stone-400 text-sm font-medium">/ malam</span>}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">Pilih Tanggal</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border-none rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-stone-800 dark:text-white text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">
            {type === 'wisata' ? 'Jumlah Tiket' : 'Tamu & Kamar'}
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full pl-12 pr-4 py-3 bg-stone-50 dark:bg-stone-800 border-none rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-stone-800 dark:text-white text-sm appearance-none"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} {type === 'wisata' ? 'Tiket' : 'Tamu'}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {isInstantConfirmation && (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <CheckCircle size={14} />
            <span>Konfirmasi Instan</span>
          </div>
        )}
        {isFreeCancellation && (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <CheckCircle size={14} />
            <span>Pembatalan Gratis</span>
          </div>
        )}
        {!isFreeCancellation && (
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
            <CheckCircle size={14} />
            <span>Bisa Reschedule</span>
          </div>
        )}
      </div>

      <button
        onClick={() => onBook({ date, guests })}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 dark:shadow-none transition-all mb-4"
      >
        Pesan Sekarang
      </button>

      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <Info size={16} className="text-blue-600 mt-0.5" />
        <p className="text-[10px] text-blue-800 dark:text-blue-200 font-medium leading-relaxed">
          Selesaikan pesanan Anda dalam 15 menit untuk mengamankan harga ini.
        </p>
      </div>
    </div>
  );
}
