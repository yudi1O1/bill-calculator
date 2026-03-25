import { calculateCheckout } from "./calculateCheckout";

describe("calculateCheckout", () => {
  it("applies all supported offers correctly", () => {
    const summary = calculateCheckout([
      { productId: "soup", quantity: 2 },
      { productId: "bread", quantity: 2 },
      { productId: "cheese", quantity: 2 },
      { productId: "butter", quantity: 1 },
      { productId: "milk", quantity: 0 },
    ]);

    expect(summary.subtotal).toBe(6.4);
    expect(summary.totalSavings).toBe(2.4);
    expect(summary.finalTotal).toBe(4);
    expect(summary.appliedOffers).toHaveLength(3);
  });

  it("returns no savings when no offer condition is met", () => {
    const summary = calculateCheckout([
      { productId: "soup", quantity: 0 },
      { productId: "bread", quantity: 1 },
      { productId: "cheese", quantity: 1 },
      { productId: "butter", quantity: 0 },
      { productId: "milk", quantity: 1 },
    ]);

    expect(summary.subtotal).toBe(2.5);
    expect(summary.totalSavings).toBe(0);
    expect(summary.finalTotal).toBe(2.5);
  });
});
