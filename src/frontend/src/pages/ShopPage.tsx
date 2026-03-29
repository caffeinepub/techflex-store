import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useAllProducts, useCategories } from "../hooks/useQueries";

const SKELETON_IDS = [
  "sk1",
  "sk2",
  "sk3",
  "sk4",
  "sk5",
  "sk6",
  "sk7",
  "sk8",
  "sk9",
  "sk10",
  "sk11",
  "sk12",
];

export default function ShopPage() {
  const searchQuery =
    new URLSearchParams(window.location.search).get("search") ?? "";
  const { data: products, isLoading } = useAllProducts();
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">(
    "default",
  );

  const filtered = useMemo(() => {
    let list = products ?? [];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (sortBy === "price-asc")
      list = [...list].sort(
        (a, b) => Number(a.discountedPrice) - Number(b.discountedPrice),
      );
    if (sortBy === "price-desc")
      list = [...list].sort(
        (a, b) => Number(b.discountedPrice) - Number(a.discountedPrice),
      );
    return list;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 sm:pb-8">
      <h1 className="text-2xl font-bold mb-6">Shop All Products</h1>
      {searchQuery && (
        <p className="mb-4 text-muted-foreground">
          Showing results for: <strong>{searchQuery}</strong>
        </p>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4 font-semibold">
              <Filter className="w-4 h-4" /> Filters
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                data-ocid="shop.tab"
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                All Categories
              </button>
              {(categories ?? []).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  data-ocid="shop.tab"
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === cat.name
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="mt-4 border-t pt-4">
              <p className="text-xs font-semibold mb-2 text-muted-foreground">
                SORT BY
              </p>
              {(["default", "price-asc", "price-desc"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSortBy(s)}
                  data-ocid="shop.toggle"
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    sortBy === s
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {s === "default"
                    ? "Default"
                    : s === "price-asc"
                      ? "Price: Low to High"
                      : "Price: High to Low"}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {filtered.length} products
            </p>
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {SKELETON_IDS.map((id) => (
                <Skeleton key={id} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24 gap-4"
              data-ocid="shop.empty_state"
            >
              <p className="text-muted-foreground text-lg">No products found</p>
              <Button
                onClick={() => {
                  setSelectedCategory("all");
                }}
                data-ocid="shop.primary_button"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
