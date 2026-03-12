import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types";
import { formatPrice } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/api/mock-api";
import { toEnum } from "@/lib/utils";

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();

  const loadProducts = async () => {
    const data = await api.products.list();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
    api.categories.getCategories().then(setCategories);
  }, []);

  const openNew = () => {
    setEditProduct({
      title: "",
      author: "",
      description: "",
      price: 0,
      productType: "PHYSICAL",
      stock: 0,
      imageUrl: "/images/deep-learning.jpg",
      category: "Inteligência Artificial",
    });
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct({ ...p });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editProduct?.title || !editProduct?.author) {
      toast({
        title: "Preencha título e autor",
        variant: "destructive",
      });
      return;
    }

    const produto = {
      ...editProduct,
      category: toEnum(editProduct.category ?? ""),
    };

    (editProduct.id
      ? api.products.update(editProduct.id, produto)
      : api.products.create(produto as Product)
    )
      .then(() => {
        toast({
          title: editProduct.id ? "Produto atualizado!" : "Produto criado!",
        });
        return loadProducts();
      })
      .then(() => {
        setDialogOpen(false);
        setEditProduct(null);
      })
      .catch(() => {
        toast({
          title: "Erro ao salvar produto",
          variant: "destructive",
        });
      });
  };

  const handleDelete = async (id: string) => {
    try {
      await api.products.delete(id);
      await loadProducts();

      toast({
        title: "Produto removido",
      });
    } catch {
      toast({
        title: "Erro ao remover produto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold">Produtos</h1>

        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Produto</th>
              <th className="text-left p-3 font-medium">Categoria</th>
              <th className="text-left p-3 font-medium">Tipo</th>
              <th className="text-right p-3 font-medium">Preço</th>
              <th className="text-right p-3 font-medium">Estoque</th>
              <th className="text-right p-3 font-medium">Ações</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-8 h-11 object-cover rounded"
                    />

                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.author}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-3 text-muted-foreground">{p.category}</td>

                <td className="p-3">
                  <span
                    className={
                      p.productType === "EBOOK" ? "badge-info" : "badge-success"
                    }>
                    {p.productType === "EBOOK" ? "eBook" : "Físico"}
                  </span>
                </td>

                <td className="p-3 text-right font-medium">
                  {formatPrice(p.price)}
                </td>

                <td className="p-3 text-right">
                  {p.productType === "EBOOK" ? "∞" : p.stock}
                </td>

                <td className="p-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(p)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(p.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editProduct?.id ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>

          {editProduct && (
            <div className="grid gap-4">
              <div>
                <Label>Título *</Label>
                <Input
                  value={editProduct.title ?? ""}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Autor *</Label>
                <Input
                  value={editProduct.author ?? ""}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      author: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>Descrição</Label>
                <Input
                  value={editProduct.description ?? ""}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editProduct.price ?? 0}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Estoque</Label>
                  <Input
                    type="number"
                    value={editProduct.stock ?? 0}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        stock: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={editProduct.productType}
                    onValueChange={(v) =>
                      setEditProduct({
                        ...editProduct,
                        productType: v as "PHYSICAL" | "EBOOK",
                      })
                    }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="PHYSICAL">Físico</SelectItem>
                      <SelectItem value="EBOOK">eBook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Categoria</Label>
                  <Select
                    value={editProduct.category}
                    onValueChange={(v) =>
                      setEditProduct({
                        ...editProduct,
                        category: v,
                      })
                    }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {categories
                        .filter((c) => c !== "Todos")
                        .map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>URL da Imagem</Label>
                <Input
                  value={editProduct.imageUrl ?? ""}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      imageUrl: e.target.value,
                    })
                  }
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                Salvar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
