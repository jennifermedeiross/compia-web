import { api } from "@/api/mock-api";
import { toEnum } from "@/lib/utils";
import { Product } from "@/types";
import { useEffect, useState } from "react";

const AdminCategories = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    api.categories.getCategories().then(setCategories);
    api.products.list().then(setProducts);
  }, []);

  const cats = categories
    .filter((c) => c !== "Todos")
    .map((c) => ({
      name: c,
      count: products.filter((p) => p.category === toEnum(c)).length,
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-display font-bold">Categorias</h1>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Categoria</th>
              <th className="text-right p-3 font-medium">Produtos</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.name} className="border-t">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-right">{c.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
