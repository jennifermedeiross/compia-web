import { useLocation, Link } from "react-router-dom";
import { CheckCircle2, Download, Package, ArrowRight } from "lucide-react";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatters";
import { Order } from "@/types";

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  if (!order) {
    return (
      <StoreLayout>
        <div className="container py-20 text-center space-y-4">
          <p className="text-xl font-semibold">Pedido não encontrado</p>
          <Link to="/">
            <Button>Voltar à loja</Button>
          </Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="container py-12 max-w-2xl text-center animate-fade-in">
        <CheckCircle2 className="h-16 w-16 mx-auto text-success mb-4" />
        <h1 className="text-3xl font-display font-bold mb-2">
          Pedido Confirmado!
        </h1>
        <p className="text-muted-foreground mb-1">Obrigado pela sua compra.</p>
        <p className="text-sm text-muted-foreground mb-8">
          Número do pedido: <strong>{order.id}</strong>
        </p>

        <div className="text-left space-y-6 p-6 rounded-lg border bg-card">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status do pagamento</span>
            <span className="badge-success">
              {order.paymentStatus === "APPROVED" ? "Aprovado" : "Pendente"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status do pedido</span>
            <span className="badge-info">
              {order.orderStatus === "PROCESSING"
                ? "Em processamento"
                : order.orderStatus}
            </span>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Package className="h-4 w-4" /> Itens
            </h3>
            {order.items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex justify-between text-sm py-1">
                <span>
                  {product.title} × {quantity}
                </span>
                <span>{formatPrice(product.price * quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Frete ({order.shippingMethod.name})
              </span>
              <span>
                {order.shippingCost === 0
                  ? "Grátis"
                  : formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {order.downloadLinks && order.downloadLinks.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Download className="h-4 w-4" /> Downloads disponíveis
              </h3>

              {order.downloadLinks.map((title) => (
                <Button
                  key={title}
                  variant="outline"
                  size="sm"
                  className="gap-2 mr-2 mb-2"
                  onClick={() => alert("Download simulado: " + title)}>
                  <Download className="h-3.5 w-3.5" />
                  {title}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center mt-8">
          <Link to="/conta">
            <Button variant="outline">Meus pedidos</Button>
          </Link>
          <Link to="/catalogo">
            <Button className="gap-2">
              Continuar comprando <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </StoreLayout>
  );
};

export default OrderConfirmation;
