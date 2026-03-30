import { GoogleGenAI } from "@google/genai";
import { attractions } from "../data/attractions";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateProductDescription(base64Image: string): Promise<string> {
  if (!base64Image) return '';
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: 'image/jpeg',
          },
        },
        {
          text: 'Buatkan deskripsi produk yang profesional, menarik, dan informatif untuk produk ini. Gunakan bahasa Indonesia yang santun dan menggugah minat pembeli. Fokus pada keunikan produk khas Papua.',
        },
      ],
    },
  });
  
  return response.text || 'Deskripsi tidak dapat dibuat.';
}

export async function getPackagingAdvice(question: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Anda adalah asisten ahli pengemasan dan pengiriman barang untuk penjual online. Berikan saran yang aman, efisien, dan ramah lingkungan untuk pertanyaan berikut: ${question}`,
  });
  
  return response.text || 'Maaf, saya tidak dapat memberikan saran saat ini.';
}

export async function chatWithAgent(message: string, history: {role: string, text: string}[] = [], productsContext: any[] = []): Promise<string> {
  const systemInstruction = `Anda adalah "PACE Multi-Agent AI", asisten virtual cerdas untuk aplikasi e-commerce dan pariwisata Papua bernama PACE.
Anda memiliki 3 persona/agen yang bekerja sama:
1. Agen Pariwisata: Ahli merekomendasikan destinasi wisata Papua, menyusun itinerary, dan memberikan tips perjalanan.
2. Agen Belanja: Ahli merekomendasikan produk lokal UMKM Papua (kopi, noken, ukiran, dll).
3. Agen Support: Membantu navigasi aplikasi dan pertanyaan umum.

Konteks Destinasi Wisata yang tersedia:
${attractions.map(a => `- ${a.name} (${a.location}): ${a.category}`).join('\n')}

Konteks Produk Lokal yang tersedia:
${productsContext.map(p => `- ${p.name} (Rp ${p.price}): ${p.category}`).join('\n')}

Tugas Anda:
- Jawab pertanyaan pengguna dengan ramah, antusias, dan menggunakan bahasa Indonesia yang baik (boleh diselingi sapaan khas Papua seperti "Pace", "Mace", "Kaka").
- Jika pengguna mencari produk/wisata, rekomendasikan dari daftar konteks di atas.
- Jika pengguna meminta itinerary, buatkan rencana perjalanan yang menarik dan sertakan rekomendasi produk lokal untuk oleh-oleh.
- Format jawaban menggunakan Markdown agar rapi (gunakan bullet points, bold, dll).`;

  const contents: any[] = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.text }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text || 'Maaf, saya sedang mengalami gangguan jaringan. Bisa ulangi pertanyaannya?';
}

export async function generateTravelItinerary(days: number, interests: string, budget: string): Promise<string> {
  const systemInstruction = `Anda adalah "PACE Travel Planner AI", ahli perencana perjalanan khusus untuk destinasi Papua.
Buatkan itinerary (rencana perjalanan) yang detail, menarik, dan realistis berdasarkan input pengguna.
Sertakan rekomendasi destinasi wisata dari daftar berikut jika relevan:
${attractions.map(a => `- ${a.name} (${a.location})`).join('\n')}

Sertakan juga rekomendasi oleh-oleh produk lokal Papua di hari terakhir.
Gunakan format Markdown yang rapi dengan heading, bullet points, dan estimasi biaya (opsional).`;

  const prompt = `Tolong buatkan itinerary liburan ke Papua dengan detail berikut:
- Durasi: ${days} hari
- Minat/Gaya Liburan: ${interests}
- Budget: ${budget}

Buat rencana per hari (Hari 1, Hari 2, dst) yang mencakup aktivitas, destinasi, dan rekomendasi kuliner/oleh-oleh.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  return response.text || 'Maaf, saya gagal membuat itinerary saat ini. Silakan coba lagi.';
}

export async function smartSearchProducts(query: string, products: any[]): Promise<any[]> {
  if (!query || products.length === 0) return products;

  const systemInstruction = `Anda adalah mesin pencari cerdas untuk e-commerce produk Papua bernama PACE.
Tugas Anda adalah menerima query pencarian dari pengguna (yang mungkin berupa kalimat, konteks, atau deskripsi tidak langsung) dan mengembalikan daftar ID produk yang paling relevan dari katalog yang diberikan.
Katalog Produk:
${products.map(p => `ID: ${p.id} | Nama: ${p.name} | Kategori: ${p.category} | Deskripsi: ${p.description}`).join('\n')}

Output HARUS berupa array JSON berisi ID produk yang relevan, diurutkan dari yang paling relevan. Contoh output: ["id1", "id2"]. Jangan tambahkan teks lain selain array JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Query pencarian: "${query}"`,
      config: {
        systemInstruction,
        temperature: 0.1,
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || '[]';
    const matchedIds = JSON.parse(resultText);
    
    if (Array.isArray(matchedIds) && matchedIds.length > 0) {
      // Return products that match the IDs, maintaining the order returned by AI
      return matchedIds.map(id => products.find(p => p.id === id)).filter(Boolean);
    }
    return []; // No matches found by AI
  } catch (error) {
    console.error("Smart search failed:", error);
    // Fallback to basic text search if AI fails
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    );
  }
}
