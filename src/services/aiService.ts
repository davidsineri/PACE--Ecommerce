import { GoogleGenAI } from "@google/genai";

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

export async function generateProductStory(product: { name: string; description: string; category: string }): Promise<{ story_id: string; story_en: string; culture: string }> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview",
    contents: {
      parts: [
        {
          text: `Buatkan cerita storytelling untuk produk berikut:

Nama Produk: ${product.name}
Deskripsi: ${product.description}
Kategori: ${product.category}

Fokus pada:
- Budaya Papua dan nilai tradisional
- Menarik untuk pembeli lokal dan internasional
- Bahasa Indonesia yang menggugah perasaan
- Deskripsi yang membantu penjualan

FORMAT YANG DIHARAPKAN (JSON):
{
  "story_id": "Cerita dalam Bahasa Indonesia yang emosional dan menarik, sekitar 2-3 kalimat",
  "story_en": "Story in English that is emotional and engaging, about 2-3 sentences",
  "culture": "Satu kalimat tentang budaya/tradisi Papua yang relevan"
}

PENTING: Return hanya JSON tanpa markdown code block atau penjelasan tambahan.`,
        },
      ],
    },
  });
  
  try {
    const text = response.text?.trim() || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { 
      story_id: 'Produk ini dibuat dengan penuh cinta dan dedikasi oleh pengrajin Papua.', 
      story_en: 'This product was crafted with love and dedication by Papuan artisans.', 
      culture: 'Warisan budaya Papua' 
    };
  } catch {
    return { 
      story_id: 'Produk ini dibuat dengan penuh cinta dan dedikasi oleh pengrajin Papua.', 
      story_en: 'This product was crafted with love and dedication by Papuan artisans.', 
      culture: 'Warisan budaya Papua' 
    };
  }
}
