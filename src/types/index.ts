export type ProductType = "PHYSICAL" | "EBOOK";

export interface Product {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  productType: ProductType;
  stock: number;
  imageUrl: string;
  category: string;
  isbn?: string;
  pages?: number;
  publishedYear?: number;
  rating?: number;
  reviewCount?: number;
  bundleItems?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
  description: string;
}

export interface PaymentMethod {
  type: "CREDIT_CARD" | "PIX";
}

export interface CreditCardData {
  number: string;
  holder: string;
  expiration: string;
  cvv: string;
}

export interface PixPayment {
  id: string;
  qrCode: string;
  copyPasteCode: string;
  expiresAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: Customer;
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: "PENDING" | "APPROVED" | "REJECTED";
  orderStatus: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string;
  downloadLinks?: string[];
  orderNumber: string;
}

export interface DownloadLink {
  productId: string;
  title: string;
  url: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  phone: string;
}

export interface AdminStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
}

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}
