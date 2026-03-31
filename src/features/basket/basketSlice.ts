import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { products } from "../../data/products";
import type { RootState } from "../../store";
import type { BasketEntry, ProductId } from "../../types";
import { calculateCheckout } from "../../utils/calculateCheckout";

interface BasketState {
  items: BasketEntry[];
  budget: number;
}

const initialItems: BasketEntry[] = products.map((product) => {
  return {
    productId: product.id,
    quantity: 0,
  };
});

const initialState: BasketState = {
  items: initialItems,
  budget: 0,
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    setBudget: (state, action: PayloadAction<number>) => {
      state.budget = action.payload;
    },
    addItem: (state, action: PayloadAction<ProductId>) => {
      const item = state.items.find(
        (entry) => entry.productId === action.payload,
      );

      if (!item) {
        return;
      }

      const currentTotal = calculateCheckout(state.items).finalTotal;
      const productPrice = products.find((product) => product.id === action.payload)?.price ?? 0;

      if (state.budget > 0 && currentTotal + productPrice > state.budget) {
        return;
      }

      item.quantity += 1;
    },
    removeItem: (state, action: PayloadAction<ProductId>) => {
      const item = state.items.find(
        (entry) => entry.productId === action.payload,
      );

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
      state.items = products.map((product) => {
        const savedItem = action.payload.find(
          (item) => item.productId === product.id,
        );

        return {
          productId: product.id,
          quantity:
            savedItem && savedItem.quantity > 0 ? savedItem.quantity : 0,
        };
      });
    },
  },
});

export const { addItem, removeItem, clearBasket, setBasket, setBudget } =
  basketSlice.actions;

export const selectBasketItems = (state: RootState) => state.storeBasket.items;

export const selectBasketCount = (state: RootState) =>
  state.storeBasket.items.reduce((total, item) => total + item.quantity, 0);

export const selectBudget = (state: RootState) => state.storeBasket.budget;

export const selectIsNearBudget = (state: RootState) => {
  const summary = calculateCheckout(state.storeBasket.items);
  const budget = state.storeBasket.budget;

  return budget > 0 && summary.finalTotal >= budget * 0.9;
};

export const selectCheckoutSummary = (state: RootState) =>
  calculateCheckout(state.storeBasket.items);

export default basketSlice.reducer;
