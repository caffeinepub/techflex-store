import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { CartProduct, Product } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface CartContextType {
  cartItems: CartProduct[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!actor) return;
    try {
      const items = await actor.getCart();
      setCartItems(items);
    } catch (e) {
      console.error(e);
    }
  }, [actor]);

  useEffect(() => {
    if (actor && identity) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [actor, identity, refreshCart]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!actor || !identity) {
      // Local state for guests
      setCartItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + BigInt(quantity) }
              : i,
          );
        }
        return [...prev, { product, quantity: BigInt(quantity) }];
      });
      return;
    }
    await actor.addToCart(product.id, BigInt(quantity));
    await refreshCart();
  };

  const removeFromCart = async (productId: string) => {
    if (!actor || !identity) {
      setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    await actor.removeFromCart(productId);
    await refreshCart();
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!actor || !identity) {
      setCartItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: BigInt(quantity) } : i,
        ),
      );
      return;
    }
    await actor.updateCartQuantity(productId, BigInt(quantity));
    await refreshCart();
  };

  const clearCart = async () => {
    if (!actor || !identity) {
      setCartItems([]);
      return;
    }
    await actor.clearCart();
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, i) => sum + Number(i.quantity), 0);
  const cartTotal = cartItems.reduce(
    (sum, i) => sum + Number(i.product.discountedPrice) * Number(i.quantity),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setCartOpen,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
