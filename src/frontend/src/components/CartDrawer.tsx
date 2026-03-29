import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    cartItems,
    cartTotal,
    cartCount,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setCartOpen,
  } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col"
        data-ocid="cart.sheet"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Cart ({cartCount})
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4"
            data-ocid="cart.empty_state"
          >
            <ShoppingCart className="w-16 h-16 text-muted-foreground/30" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button onClick={() => setCartOpen(false)} asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {cartItems.map((item, idx) => (
                <div
                  key={item.product.id}
                  data-ocid={`cart.item.${idx + 1}`}
                  className="flex gap-3 items-center"
                >
                  <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                    <img
                      src={
                        item.product.imageUrl ||
                        `https://placehold.co/56x56?text=${encodeURIComponent(item.product.name[0])}`
                      }
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-primary font-semibold text-sm">
                      ₹
                      {Number(item.product.discountedPrice).toLocaleString(
                        "en-IN",
                      )}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() =>
                          Number(item.quantity) <= 1
                            ? removeFromCart(item.product.id)
                            : updateQuantity(
                                item.product.id,
                                Number(item.quantity) - 1,
                              )
                        }
                        className="w-6 h-6 rounded border flex items-center justify-center hover:bg-muted"
                        data-ocid={`cart.secondary_button.${idx + 1}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {String(item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            Number(item.quantity) + 1,
                          )
                        }
                        className="w-6 h-6 rounded border flex items-center justify-center hover:bg-muted"
                        data-ocid={`cart.primary_button.${idx + 1}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    data-ocid={`cart.delete_button.${idx + 1}`}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-3">
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <Button
                className="w-full"
                asChild
                data-ocid="cart.primary_button"
              >
                <Link to="/cart" onClick={() => setCartOpen(false)}>
                  View Cart & Checkout
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCartOpen(false)}
                data-ocid="cart.secondary_button"
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
