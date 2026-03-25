import type { Product } from "../types";

export const products: Product[] = [
  {
    id: "bread",
    name: "Bread",
    price: 1.1,
    accent: "#d97706",
    description: "Freshly baked loaf that pairs with soup and breakfast spreads.",
  },
  {
    id: "milk",
    name: "Milk",
    price: 0.5,
    accent: "#2563eb",
    description: "Daily essential dairy staple for tea, coffee, and cereal.",
  },
  {
    id: "cheese",
    name: "Cheese",
    price: 0.9,
    accent: "#eab308",
    description: "Rich cheddar block that qualifies for the buy-one-get-one offer.",
  },
  {
    id: "soup",
    name: "Soup",
    price: 0.6,
    accent: "#dc2626",
    description: "Comforting tomato soup that unlocks discounted bread.",
  },
  {
    id: "butter",
    name: "Butter",
    price: 1.2,
    accent: "#16a34a",
    description: "Creamy butter with an automatic one-third discount applied.",
  },
];

export const productsById = Object.fromEntries(
  products.map((product) => [product.id, product]),
) as Record<Product["id"], Product>;
