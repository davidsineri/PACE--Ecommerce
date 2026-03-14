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
