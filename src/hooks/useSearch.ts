import { useState, useMemo, useCallback } from 'react';
import type { Bike } from '../types';

const MIN_PRICE = 3499;
const MAX_PRICE = 8499;

export function useSearch(bikes: ReadonlyArray<Bike>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'motocross' | 'enduro' | 'youth'>('all');
  const [minPrice, setMinPrice] = useState(MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

  const filteredBikes = useMemo(() => {
    return bikes.filter((bike) => {
      const matchesSearch = bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || bike.category === categoryFilter;
      const matchesPrice = bike.price >= minPrice && bike.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [bikes, searchTerm, categoryFilter, minPrice, maxPrice]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleCategoryFilter = useCallback((category: 'all' | 'motocross' | 'enduro' | 'youth') => {
    setCategoryFilter(category);
  }, []);

  const handlePriceFilter = useCallback((newMinPrice: number, newMaxPrice: number) => {
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);
  }, []);

  return {
    searchTerm,
    categoryFilter,
    minPrice,
    maxPrice,
    filteredBikes,
    handleSearch,
    handleCategoryFilter,
    handlePriceFilter,
  };
}
