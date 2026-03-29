import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function MobileBottomNav() {
  const { cartCount, setCartOpen } = useCart();
  const { pathname } = useLocation();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg">
      <div className="flex items-center justify-around py-2">
        <Link
          to="/"
          data-ocid="nav.link"
          className={cn(
            "flex flex-col items-center gap-0.5 px-3 py-1",
            pathname === "/" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link
          to="/shop"
          data-ocid="nav.link"
          className={cn(
            "flex flex-col items-center gap-0.5 px-3 py-1",
            pathname === "/shop" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px]">Shop</span>
        </Link>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          data-ocid="nav.button"
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted-foreground relative"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 right-1 w-4 h-4 bg-accent text-white text-[9px] rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px]">Cart</span>
        </button>
        <Link
          to="/admin"
          data-ocid="nav.link"
          className={cn(
            "flex flex-col items-center gap-0.5 px-3 py-1",
            pathname === "/admin" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Account</span>
        </Link>
      </div>
    </nav>
  );
}
