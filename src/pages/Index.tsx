import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Cpu, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreLayout } from "@/components/StoreLayout";
import { ProductCard } from "@/components/ProductCard";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { api } from "@/api/mock-api";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    api.products.list().then(setProducts);
  }, []);
  const featured = products.slice(0, 4);
  const bestSellers = products
    .filter((p) => (p.rating ?? 0) >= 4.7)
    .slice(0, 4);

  const categories = [
    {
      name: "Deep Learning",
      icon: Brain,
      count: products.filter((p) => p.category === "DEEP_LEARNING").length,
    },
    {
      name: "Machine Learning",
      icon: Cpu,
      count: products.filter((p) => p.category === "MACHINE_LEARNING").length,
    },
    {
      name: "NLP",
      icon: Sparkles,
      count: products.filter((p) => p.category === "NLP").length,
    },
    {
      name: "Inteligência Artificial",
      icon: BookOpen,
      count: products.filter((p) => p.category === "INTELIGENCIA_ARTIFICIAL")
        .length,
    },
  ];

  return (
    <StoreLayout>
      {/* Hero */}
      <section className="hero-gradient py-20 md:py-28">
        <div className="container text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground leading-tight">
            O futuro da inteligência
            <br />
            começa com conhecimento
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Livros especializados em Inteligência Artificial para quem quer
            construir o amanhã. Físicos e digitais, dos fundamentos às
            aplicações mais avançadas.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link to="/catalogo">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 font-semibold">
                Explorar catálogo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/catalogo?category=Bundles">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-blue-600 hover:bg-primary-foreground/10 font-semibold">
                Ver Bundles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
            Categorias
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/catalogo?category=${encodeURIComponent(cat.name)}`}
                className="card-elevated p-6 rounded-lg bg-card border text-center space-y-2 hover:border-primary/50 transition-colors">
                <cat.icon className="h-8 w-8 mx-auto text-primary" />
                <h3 className="font-semibold text-sm">{cat.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {cat.count} livros
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              Destaques
            </h2>
            <Link
              to="/catalogo"
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              Mais Vendidos
            </h2>
            <Link
              to="/catalogo?sort=rating"
              className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              Ver mais <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-secondary/30">
        <div className="container max-w-3xl text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold">
            Sobre a COMPIA Editora
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A COMPIA Editora é uma editora especializada em publicações sobre
            Inteligência Artificial. Nossa missão é tornar o conhecimento de IA
            acessível a estudantes, pesquisadores e profissionais brasileiros,
            oferecendo livros de alta qualidade em português, tanto em formato
            físico quanto digital.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Contamos com um catálogo que abrange desde fundamentos de machine
            learning até tópicos avançados como redes generativas e aprendizado
            por reforço, sempre com foco na aplicação prática.
          </p>
        </div>
      </section>
    </StoreLayout>
  );
};

export default Index;
