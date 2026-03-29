import type { ReactNode } from "react";
import { useEffect } from "react";
import { useActor } from "../hooks/useActor";
import CartDrawer from "./CartDrawer";
import Footer from "./Footer";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";

export default function Layout({ children }: { children: ReactNode }) {
  const { actor } = useActor();

  useEffect(() => {
    const seeded = localStorage.getItem("techflex_seeded");
    if (!seeded && actor) {
      actor
        .seedData()
        .then(() => {
          localStorage.setItem("techflex_seeded", "1");
        })
        .catch(() => {});
    }
  }, [actor]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}
