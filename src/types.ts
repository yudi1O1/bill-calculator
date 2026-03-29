export type ProductId = "bread" | "milk" | "cheese" | "soup" | "butter";

export interface Product {
  id: ProductId;
  name: string;
  price: number;
  accentClass: string;
}

export interface BasketEntry {
  productId: ProductId;
  quantity: number; 
}

export interface AppliedOffer {
  id: string;
  productId: ProductId;
  title: string;
  savings: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  rule: string;
  productId: ProductId;
  triggerProductId?: ProductId;
  discountPercent?: number;
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
