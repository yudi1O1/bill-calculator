import type { Product } from "../types";

export const products: Product[] = [
  {
    id: "bread",
    name: "Bread",
    price: 1.1,
    accentClass: "border-l-amber-600",
  },
  {
    id: "milk",
    name: "Milk",
    price: 0.5,
    accentClass: "border-l-blue-600",
  },
  {
    id: "cheese",
    name: "Cheese",
    price: 0.9,
    accentClass: "border-l-yellow-500",
  },
  {
    id: "soup",
    name: "Soup",
    price: 0.6,
    accentClass: "border-l-red-600",
  },
  {
    id: "butter",
    name: "Butter",
    price: 1.2,
    accentClass: "border-l-green-600",
  },
];

export const productsById = Object.fromEntries(
  products.map((product) => [product.id, product]),
) as Record<Product["id"], Product>;
