import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { products } from "../../data/products";
import type { RootState } from "../../store";
import type { BasketEntry, ProductId } from "../../types";
import { calculateCheckout } from "../../utils/calculateCheckout";

interface BasketState {
  items: BasketEntry[];
}

const initialItems: BasketEntry[] = products.map((product) => {
  return {
    productId: product.id,
    quantity: 0,
  };
});

const initialState: BasketState = {
  items: initialItems,
};

const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ProductId>) => {
      const item = state.items.find((entry) => entry.productId === action.payload);

      if (item) {
        item.quantity = item.quantity + 1;
      }
    },
    removeItem: (state, action: PayloadAction<ProductId>) => {
      const item = state.items.find((entry) => entry.productId === action.payload);

      if (item && item.quantity > 0) {
        item.quantity = item.quantity - 1;
      }
    },
    clearBasket: (state) => {
      state.items.forEach((item) => {
        item.quantity = 0;
      });
    },
    setBasket: (state, action: PayloadAction<BasketEntry[]>) => {
      state.items = products.map((product) => {
        const savedItem = action.payload.find((item) => item.productId === product.id);

        return {
          productId: product.id,
          quantity: savedItem && savedItem.quantity > 0 ? savedItem.quantity : 0,
        };
      });
    },
  },
});

export const { addItem, removeItem, clearBasket, setBasket } = basketSlice.actions;

export const selectBasketItems = (state: RootState) => state.basket.items;

export const selectBasketCount = (state: RootState) => {
  let total = 0;

  state.basket.items.forEach((item) => {
    total += item.quantity;
  });

  return total;
};

export const selectCheckoutSummary = (state: RootState) => {
  return calculateCheckout(state.basket.items);
};

export default basketSlice.reducer;
