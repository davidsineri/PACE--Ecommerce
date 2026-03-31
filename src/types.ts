export interface Product {
  id: string;
  shop_id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
  created_at: string;
  story?: string;
  rating?: number;
  reviews_count?: number;
}

export interface Profile {
  id: string;
  full_name: string;
  address?: string;
  phone?: string;
  updated_at: string;
}
