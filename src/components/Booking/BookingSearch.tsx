import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Map } from 'lucide-react';
import { motion } from 'motion/react';

interface BookingSearchProps {
  activeTab: 'wisata' | 'penginapan';
  onTabChange: (tab: 'wisata' | 'penginapan') => void;
}

export default function BookingSearch({ activeTab, onTabChange }: BookingSearchProps) {
  return (
    <div className="w-full max-w-6xl mx-auto -mt-24 relative z-30 px-4">
      <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-100 dark:border-stone-800 p-2">
        {/* Tabs */}
        <div className="flex gap-2 mb-2 p-2">
          <button
            onClick={() => onTabChange('wisata')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              activeTab === 'wisata'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <Map size={18} />
            Wisata
          </button>
          <button
            onClick={() => onTabChange('penginapan')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
              activeTab === 'penginapan'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <MapPin size={18} />
            Penginapan
          </button>
        </div>

        {/* Search Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-end">
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">Destinasi</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
              <input
                type="text"
                placeholder="Mau ke mana?"
                className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold text-stone-800 dark:text-white"
              />
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">Tanggal</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
              <input
                type="text"
                placeholder="Pilih Tanggal"
                className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold text-stone-800 dark:text-white"
              />
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">
              {activeTab === 'wisata' ? 'Tiket' : 'Tamu & Kamar'}
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" size={20} />
              <input
                type="text"
                placeholder={activeTab === 'wisata' ? 'Jumlah Tiket' : '1 Tamu, 1 Kamar'}
                className="w-full pl-12 pr-4 py-4 bg-stone-50 dark:bg-stone-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 font-bold text-stone-800 dark:text-white"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 dark:shadow-none transition-all flex items-center justify-center gap-2">
              <Search size={20} />
              Cari
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
