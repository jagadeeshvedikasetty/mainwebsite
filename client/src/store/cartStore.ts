import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // product id
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, variant?: string) => void;
  updateQuantity: (id: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id && item.variant === newItem.variant
          );

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }

          // Add new item
          return { items: [...state.items, newItem] };
        });
      },

      removeFromCart: (id, variant) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.variant === variant)
          ),
        }));
      },

      updateQuantity: (id, quantity, variant) => {
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === id && item.variant === variant) {
              return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
          });
          return { items: updatedItems };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'janani-cart-storage',
    }
  )
);
