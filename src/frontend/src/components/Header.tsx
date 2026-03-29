import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, User, X, Zap } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navItems = [
  { label: "HOME", href: "/" as const },
  { label: "SHOP", href: "/shop" as const },
  {
    label: "DC MOTORS",
    href: "/category/$id" as const,
    params: { id: "dc-motors" },
  },
  {
    label: "ARDUINO",
    href: "/category/$id" as const,
    params: { id: "arduino" },
  },
  {
    label: "ESP MODULES",
    href: "/category/$id" as const,
    params: { id: "esp-modules" },
  },
  { label: "WIRES", href: "/category/$id" as const, params: { id: "wires" } },
  {
    label: "COMPONENTS",
    href: "/category/$id" as const,
    params: { id: "components" },
  },
  { label: "SALE", href: "/shop" as const, highlight: true },
];

export default function Header() {
  const { cartCount, setCartOpen } = useCart();
  const { login, clear, identity, loginStatus } = useInternetIdentity();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/shop", search: { search: searchQuery.trim() } });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Animated utility bar */}
      <div className="utility-bar-animated text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-end gap-4">
          <Link
            to="/shop"
            className="hover:underline opacity-90 hover:opacity-100"
          >
            Contact
          </Link>
          <Link
            to="/shop"
            className="hover:underline opacity-90 hover:opacity-100"
          >
            Support
          </Link>
          <Link
            to="/shop"
            className="hover:underline opacity-90 hover:opacity-100"
          >
            About Us
          </Link>
          <Link
            to="/cart"
            className="hover:underline opacity-90 hover:opacity-100"
          >
            Cart
          </Link>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-card header-glow-border border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 group"
            data-ocid="header.link"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_12px_oklch(0.55_0.22_255/0.5)] group-hover:shadow-[0_0_20px_oklch(0.55_0.22_255/0.7)] transition-all">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
              techflexyuvi
            </span>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl mx-auto hidden sm:flex"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-ocid="header.search_input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-10 rounded-full border-border bg-muted text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (identity ? clear() : login())}
              disabled={loginStatus === "logging-in"}
              data-ocid="header.toggle"
              title={identity ? "Logout" : "Login"}
              className="text-foreground hover:text-primary hover:bg-primary/10"
            >
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => setCartOpen(true)}
              data-ocid="header.button"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground rounded-full">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="header.toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10 rounded-full bg-muted text-foreground"
              data-ocid="header.search_input"
            />
          </form>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="bg-background border-b border-border hidden sm:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  params={"params" in item ? item.params : undefined}
                  data-ocid="nav.link"
                  className={cn(
                    "block px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors relative group",
                    item.highlight
                      ? "text-accent hover:text-accent"
                      : "text-muted-foreground hover:text-primary",
                  )}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-card border-b border-border shadow-lg">
          <ul className="px-4 py-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  params={"params" in item ? item.params : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block py-2.5 text-sm font-semibold border-b border-border last:border-0",
                    item.highlight ? "text-accent" : "text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
