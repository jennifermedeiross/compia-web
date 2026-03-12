import {
  Product,
  ShippingMethod,
  PixPayment,
  Order,
  ViaCEPResponse,
  CartItem,
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
    calculate: (cep: string, items: CartItem[]) =>
      apiFetch(`/shipping/calculate`, {
        method: "POST",
        body: JSON.stringify({ cep, items }),
      }),
  },

  payments: {
    pix: (orderId: string) =>
      apiFetch(`/payments/pix`, {
        method: "POST",
        body: JSON.stringify({ orderId }),
      }),

    card: (cardData: unknown) =>
      apiFetch(`/payments/card`, {
        method: "POST",
        body: JSON.stringify(cardData),
      }),
  },

  orders: {
    create: (orderData: any) => {
      const payload = {
        customer: orderData.customer,
        paymentMethod: orderData.paymentMethod,
        subtotal: orderData.subtotal,
        shippingCost: orderData.shippingCost,
        total: orderData.total,

        items: orderData.items.map((i: any) => ({
          productId: Number(i.product.id),
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
};
