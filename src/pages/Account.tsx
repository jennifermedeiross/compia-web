import { Link, useNavigate } from "react-router-dom";
import { Download, Package, User, LogOut } from "lucide-react";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth-store";
import { formatPrice } from "@/lib/formatters";

const Account = () => {
  const { user, orders, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const statusLabel: Record<string, string> = {
    PROCESSING: "Em processamento",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
  };

  const statusClass: Record<string, string> = {
    PROCESSING: "badge-info",
    SHIPPED: "badge-warning",
    DELIVERED: "badge-success",
    CANCELLED: "text-destructive",
  };

  const downloadFakeEbook = (title: string) => {
    const content = `
    ${title}

    Este é um ebook de demonstração.

    Obrigado por comprar na COMPIA Editora.

    Este arquivo foi gerado apenas para simulação de download.
    `;

    const blob = new Blob([content], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.pdf`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <StoreLayout>
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Minha Conta</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="gap-2">
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>

        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders" className="gap-1">
              <Package className="h-4 w-4" /> Pedidos
            </TabsTrigger>
            <TabsTrigger value="downloads" className="gap-1">
              <Download className="h-4 w-4" /> Downloads
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-1">
              <User className="h-4 w-4" /> Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6 space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Package className="h-12 w-12 mx-auto text-muted-foreground/40" />
                <p className="font-semibold">Nenhum pedido ainda</p>
                <Link to="/catalogo">
                  <Button>Explorar catálogo</Button>
                </Link>
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  className="p-4 rounded-lg border bg-card space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{o.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={statusClass[o.orderStatus]}>
                        {statusLabel[o.orderStatus]}
                      </span>
                      <p className="font-bold text-sm mt-1">
                        {formatPrice(o.total)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {o.items.map(({ product }) => (
                      <img
                        key={product.id}
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-10 h-14 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="downloads" className="mt-6 space-y-4">
            {orders.flatMap((o) => o.downloadLinks ?? []).length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Download className="h-12 w-12 mx-auto text-muted-foreground/40" />
                <p className="font-semibold">Nenhum download disponível</p>
              </div>
            ) : (
              orders
                .filter((o) => o.downloadLinks?.length)
                .map((o) => (
                  <div key={o.id} className="p-4 rounded-lg border bg-card">
                    <p className="text-xs text-muted-foreground mb-2">
                      Pedido {o.id}
                    </p>
                    {o.downloadLinks!.map((title) => (
                      <Button
                        key={title}
                        variant="outline"
                        size="sm"
                        className="gap-2 mr-2 mb-2"
                        onClick={() => downloadFakeEbook(title)}>
                        <Download className="h-3.5 w-3.5" /> {title}
                      </Button>
                    ))}
                  </div>
                ))
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="p-6 rounded-lg border bg-card max-w-md space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">E-mail</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tipo de conta</p>
                <p className="font-medium">
                  {user?.role === "ADMIN" ? "Administrador" : "Cliente"}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StoreLayout>
  );
};

export default Account;
