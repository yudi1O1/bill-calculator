import { productsById } from "../data/products";
import type { AppliedOffer, BasketEntry, BasketLineSummary, CheckoutSummary } from "../types";

const roundCurrency = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

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

  const subtotal = roundCurrency(
    lineItems.reduce((sum, item) => sum + item.lineSubtotal, 0),
  );

  const quantities = Object.fromEntries(
    basket.map((entry) => [entry.productId, entry.quantity]),
  ) as Record<keyof typeof productsById, number>;

  const appliedOffers: AppliedOffer[] = [];

  const cheeseSavings = roundCurrency(
    Math.floor((quantities.cheese ?? 0) / 2) * productsById.cheese.price,
  );
  if (cheeseSavings > 0) {
    appliedOffers.push({
      id: "cheese-bogo",
      title: "Cheese offer",
      description: "Every second cheese is free.",
      savings: cheeseSavings,
    });
  }

  const soupBreadPairs = Math.min(quantities.soup ?? 0, quantities.bread ?? 0);
  const soupBreadSavings = roundCurrency(
    soupBreadPairs * (productsById.bread.price / 2),
  );
  if (soupBreadSavings > 0) {
    appliedOffers.push({
      id: "soup-bread",
      title: "Soup and bread",
      description: `${soupBreadPairs} bread item(s) got a discount with soup.`,
      savings: soupBreadSavings,
    });
  }

  const butterSavings = roundCurrency(
    (quantities.butter ?? 0) * (productsById.butter.price / 3),
  );
  if (butterSavings > 0) {
    appliedOffers.push({
      id: "butter-third-off",
      title: "Butter deal",
      description: "A discount was applied to each butter.",
      savings: butterSavings,
    });
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
