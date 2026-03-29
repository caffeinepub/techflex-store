import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useProduct } from "../hooks/useQueries";

export default function ProductPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: product, isLoading } = useProduct(id ?? "");
  const { addToCart, setCartOpen } = useCart();
  const [qty, setQty] = useState(1);

  const discount = product
    ? Math.round(
        (1 - Number(product.discountedPrice) / Number(product.price)) * 100,
      )
    : 0;

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, qty);
    toast.success(`${product.name} added to cart!`);
    setCartOpen(true);
  };

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );

  if (!product)
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-8 text-center"
        data-ocid="product.error_state"
      >
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 sm:pb-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          to="/category/$id"
          params={{ id: product.category }}
          className="hover:text-primary"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
          <img
            src={
              product.imageUrl ||
              `https://placehold.co/500x500?text=${encodeURIComponent(product.name.slice(0, 10))}`
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
              -{discount}% OFF
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>
            <h1 className="text-2xl font-bold">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              ₹{Number(product.discountedPrice).toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span className="text-lg text-muted-foreground line-through">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {product.description}
          </p>

          <Badge
            variant={product.inStock ? "secondary" : "destructive"}
            className="w-fit"
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-muted"
                data-ocid="product.secondary_button"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-medium">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 hover:bg-muted"
                data-ocid="product.primary_button"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              data-ocid="product.submit_button"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
