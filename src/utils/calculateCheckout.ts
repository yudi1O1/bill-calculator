import { productsById } from "../data/products";
import type {
  AppliedOffer,
  BasketEntry,
  BasketLineSummary,
  CheckoutSummary,
} from "../types";

const roundCurrency = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const getQuantity = (basket: BasketEntry[], productId: BasketEntry["productId"]) => {
  const item = basket.find((entry) => entry.productId === productId);
  return item ? item.quantity : 0;
};

const createOffer = (
  id: AppliedOffer["id"],
  productId: AppliedOffer["productId"],
  title: string,
  savings: number,
): AppliedOffer => {
  return {
    id,
    productId,
    title,
    savings: roundCurrency(savings),
  };
};

const getCheeseOffer = (basket: BasketEntry[]): AppliedOffer | null => {
  const cheeseQuantity = getQuantity(basket, "cheese");

  if (cheeseQuantity < 2) {
    return null;
  }

  const freeCheeseCount = Math.floor(cheeseQuantity / 2);
  const savings = freeCheeseCount * productsById.cheese.price;

  return createOffer("cheese-bogo", "cheese", "Cheese offer", savings);
};

const getSoupBreadOffer = (basket: BasketEntry[]): AppliedOffer | null => {
  const soupQuantity = getQuantity(basket, "soup");
  const breadQuantity = getQuantity(basket, "bread");

  if (soupQuantity === 0 || breadQuantity === 0) {
    return null;
  }

  const discountedBreadCount = Math.min(soupQuantity, breadQuantity);
  const savings = discountedBreadCount * (productsById.bread.price * 0.5);

  return createOffer("soup-bread", "bread", "Soup and bread", savings);
};

const getButterOffer = (basket: BasketEntry[]): AppliedOffer | null => {
  const butterQuantity = getQuantity(basket, "butter");

  if (butterQuantity === 0) {
    return null;
  }

  const savings = butterQuantity * (productsById.butter.price / 3);

  return createOffer("butter-third-off", "butter", "Butter deal", savings);
};

export const calculateCheckout = (basket: BasketEntry[]): CheckoutSummary => {
  const lineItems: BasketLineSummary[] = basket
    .filter((entry) => entry.quantity > 0)
    .map((entry) => {
      const product = productsById[entry.productId];

      return {
        product,
        quantity: entry.quantity,
        lineSubtotal: roundCurrency(product.price * entry.quantity),
      };
    });

  const subtotal = roundCurrency(lineItems.reduce((sum, item) => sum + item.lineSubtotal, 0));

  const appliedOffers = [
    getCheeseOffer(basket),
    getSoupBreadOffer(basket),
    getButterOffer(basket),
  ].filter((offer): offer is AppliedOffer => offer !== null);

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
