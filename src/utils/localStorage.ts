import type { CartItem } from '../types';

const CART_STORAGE_KEY = 'dirtbike-shop-cart';

/**
 * Safely retrieves cart items from localStorage.
 * Returns empty array if localStorage is unavailable or data is corrupted.
 */
export function getCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    
    const parsed = JSON.parse(stored);
    
    // Validate that parsed data is an array
    if (!Array.isArray(parsed)) {
      console.warn('Cart data in localStorage is invalid');
      return [];
    }
    
    return parsed;
  } catch (error) {
    // Handle quota exceeded, JSON parse errors, and localStorage unavailable
    if (error instanceof DOMException) {
      if (error.code === 22) {
        console.error('localStorage quota exceeded', error);
      } else {
        console.error('localStorage error:', error);
      }
    } else {
      console.error('Failed to retrieve cart from storage:', error);
    }
    return [];
  }
}

/**
 * Safely saves cart items to localStorage.
 * Returns true if successful, false if quota exceeded or localStorage unavailable.
 */
export function saveCartToStorage(items: CartItem[]): boolean {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    // Handle quota exceeded and other localStorage errors
    if (error instanceof DOMException) {
      if (error.code === 22) {
        console.error('localStorage quota exceeded when saving cart', error);
      } else {
        console.error('localStorage error when saving cart:', error);
      }
    } else {
      console.error('Failed to save cart to storage:', error);
    }
    return false;
  }
}

/**
 * Clears cart data from localStorage.
 */
export function clearCartFromStorage(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart from storage:', error);
  }
}
