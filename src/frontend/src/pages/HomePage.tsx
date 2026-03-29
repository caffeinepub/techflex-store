import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Cable,
  ChevronLeft,
  ChevronRight,
  CircuitBoard,
  Cpu,
  Radio,
  RotateCcw,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useAllProducts, useCategories } from "../hooks/useQueries";

const HERO_SLIDES = [
  {
    id: "build",
    image: "/assets/generated/hero-electronics-1.dim_800x380.jpg",
    title: "BUILD. CREATE. INNOVATE.",
    subtitle: "Premium electronics components for makers & engineers",
    bg: "from-[oklch(0.10_0.02_260)] to-[oklch(0.18_0.04_260)]",
  },
  {
    id: "arduino",
    image: "/assets/generated/hero-electronics-2.dim_800x380.jpg",
    title: "ARDUINO STARTER KITS",
    subtitle: "Everything you need to start your electronics journey",
    bg: "from-[oklch(0.10_0.03_240)] to-[oklch(0.18_0.05_240)]",
  },
  {
    id: "esp",
    image: "/assets/generated/hero-electronics-3.dim_800x380.jpg",
    title: "ESP32 & IoT MODULES",
    subtitle: "Connect your projects to the internet with ease",
    bg: "from-[oklch(0.10_0.02_270)] to-[oklch(0.18_0.04_270)]",
  },
];

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "DC Motors": <RotateCcw className="w-8 h-8" />,
  Wires: <Cable className="w-8 h-8" />,
  "ESP Modules": <Radio className="w-8 h-8" />,
  Arduino: <Cpu className="w-8 h-8" />,
  "Electronic Components": <CircuitBoard className="w-8 h-8" />,
  "Transmitters & Receivers": <Zap className="w-8 h-8" />,
};

const REVIEWS = [
  {
    name: "Rahul Sharma",
    text: "Amazing quality components! My Arduino project came to life thanks to techflexyuvi.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    text: "Fast delivery and genuine products. Best electronics store online!",
    rating: 5,
  },
  {
    name: "Arjun Kumar",
    text: "Great pricing and huge selection. My go-to store for all electronics.",
    rating: 4,
  },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: products, isLoading: prodLoading } = useAllProducts();

  useEffect(() => {
    const timer = setInterval(
      () => setSlide((s) => (s + 1) % HERO_SLIDES.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  const trendingProducts = products?.slice(0, 8) ?? [];

  return (
    <div className="pb-20 sm:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: "380px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={HERO_SLIDES[slide].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-r ${HERO_SLIDES[slide].bg} flex items-center`}
          >
            <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between gap-8">
              <div className="flex-1">
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-2"
                >
                  techflexyuvi
                </motion.p>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight"
                >
                  {HERO_SLIDES[slide].title}
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/70 mb-6 text-sm sm:text-base"
                >
                  {HERO_SLIDES[slide].subtitle}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-3"
                >
                  <Button
                    asChild
                    className="btn-primary-glow shadow-[0_0_14px_oklch(0.55_0.22_255/0.4)]"
                    data-ocid="hero.primary_button"
                  >
                    <Link to="/shop">SHOP NOW</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-primary/50 text-white hover:bg-primary/10 bg-transparent hover:border-primary"
                    data-ocid="hero.secondary_button"
                  >
                    <Link to="/category/$id" params={{ id: "arduino" }}>
                      EXPLORE KITS
                    </Link>
                  </Button>
                </motion.div>
              </div>
              <div className="hidden md:block flex-1 max-w-md">
                <img
                  src={HERO_SLIDES[slide].image}
                  alt="hero"
                  className="w-full h-72 object-cover rounded-xl opacity-90 shadow-[0_0_40px_oklch(0.55_0.22_255/0.2)]"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <button
          type="button"
          onClick={() =>
            setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
          }
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 hover:bg-primary/40 rounded-full flex items-center justify-center text-white transition-all"
          data-ocid="hero.pagination_prev"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 hover:bg-primary/40 rounded-full flex items-center justify-center text-white transition-all"
          data-ocid="hero.pagination_next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === slide
                  ? "bg-primary w-5 shadow-[0_0_8px_oklch(0.55_0.22_255/0.8)]"
                  : "bg-white/30 w-2"
              }`}
              data-ocid="hero.toggle"
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-2 text-foreground">
          Top Categories
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Browse our full range of electronics
        </p>
        {catLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SKELETON_IDS.slice(0, 6).map((id) => (
              <Skeleton key={id} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {(categories ?? []).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to="/category/$id"
                  params={{ id: cat.id }}
                  data-ocid={`categories.item.${i + 1}`}
                  className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl border border-border card-hover-glow group"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center text-primary transition-all">
                    {CATEGORY_ICONS[cat.name] ?? (
                      <CircuitBoard className="w-8 h-8" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-center text-foreground">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Trending Products */}
      <section className="bg-muted/30 py-12 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Trending Products
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Most popular picks this week
              </p>
            </div>
            <Link
              to="/shop"
              className="text-primary text-sm font-medium hover:underline hover:text-accent transition-colors"
              data-ocid="trending.link"
            >
              View All →
            </Link>
          </div>
          {prodLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {SKELETON_IDS.map((id) => (
                <Skeleton key={id} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {trendingProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i + 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-[oklch(0.13_0.02_260)] py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            What Our Customers Say
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Trusted by thousands of makers across India
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-5 card-hover-glow"
              >
                <div className="flex mb-2">
                  {Array.from({ length: r.rating }, (_, s) => (
                    <span key={`${r.name}-star-${s}`} className="text-accent">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-foreground/80 text-sm mb-3 italic">
                  "{r.text}"
                </p>
                <p className="text-foreground font-semibold text-sm">
                  {r.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
