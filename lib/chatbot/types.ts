export interface Product {
  id: number;
  name: string;
  category: string;
  type: string;
  brand: string;
  price: number;
  stock: number;
  rating: number;
  reviews: number;
  available: boolean;
  onSale: boolean;
  discount: number;
  specs: string;
  warranty: string;
  color?: string;
  size?: string;
  quality?: string;
  occasion?: string;
  material?: string;
  style?: string;
  shoeType?: string;
  comfort?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
  products?: Product[];
}

export interface SearchParams {
  category: string | null;
  productType: string | null;
  attributes: string[];
  minPrice: number | null;
  maxPrice: number | null;
  intent: 'search' | 'deal' | 'recommend' | 'budget' | 'greeting' | 'help';
}

