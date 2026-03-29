import { offers } from "../data/offers";
import { productsById } from "../data/products";
import type {
  AppliedOffer,
  BasketEntry,
  BasketLineSummary,
  CheckoutSummary,
} from "../types";

const roundCurrency = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const getQuantity = (basket: BasketEntry[], productId: string) => {
  const item = basket.find((entry) => entry.productId === productId);
  return item ? item.quantity : 0;
};

const getOfferSavings = (basket: BasketEntry[], offer: typeof offers[number]) => {
  const productPrice = productsById[offer.productId].price;
  const productQuantity = getQuantity(basket, offer.productId);

  if (offer.rule === "buyOneGetOneFree") {
    const freeItemCount = Math.floor(productQuantity / 2);
    return freeItemCount * productPrice;
  }

  if (offer.rule === "percentageOff") {
    const discountPercent = offer.discountPercent || 0;
    return productQuantity * productPrice * (discountPercent / 100);
  }

  if (offer.rule === "discountWithTriggerProduct") {
    const triggerQuantity = getQuantity(basket, offer.triggerProductId || "");
    const discountedItemCount = Math.min(triggerQuantity, productQuantity);
    const discountPercent = offer.discountPercent || 0;
    return discountedItemCount * productPrice * (discountPercent / 100);
  }

  if (offer.rule === "halfOffEverySecond") {
    const discountedItemCount = Math.floor(productQuantity / 2);
    return discountedItemCount * productPrice * 0.5;
  }

  return 0;
};

export const calculateCheckout = (basket: BasketEntry[]): CheckoutSummary => {
  const lineItems: BasketLineSummary[] = [];

  for (const entry of basket) {
    if (entry.quantity <= 0) {
      continue;
    }

    const product = productsById[entry.productId];

    lineItems.push({
      product,
      quantity: entry.quantity,
      lineSubtotal: roundCurrency(product.price * entry.quantity),
      });
  }

  const subtotal = roundCurrency(lineItems.reduce((sum, item) => sum + item.lineSubtotal, 0));

  const appliedOffers: AppliedOffer[] = [];

  for (const offer of offers) {
    const savings = roundCurrency(getOfferSavings(basket, offer));

    if (savings > 0) {
      appliedOffers.push({
        id: offer.id,
        productId: offer.productId,
        title: offer.title,
        savings,
      });
    }
  }

  const totalSavings = roundCurrency(
    appliedOffers.reduce((sum, offer) => sum + offer.savings, 0),
  );

  return {
    subtotal,
    totalSavings,
    finalTotal: roundCurrency(subtotal - totalSavings),
    lineItems,
    appliedOffers,
  };
};
