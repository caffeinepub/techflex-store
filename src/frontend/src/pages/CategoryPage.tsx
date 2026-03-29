import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useProductsByCategory } from "../hooks/useQueries";

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export default function CategoryPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: products, isLoading } = useProductsByCategory(id ?? "");

  const categoryName =
    products?.[0]?.category ??
    id?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ??
    "Category";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 sm:pb-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">{categoryName}</span>
      </nav>
      <h1 className="text-2xl font-bold mb-6">{categoryName}</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {SKELETON_IDS.map((sid) => (
            <Skeleton key={sid} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : (products ?? []).length === 0 ? (
        <div
          className="text-center py-24 text-muted-foreground"
          data-ocid="category.empty_state"
        >
          No products in this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {(products ?? []).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
