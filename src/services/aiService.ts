// aiService.ts
// Semua panggilan AI sudah dipindah ke backend (/api/ai/*).
// File ini hanya berisi fungsi helper yang memanggil endpoint tersebut.
// API key Gemini TIDAK pernah ada di frontend.

export async function generateTravelItinerary(days: number, interests: string, budget: string, originCity?: string): Promise<string> {
  const res = await fetch('/api/ai/itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ days, interests, budget, originCity }),
    signal: AbortSignal.timeout(60_000), // timeout 60 detik
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${res.status}`);
  }

  const data = await res.json();
  return data.itinerary;
}

export async function chatWithAgent(
  message: string,
  history: { role: string; text: string }[] = [],
  productsContext: any[] = []
): Promise<string> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, productsContext }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${res.status}`);
  }

  const data = await res.json();
  return data.reply;
}

export async function smartSearchProducts(query: string, products: any[]): Promise<any[]> {
  try {
    const res = await fetch('/api/ai/smart-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, products }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) return fallbackSearch(query, products);

    const data = await res.json();
    const ids: string[] = data.ids || [];
    if (ids.length === 0) return fallbackSearch(query, products);

    return ids
      .map((id: string) => products.find((p: any) => p.id === id))
      .filter(Boolean);
  } catch {
    return fallbackSearch(query, products);
  }
}

// Fallback pencarian teks biasa jika AI gagal
function fallbackSearch(query: string, products: any[]): any[] {
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name?.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q) ||
    p.category?.toLowerCase().includes(q)
  );
}

export async function generateProductDescription(imageUrl: string): Promise<string> {
  const res = await fetch('/api/ai/describe-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${res.status}`);
  }

  const data = await res.json();
  return data.description || '';
}

export async function getPackagingAdvice(question: string): Promise<string> {
  const res = await fetch('/api/ai/packaging-advice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error ${res.status}`);
  }

  const data = await res.json();
  return data.advice || '';
}
