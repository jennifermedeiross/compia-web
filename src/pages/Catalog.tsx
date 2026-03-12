import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { StoreLayout } from "@/components/StoreLayout";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/api/mock-api";
import { Product } from "@/types";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "Todos",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    api.categories.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);

    let categoryParam = undefined;

    if (selectedCategory && selectedCategory !== "Todos") {
      categoryParam = selectedCategory
        .toUpperCase()
        .replace(/\s+/g, "_")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }

    api.products
      .list({
        category: categoryParam,
        search: searchQuery,
        sort: sortBy,
      })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, sortBy]);

  useEffect(() => {
    const cat = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    setSelectedCategory(cat || "Todos");
    setSearchQuery(search || "");
    setSortBy(sort || "newest");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory !== "Todos") params.set("category", selectedCategory);
    if (sortBy !== "newest") params.set("sort", sortBy);
    setSearchParams(params);
  };

  return (
    <StoreLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-display font-bold mb-6">
          Catálogo de Livros
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </form>
          <div className="flex gap-3">
            <Select
              value={selectedCategory}
              onValueChange={(v) => {
                setSelectedCategory(v);
              }}>
              <SelectTrigger className="w-48">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais recentes</SelectItem>
                <SelectItem value="price-asc">Menor preço</SelectItem>
                <SelectItem value="price-desc">Maior preço</SelectItem>
                <SelectItem value="rating">Melhor avaliação</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="text-xl font-semibold">Nenhum livro encontrado</p>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou realizar uma nova busca.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Todos");
              }}>
              Limpar filtros
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {products.length} livro(s) encontrado(s)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </StoreLayout>
  );
};

export default Catalog;
