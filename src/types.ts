export type ProductId = "bread" | "milk" | "cheese" | "soup" | "butter";

export interface Product {
  id: ProductId;
  name: string;
  price: number;
  accent: string;
  description: string;
}

export interface BasketEntry {
  productId: ProductId;
  quantity: number;
}

export interface AppliedOffer {
  id: string;
  badge: string;
  title: string;
  description: string;
  savings: number;
}

export interface BasketLineSummary {
  product: Product;
  quantity: number;
  lineSubtotal: number;
}

export interface CheckoutSummary {
  subtotal: number;
  totalSavings: number;
  finalTotal: number;
  lineItems: BasketLineSummary[];
  appliedOffers: AppliedOffer[];
}
