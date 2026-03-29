import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-16 text-center"
        data-ocid="cart.empty_state"
      >
        <ShoppingBag className="w-20 h-20 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products to get started.
        </p>
        <Button asChild data-ocid="cart.primary_button">
          <Link to="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 sm:pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Shopping Cart ({cartItems.length})
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCart}
          data-ocid="cart.delete_button"
          className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, idx) => (
            <div
              key={item.product.id}
              data-ocid={`cart.item.${idx + 1}`}
              className="flex gap-4 bg-card border border-border rounded-xl p-4"
            >
              <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                <img
                  src={
                    item.product.imageUrl ||
                    `https://placehold.co/80x80?text=${encodeURIComponent(item.product.name[0])}`
                  }
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  {item.product.category}
                </p>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-primary font-bold">
                  ₹
                  {Number(item.product.discountedPrice).toLocaleString("en-IN")}
                </p>
                <div className="flex items-center gap-2 mt-2">
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
                    className="w-7 h-7 rounded border flex items-center justify-center hover:bg-muted"
                    data-ocid={`cart.secondary_button.${idx + 1}`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {String(item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.product.id, Number(item.quantity) + 1)
                    }
                    className="w-7 h-7 rounded border flex items-center justify-center hover:bg-muted"
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
                className="text-destructive hover:text-destructive/80 self-start"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-5 h-fit sticky top-24">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                  {item.product.name} × {String(item.quantity)}
                </span>
                <span>
                  ₹
                  {(
                    Number(item.product.discountedPrice) * Number(item.quantity)
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span className="text-primary">
              ₹{cartTotal.toLocaleString("en-IN")}
            </span>
          </div>
          <Button className="w-full mb-2" data-ocid="cart.submit_button">
            Proceed to Checkout
          </Button>
          <Button
            variant="outline"
            className="w-full"
            asChild
            data-ocid="cart.secondary_button"
          >
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
