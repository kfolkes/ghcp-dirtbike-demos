import { useState, useCallback, useMemo, useEffect } from 'react';
import type { Bike, CartItem } from '../types';
import { getCartFromStorage, saveCartToStorage, clearCartFromStorage } from '../utils/localStorage';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = getCartFromStorage();
    if (storedCart.length > 0) {
      setCartItems(storedCart);
    }
  }, []);

  const addToCart = useCallback((bike: Bike) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.bike.id === bike.id);
      const updated = existingItem
        ? prev.map((item) =>
            item.bike.id === bike.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { bike, quantity: 1 }];
      
      // Persist to localStorage
      saveCartToStorage(updated);
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((bikeId: number) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.bike.id === bikeId);
      const updated = existingItem && existingItem.quantity > 1
        ? prev.map((item) =>
            item.bike.id === bikeId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        : prev.filter((item) => item.bike.id !== bikeId);
      
      // Persist to localStorage
      saveCartToStorage(updated);
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    clearCartFromStorage();
  }, []);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.bike.price * item.quantity, 0),
    [cartItems]
  );

  const averageRating = useMemo(() => {
    if (cartItems.length === 0) return 0;
    const totalRating = cartItems.reduce(
      (sum, item) => sum + item.bike.rating * item.quantity,
      0
    );
    return totalRating / totalItems;
  }, [cartItems, totalItems]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
    averageRating,
  };
}
