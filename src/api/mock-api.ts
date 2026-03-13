import {
  Product,
  ShippingMethod,
  PixPayment,
  Order,
  ViaCEPResponse,
  CartItem,
  Customer,
} from "@/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Products API
import { apiFetch } from "./api-client";
export const api = {
  products: {
    list: async (params?: {
      category?: string;
      search?: string;
      sort?: string;
    }) => {
      const query = new URLSearchParams();

      if (params?.category) query.append("category", params.category);
      if (params?.search) query.append("search", params.search);
      if (params?.sort) query.append("sort", params.sort);

      const queryString = query.toString();

      return apiFetch(`/products${queryString ? `?${queryString}` : ""}`);
    },

    getById: (id: string) => apiFetch(`/products/${id}`),

    create: (product: Product) =>
      apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(product),
      }),

    update: (id: string, product: Partial<Product>) =>
      apiFetch(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
      }),

    delete: (id: string) =>
      apiFetch(`/products/${id}`, {
        method: "DELETE",
      }),
  },

  reviews: {
    getByProductId: (productId: string) =>
      apiFetch(`/reviews?productId=${productId}`),
  },

  shipping: {
    calculate: async (cep: string, items: CartItem[]) => {
      const response = await apiFetch(`/shipping/calculate`, {
        method: "POST",
        body: JSON.stringify({
          cep,
          items: items.map((i) => ({
            productId: Number(i.product.id),
            quantity: i.quantity,
          })),
        }),
      });

      return response.map((m: any) => ({
        id: String(m.id),

        name: `${m.company?.name ?? ""} ${m.name}`.trim(),

        price: parseFloat(m.price ?? "0"),

        estimatedDays: m.delivery_time ?? m.delivery_range?.max ?? 0,

        description: m.company?.name ?? "",
      }));
    },
  },

  payments: {
    pix: async (total: number, customer: Customer) => {
      const response = await apiFetch("/payments/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        }),
      });

      return response as PixPayment;
    },

    card: (cardData: unknown) =>
      apiFetch(`/payments/card`, {
        method: "POST",
        body: JSON.stringify(cardData),
      }),

    status: async (pixId: string) => {
      const response = await apiFetch(`/payments/pix/status/${pixId}`, {
        method: "GET",
      });

      return response as { status: string };
    },

    simulate: async (pixId: string) => {
      const response = await apiFetch(`/payments/pix/simulate/${pixId}`, {
        method: "POST",
      });

      console.log("Simulated PIX payment:", response);
      return response;
    },
  },

  orders: {
    create: (orderData: any) => {
      const payload = {
        customerInfo: orderData.customerInfo,
        paymentMethod: orderData.paymentMethod,
        subtotal: orderData.subtotal,
        shippingCost: orderData.shippingCost,
        total: orderData.total,

        items: orderData.items.map((i: any) => ({
          productId: Number(i.productId),
          quantity: i.quantity,
        })),
      };

      return apiFetch(`/orders`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },

    getById: (id: string) => apiFetch(`/orders/${id}`),

    list: () => apiFetch(`/orders`),
  },

  address: {
    lookupCep: async (cep: string) => {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      return res.json();
    },
  },

  categories: {
    getCategories: () => apiFetch(`/products/categories`),
  },

  customers: {
    list: () => apiFetch(`/customers`),
  },

  auth: {
    login: (email: string, password: string) =>
      apiFetch("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    register: (name: string, email: string, password: string, phone: string) =>
      apiFetch("/users/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
        }),
      }),

    listUsers: () => apiFetch("/users"),
  },
};
