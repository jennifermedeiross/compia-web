import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  ArrowLeft,
  Download,
  Package,
  Truck,
} from "lucide-react";
import { StoreLayout } from "@/components/StoreLayout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/api/mock-api";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";
import { Product, Review } from "@/types";

const ProductDetail = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([api.products.getById(id), api.reviews.getByProductId(id)])
      .then(([p, r]) => {
        setProduct(p ?? null);
        setReviews(r);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const related = products
    .filter((p) => p.id !== id && p.category === product?.category)
    .slice(0, 4);

  if (loading) {
    return (
      <StoreLayout>
        <div className="container py-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-[3/4] skeleton-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-6 w-40 skeleton-pulse" />
              <div className="h-10 w-full skeleton-pulse" />
              <div className="h-4 w-full skeleton-pulse" />
              <div className="h-4 w-3/4 skeleton-pulse" />
            </div>
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="container py-20 text-center space-y-4">
          <p className="text-xl font-semibold">Produto não encontrado</p>
          <Link to="/catalogo">
            <Button variant="outline">Voltar ao catálogo</Button>
          </Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="container py-8">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-muted">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover"
            />
            {product.productType === "EBOOK" && (
              <Badge
                className="absolute top-4 left-4 gap-1"
                variant="secondary">
                <Download className="h-3 w-3" /> eBook (PDF)
              </Badge>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {product.category}
              </p>
              <h1 className="text-3xl font-display font-bold">
                {product.title}
              </h1>
              <p className="text-muted-foreground mt-1">por {product.author}</p>
            </div>

            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating!) ? "fill-warning text-warning" : "text-muted"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} avaliações)
                </span>
              </div>
            )}

            <p className="text-3xl font-bold">{formatPrice(product.price)}</p>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-col gap-2 text-sm">
              {product.isbn && (
                <span>
                  <strong>ISBN:</strong> {product.isbn}
                </span>
              )}
              {product.pages && (
                <span>
                  <strong>Páginas:</strong> {product.pages}
                </span>
              )}
              {product.publishedYear && (
                <span>
                  <strong>Ano:</strong> {product.publishedYear}
                </span>
              )}
              <span>
                <strong>Tipo:</strong>{" "}
                {product.productType === "EBOOK"
                  ? "eBook (PDF)"
                  : "Livro Físico"}
              </span>
              <span>
                <strong>Estoque:</strong>{" "}
                {product.productType === "EBOOK" ? (
                  <span className="badge-success">Disponível</span>
                ) : product.stock > 0 ? (
                  <span className="badge-success">
                    {product.stock} em estoque
                  </span>
                ) : (
                  <span className="badge-warning">Esgotado</span>
                )}
              </span>
            </div>

            {product.bundleItems && (
              <div className="p-4 rounded-lg bg-secondary/50 border">
                <p className="font-semibold text-sm mb-2">
                  📦 Este bundle inclui:
                </p>
                {product.bundleItems.map((bid) => {
                  const bundleProduct = products.find((p) => p.id === bid);
                  return bundleProduct ? (
                    <Link
                      key={bid}
                      to={`/produto/${bid}`}
                      className="block text-sm text-primary hover:underline">
                      • {bundleProduct.title}
                    </Link>
                  ) : null;
                })}
              </div>
            )}

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={() => {
                addItem(product);
                toast({
                  title: "Adicionado!",
                  description: `${product.title} no carrinho.`,
                });
              }}
              disabled={
                product.productType === "PHYSICAL" && product.stock === 0
              }>
              <ShoppingCart className="h-5 w-5" />
              Adicionar ao Carrinho
            </Button>

            {/* Shipping info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" />
                {product.productType === "EBOOK"
                  ? "Download imediato"
                  : "Frete calculado no checkout"}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Package className="h-4 w-4 text-primary" />
                {product.productType === "EBOOK"
                  ? "Formato PDF"
                  : "Embalagem segura"}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-display font-bold mb-6">Avaliações</h2>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{r.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {r.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <Separator className="mb-16" />

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-display font-bold mb-6">
              Livros Relacionados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </StoreLayout>
  );
};

export default ProductDetail;
