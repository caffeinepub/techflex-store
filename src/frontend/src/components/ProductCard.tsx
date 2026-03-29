import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../backend.d";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 1 }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = Math.round(
    (1 - Number(product.discountedPrice) / Number(product.price)) * 100,
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div
      data-ocid={`products.item.${index}`}
      className="group bg-card border border-border rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200"
    >
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block relative overflow-hidden aspect-square bg-muted"
      >
        <img
          src={
            product.imageUrl ||
            `https://placehold.co/300x300?text=${encodeURIComponent(product.name.slice(0, 10))}`
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="secondary">Out of Stock</Badge>
          </div>
        )}
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wide">
          {product.category}
        </p>
        <Link to="/product/$id" params={{ id: product.id }}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition-colors mb-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="font-bold text-foreground">
            ₹{Number(product.discountedPrice).toLocaleString("en-IN")}
          </span>
          {discount > 0 && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
          )}
        </div>
        <Button
          size="sm"
          className="mt-2 w-full text-xs"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          data-ocid={`products.primary_button.${index}`}
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
}
