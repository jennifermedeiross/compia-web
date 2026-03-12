import { api } from "@/api/mock-api";
import { formatPrice } from "@/lib/formatters";
import { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    api.orders.list().then(setOrders);
  }, []);
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display font-bold">Pedidos</h1>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Pedido</th>
              <th className="text-left p-3 font-medium">Cliente</th>
              <th className="text-left p-3 font-medium">Data</th>
              <th className="text-left p-3 font-medium">Pagamento</th>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Envio</th>
              <th className="text-right p-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3">
                  <div>
                    <p>{o.customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.customer.email}
                    </p>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="p-3">
                  <span
                    className={
                      o.paymentStatus === "APPROVED"
                        ? "badge-success"
                        : "badge-warning"
                    }>
                    {o.paymentStatus === "APPROVED" ? "Aprovado" : "Pendente"}
                  </span>
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
                <td className="p-3 text-muted-foreground text-xs">
                  {o.customer?.name ?? "—"}
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
  );
};

export default AdminOrders;
