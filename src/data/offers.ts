import type { Offer } from "../types";

export const offers: Offer[] = [
  {
    id: "cheese-bogo",
    title: "Cheese offer",
    description: "Buy one cheese and get one free.",
    rule: "buyOneGetOneFree",
    productId: "cheese",
  },
  {
    id: "soup-bread",
    title: "Soup and bread",
    description: "Each soup gives one bread at a lower price.",
    rule: "discountWithTriggerProduct",
    productId: "bread",
    triggerProductId: "soup",
    discountPercent: 50,
  },
  {
    id: "butter-third-off",
    title: "Butter deal",
    description: "Get a third off butter.",
    rule: "percentageOff",
    productId: "butter",
    discountPercent: 33.3333333333,
  },
];
