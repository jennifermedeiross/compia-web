import { api } from "@/api/mock-api";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.customers.list().then(setCustomers);
  }, []);
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display font-bold">Clientes</h1>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Cliente</th>
              <th className="text-left p-3 font-medium">E-mail</th>
              <th className="text-right p-3 font-medium">Pedidos</th>
              <th className="text-right p-3 font-medium">Total Gasto</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground">{c.email}</td>
                <td className="p-3 text-right">{c.orders}</td>
                <td className="p-3 text-right font-medium">{c.totalSpent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomers;
