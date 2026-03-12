import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { StoreLayout } from '@/components/StoreLayout';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/formatters';
import { Button } from '@/components/ui/button';

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const total = subtotal();

  if (items.length === 0) {
    return (
      <StoreLayout>
        <div className="container py-20 text-center space-y-4">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40" />
          <h1 className="text-2xl font-display font-bold">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground">Adicione livros ao carrinho para continuar.</p>
          <Link to="/catalogo"><Button className="gap-2">Explorar catálogo <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Carrinho de Compras</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 p-4 rounded-lg border bg-card">
                <img src={product.imageUrl} alt={product.title} className="w-20 h-28 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <Link to={`/produto/${product.id}`} className="font-semibold text-sm hover:text-primary line-clamp-2">
                    {product.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">{product.author}</p>
                  <p className="text-xs text-muted-foreground">{product.productType === 'EBOOK' ? 'eBook' : 'Físico'}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(product.id, quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(product.id, quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{formatPrice(product.price * quantity)}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeItem(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-lg border bg-card sticky top-24 space-y-4">
              <h3 className="font-semibold">Resumo do pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length} itens)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-muted-foreground">Calculado no checkout</span>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link to="/checkout" className="block">
                <Button className="w-full gap-2" size="lg">
                  Finalizar compra <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/catalogo" className="block text-center text-sm text-primary hover:underline">
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Cart;
