import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[oklch(0.10_0.02_260)] text-[oklch(0.75_0.01_260)] mt-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_12px_oklch(0.55_0.22_255/0.4)]">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">techflexyuvi</span>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              Your one-stop shop for Arduino, ESP modules, DC motors, wires, and
              electronic components.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hover:text-primary transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-primary transition-colors"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="hover:text-primary transition-colors"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/category/$id"
                  params={{ id: "dc-motors" }}
                  className="hover:text-primary transition-colors"
                >
                  DC Motors
                </Link>
              </li>
              <li>
                <Link
                  to="/category/$id"
                  params={{ id: "arduino" }}
                  className="hover:text-primary transition-colors"
                >
                  Arduino
                </Link>
              </li>
              <li>
                <Link
                  to="/category/$id"
                  params={{ id: "esp-modules" }}
                  className="hover:text-primary transition-colors"
                >
                  ESP Modules
                </Link>
              </li>
              <li>
                <Link
                  to="/category/$id"
                  params={{ id: "wires" }}
                  className="hover:text-primary transition-colors"
                >
                  Wires
                </Link>
              </li>
              <li>
                <Link
                  to="/category/$id"
                  params={{ id: "components" }}
                  className="hover:text-primary transition-colors"
                >
                  Components
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-2 text-sm mb-4">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent" />{" "}
                support@techflexyuvi.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-accent" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent" /> Bengaluru, India
              </li>
            </ul>
            <div className="flex gap-2">
              <Input
                placeholder="Your email"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm h-9 focus:ring-primary"
              />
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 shrink-0 shadow-[0_0_10px_oklch(0.55_0.22_255/0.3)] hover:shadow-[0_0_18px_oklch(0.55_0.22_255/0.5)]"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-60">
          <p>
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="underline hover:opacity-100"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex gap-4">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>UPI</span>
            <span>NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
