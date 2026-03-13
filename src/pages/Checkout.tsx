import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, QrCode, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { StoreLayout } from "@/components/StoreLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/api/mock-api";
import {
  formatPrice,
  formatCEP,
  formatPhone,
  formatCardNumber,
  formatExpiration,
} from "@/lib/formatters";
import { ShippingMethod, Customer, ShippingAddress, PixPayment } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCartStore();
  const { addOrder } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState<"info" | "shipping" | "payment">("info");
  const [loading, setLoading] = useState(false);

  // Customer info
  const [customer, setCustomer] = useState<Customer>({
    id: "",
    name: "",
    email: "",
    phone: "",
  });

  // Address
  const [address, setAddress] = useState<ShippingAddress>({
    cep: "",
    state: "",
    city: "",
    neighborhood: "",
    street: "",
    number: "",
    complement: "",
  });
  const [cepLoading, setCepLoading] = useState(false);

  // Shipping
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>("");

  // Payment
  const [paymentType, setPaymentType] = useState<"CREDIT_CARD" | "PIX">(
    "CREDIT_CARD",
  );
  const [cardData, setCardData] = useState({
    number: "",
    holder: "",
    expiration: "",
    cvv: "",
  });
  const [pixData, setPixData] = useState<PixPayment | null>(null);
  const [copied, setCopied] = useState(false);

  const sub = subtotal();
  const shipping = shippingMethods.find((m) => m.id === selectedShipping);
  const total = sub + (shipping?.price ?? 0);

  const hasPhysical = items.some((i) => i.product.productType === "PHYSICAL");

  const lookupCep = async (cep: string) => {
    const formatted = formatCEP(cep);
    setAddress((a) => ({ ...a, cep: formatted }));
    const clean = cep.replace(/\D/g, "");
    if (clean.length === 8) {
      setCepLoading(true);
      const data = await api.address.lookupCep(clean);
      if (data) {
        setAddress((a) => ({
          ...a,
          cep: formatted,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
        }));
      }
      setCepLoading(false);
    }
  };

  const handleInfoSubmit = async () => {
    if (!customer.name || !customer.email || !customer.phone) {
      toast({
        title: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    if (
      hasPhysical &&
      (!address.cep ||
        !address.street ||
        !address.number ||
        !address.city ||
        !address.state)
    ) {
      toast({ title: "Preencha o endereço completo", variant: "destructive" });
      return;
    }
    setLoading(true);

    const cleanCep = address.cep.replace(/\D/g, "");

    const methods = await api.shipping.calculate(cleanCep, items);
    setShippingMethods(methods);
    if (methods.length === 1) setSelectedShipping(methods[0].id);
    setLoading(false);
    setStep("shipping");
  };

  const startPixPolling = (pixId: string) => {
    const interval = setInterval(async () => {
      const res = await api.payments.status(pixId);

      if (res.status === "PAID") {
        clearInterval(interval);

        const order = await api.orders.create({
          customerInfo: customer,
          paymentMethod: paymentType,
          subtotal: sub,
          shippingCost: shipping?.price ?? 0,
          total,

          items: items.map((i) => ({
            productId: Number(i.product.id),
            quantity: i.quantity,
          })),
        });

        navigate(`/pedido/${order.id}`);
      }
    }, 3000);
  };

  const handleShippingSubmit = () => {
    if (!selectedShipping) {
      toast({ title: "Selecione um método de envio", variant: "destructive" });
      return;
    }
    setStep("payment");
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      console.log(pixData);
      if (paymentType === "PIX" && pixData) {
        console.log("entrou no if");
        const order = await api.orders.create({
          customerInfo: customer,
          paymentMethod: paymentType,
          subtotal: sub,
          shippingCost: shipping?.price ?? 0,
          total,
          items: items.map((i) => ({
            productId: Number(i.product.id),
            quantity: i.quantity,
          })),
        });

        addOrder(order);
        clearCart();

        navigate(`/pedido/${order.id}`, { state: { order } });

        setLoading(false);
        return;
      }
      if (paymentType === "PIX") {
        const pix = await api.payments.pix(total, customer);

        setPixData({
          id: pix.id,
          qrCode: pix.qrCode,
          copyPasteCode: pix.copyPasteCode,
          expiresAt: pix.expiresAt,
        });

        setLoading(false);
        return;
      } else {
        if (
          !cardData.number ||
          !cardData.holder ||
          !cardData.expiration ||
          !cardData.cvv
        ) {
          toast({
            title: "Preencha todos os dados do cartão",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        await api.payments.card(cardData);
      }

      const order = await api.orders.create({
        customerInfo: customer,
        paymentMethod: paymentType,
        subtotal: sub,
        shippingCost: shipping?.price ?? 0,
        total,

        items: items.map((i) => ({
          productId: Number(i.product.id),
          quantity: i.quantity,
        })),
      });

      addOrder(order);
      clearCart();
      navigate(`/pedido/${order.id}`, { state: { order } });
    } catch {
      toast({ title: "Erro ao processar pagamento", variant: "destructive" });
    }

    setLoading(false);
  };

  if (items.length === 0) {
    navigate("/carrinho");
    return null;
  }

  return (
    <StoreLayout>
      <div className="container py-8 max-w-5xl">
        <h1 className="text-3xl font-display font-bold mb-2">Checkout</h1>
        {/* Steps */}
        <div className="flex gap-2 mb-8 text-sm">
          {["info", "shipping", "payment"].map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-1 ${step === s ? "text-primary font-semibold" : "text-muted-foreground"}`}>
              <span
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs border ${step === s ? "bg-primary text-primary-foreground border-primary" : "border-muted-foreground"}`}>
                {i + 1}
              </span>
              <span className="hidden sm:inline">
                {s === "info"
                  ? "Informações"
                  : s === "shipping"
                    ? "Envio"
                    : "Pagamento"}
              </span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left */}
          <div className="lg:col-span-3 space-y-6">
            {step === "info" && (
              <>
                <div className="space-y-4">
                  <h2 className="font-semibold">Dados pessoais</h2>
                  <div className="grid gap-3">
                    <div>
                      <Label>Nome completo *</Label>
                      <Input
                        value={customer.name}
                        onChange={(e) =>
                          setCustomer({ ...customer, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>E-mail *</Label>
                        <Input
                          type="email"
                          value={customer.email}
                          onChange={(e) =>
                            setCustomer({ ...customer, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Telefone *</Label>
                        <Input
                          value={customer.phone}
                          onChange={(e) =>
                            setCustomer({
                              ...customer,
                              phone: formatPhone(e.target.value),
                            })
                          }
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {hasPhysical && (
                  <div className="space-y-4">
                    <h2 className="font-semibold">Endereço de entrega</h2>
                    <div className="grid gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>CEP *</Label>
                          <div className="relative">
                            <Input
                              value={address.cep}
                              onChange={(e) => lookupCep(e.target.value)}
                              placeholder="00000-000"
                            />
                            {cepLoading && (
                              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
                            )}
                          </div>
                        </div>
                        <div>
                          <Label>Estado *</Label>
                          <Input
                            value={address.state}
                            onChange={(e) =>
                              setAddress({ ...address, state: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Cidade *</Label>
                        <Input
                          value={address.city}
                          onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Bairro *</Label>
                        <Input
                          value={address.neighborhood}
                          onChange={(e) =>
                            setAddress({
                              ...address,
                              neighborhood: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <Label>Rua *</Label>
                          <Input
                            value={address.street}
                            onChange={(e) =>
                              setAddress({ ...address, street: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Número *</Label>
                          <Input
                            value={address.number}
                            onChange={(e) =>
                              setAddress({ ...address, number: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Complemento</Label>
                        <Input
                          value={address.complement}
                          onChange={(e) =>
                            setAddress({
                              ...address,
                              complement: e.target.value,
                            })
                          }
                          placeholder="Apto, bloco, etc."
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleInfoSubmit}
                  className="w-full"
                  size="lg"
                  disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Continuar para envio
                </Button>
              </>
            )}

            {step === "shipping" && (
              <div className="space-y-4">
                <h2 className="font-semibold">Método de envio</h2>
                <RadioGroup
                  value={selectedShipping}
                  onValueChange={setSelectedShipping}>
                  {shippingMethods.map((m) => (
                    <div
                      key={m.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer ${selectedShipping === m.id ? "border-primary bg-primary/5" : ""}`}>
                      <RadioGroupItem value={m.id} id={m.id} />
                      <label htmlFor={m.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{m.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {m.description} •{" "}
                              {m.estimatedDays === 0
                                ? "Imediato"
                                : `${m.estimatedDays} dias úteis`}
                            </p>
                          </div>
                          <span className="font-bold text-sm">
                            {m.price === 0 ? "Grátis" : formatPrice(m.price)}
                          </span>
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("info")}>
                    Voltar
                  </Button>
                  <Button onClick={handleShippingSubmit} className="flex-1">
                    Continuar para pagamento
                  </Button>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="space-y-6">
                <h2 className="font-semibold">Forma de pagamento</h2>
                <RadioGroup
                  value={paymentType}
                  onValueChange={(v) =>
                    setPaymentType(v as "CREDIT_CARD" | "PIX")
                  }
                  className="flex gap-4">
                  <div
                    className={`flex-1 flex items-center gap-2 p-4 rounded-lg border cursor-pointer ${paymentType === "CREDIT_CARD" ? "border-primary bg-primary/5" : ""}`}>
                    <RadioGroupItem value="CREDIT_CARD" id="card" />
                    <label
                      htmlFor="card"
                      className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-5 w-5" /> Cartão de Crédito
                    </label>
                  </div>
                  <div
                    className={`flex-1 flex items-center gap-2 p-4 rounded-lg border cursor-pointer ${paymentType === "PIX" ? "border-primary bg-primary/5" : ""}`}>
                    <RadioGroupItem value="PIX" id="pix" />
                    <label
                      htmlFor="pix"
                      className="flex items-center gap-2 cursor-pointer">
                      <QrCode className="h-5 w-5" /> PIX
                    </label>
                  </div>
                </RadioGroup>

                {paymentType === "CREDIT_CARD" && (
                  <div className="grid gap-3">
                    <div>
                      <Label>Número do cartão *</Label>
                      <Input
                        value={cardData.number}
                        onChange={(e) =>
                          setCardData({
                            ...cardData,
                            number: formatCardNumber(e.target.value),
                          })
                        }
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                    <div>
                      <Label>Nome no cartão *</Label>
                      <Input
                        value={cardData.holder}
                        onChange={(e) =>
                          setCardData({ ...cardData, holder: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Validade *</Label>
                        <Input
                          value={cardData.expiration}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              expiration: formatExpiration(e.target.value),
                            })
                          }
                          placeholder="MM/AA"
                        />
                      </div>
                      <div>
                        <Label>CVV *</Label>
                        <Input
                          value={cardData.cvv}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              cvv: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4),
                            })
                          }
                          placeholder="000"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentType === "PIX" && pixData && (
                  <div className="text-center space-y-4 p-6 rounded-lg border bg-card">
                    <img
                      src={pixData.qrCode}
                      alt="QR Code PIX"
                      className="w-48 h-48 mx-auto"
                    />
                    <p className="text-sm text-muted-foreground">
                      Escaneie o QR Code ou copie o código
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={pixData.copyPasteCode}
                        readOnly
                        className="text-xs"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(pixData.copyPasteCode);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}>
                        {copied ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep("shipping")}>
                    Voltar
                  </Button>
                  <Button
                    onClick={handlePayment}
                    className="flex-1"
                    size="lg"
                    disabled={loading}>
                    {loading && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {paymentType === "PIX" && !pixData
                      ? "Gerar PIX"
                      : "Finalizar pedido"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right - Summary */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-lg border bg-card sticky top-24 space-y-4">
              <h3 className="font-semibold">Resumo</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-2">
                        {product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qtd: {quantity}
                      </p>
                    </div>
                    <span className="text-xs font-medium">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span>
                    {shipping
                      ? shipping.price === 0
                        ? "Grátis"
                        : formatPrice(shipping.price)
                      : "—"}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Checkout;
