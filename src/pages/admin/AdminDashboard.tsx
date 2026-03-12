import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
} from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { useEffect, useState } from "react";
import { api } from "@/api/mock-api";
import { Order, Product } from "@/types";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const load = async () => {
      api.orders.list().then(setOrders);
      api.products.list().then(setProducts);
      api.customers.list().then(setCustomers);
    };

    load();
  }, []);

  const stats = [
    {
      label: "Vendas Totais",
      value: formatPrice(orders.reduce((s, o) => s + o.total, 0)),
      icon: DollarSign,
      change: "+12.5%",
    },
    {
      label: "Pedidos",
      value: String(orders.length),
      icon: ShoppingCart,
      change: "+3",
    },
    {
      label: "Produtos",
      value: String(products.length),
      icon: Package,
      change: "",
    },
    {
      label: "Clientes",
      value: String(customers.length),
      icon: Users,
      change: "+8",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-5 rounded-lg border bg-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>

            <p className="text-2xl font-bold">{s.value}</p>

            {s.change && (
              <p className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> {s.change}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Pedidos Recentes</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Pedido</th>
                <th className="text-left p-3 font-medium">Cliente</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Total</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3 font-medium">{o.id}</td>

                  <td className="p-3 text-muted-foreground">
                    {o.customer?.name}
                  </td>

                  <td className="p-3">
                    <span
                      className={
                        o.orderStatus === "DELIVERED"
                          ? "badge-success"
                          : o.orderStatus === "SHIPPED"
                            ? "badge-warning"
                            : "badge-info"
                      }>
                      {o.orderStatus === "DELIVERED"
                        ? "Entregue"
                        : o.orderStatus === "SHIPPED"
                          ? "Enviado"
                          : "Processando"}
                    </span>
                  </td>

                  <td className="p-3 text-right font-medium">
                    {formatPrice(o.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Mais Vendidos</h3>
        </div>

        <div className="p-4 space-y-3">
          {products
            .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
            .slice(0, 5)
            .map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground w-5">
                  {i + 1}
                </span>

                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-8 h-11 object-cover rounded"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.author}</p>
                </div>

                <span className="text-sm font-medium">
                  {formatPrice(p.price)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
