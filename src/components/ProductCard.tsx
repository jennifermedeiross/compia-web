import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Download } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast({
      title: 'Adicionado ao carrinho',
      description: `${product.title} foi adicionado.`,
    });
  };

  return (
    <Link to={`/produto/${product.id}`} className="group block">
      <div className="card-elevated rounded-lg overflow-hidden bg-card border">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.productType === 'EBOOK' && (
            <Badge className="absolute top-2 left-2 gap-1" variant="secondary">
              <Download className="h-3 w-3" />
              eBook
            </Badge>
          )}
          {product.bundleItems && (
            <Badge className="absolute top-2 right-2 bg-primary">Bundle</Badge>
          )}
        </div>
        <div className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground">{product.author}</p>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-xs font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            <Button size="sm" onClick={handleAdd} className="gap-1">
              <ShoppingCart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Comprar</span>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
