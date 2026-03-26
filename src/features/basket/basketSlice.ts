import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { products } from "../../data/products";
import type { RootState } from "../../store";
import type { BasketEntry, ProductId } from "../../types";
import { calculateCheckout } from "../../utils/calculateCheckout";

interface BasketState {
  items: BasketEntry[];
}

const createEmptyBasketItems = (): BasketEntry[] =>
  products.map((product) => ({
    productId: product.id,
    quantity: 0,
  }));

const normalizeBasketItems = (items: BasketEntry[]): BasketEntry[] =>
  products.map((product) => {
    const matchingItem = items.find((item) => item.productId === product.id);

    return {
      productId: product.id,
      quantity: Math.max(0, matchingItem?.quantity ?? 0),
    };
  });

const initialState: BasketState = {
  items: createEmptyBasketItems(),
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ProductId>) => {
      const item = state.items.find((entry) => entry.productId === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    removeItem: (state, action: PayloadAction<ProductId>) => {
      const item = state.items.find((entry) => entry.productId === action.payload);
      if (item && item.quantity > 0) {
        item.quantity -= 1;
      }
    },
    clearBasket: (state) => {
      state.items.forEach((item) => {
        item.quantity = 0;
      });
    },
    setBasket: (state, action: PayloadAction<BasketEntry[]>) => {
      state.items = normalizeBasketItems(action.payload);
    },
  },
});

export const { addItem, removeItem, clearBasket, setBasket } = basketSlice.actions;

export const selectBasketItems = (state: RootState) => state.basket.items;

export const selectBasketCount = createSelector([selectBasketItems], (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0),
);

export const selectCheckoutSummary = createSelector([selectBasketItems], (items) =>
  calculateCheckout(items),
);

export default basketSlice.reducer;
