// Bike type definition
export interface Bike {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  specs: string[];
  rating: number;
  category: 'motocross' | 'enduro' | 'youth';
  cc: number;
  stroke: '2-stroke' | '4-stroke';
}

// Cart item type
export interface CartItem {
  bike: Bike;
  quantity: number;
}

// Filter options
export interface FilterOptions {
  category?: 'motocross' | 'enduro' | 'youth' | 'all';
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}