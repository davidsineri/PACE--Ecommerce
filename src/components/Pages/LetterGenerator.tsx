import { useState } from 'react';
import { FileText, Send } from 'lucide-react';

export default function LetterGenerator() {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-black mb-8">Rekomendasi Surat Pejabat</h1>
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">Tujuan Surat (Pejabat Daerah)</label>
          <input type="text" value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full p-4 rounded-2xl bg-stone-50 border-none" placeholder="Contoh: Kepala Dinas Pariwisata..." />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">Perihal</label>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-4 rounded-2xl bg-stone-50 border-none" placeholder="Perihal surat..." />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">Isi Surat</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full p-4 rounded-2xl bg-stone-50 border-none h-64" placeholder="Tulis isi surat di sini..."></textarea>
        </div>
        <button className="w-full py-4 bg-black text-white rounded-full font-bold hover:bg-stone-800 flex items-center justify-center gap-2">
          <Send size={20} /> Kirim/Cetak Surat
        </button>
      </div>
    </div>
  );
}
