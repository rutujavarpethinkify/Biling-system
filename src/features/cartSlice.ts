import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartState {
  quantities: Record<string, number>;
}

const initialState: CartState = {
  quantities: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      if (quantity > 0) {
        state.quantities[productId] = quantity;
      } else {
        delete state.quantities[productId];
      }
    },
    increment: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.quantities[id] = (state.quantities[id] || 0) + 1;
    },
    decrement: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const existing = state.quantities[id] || 0;
      if (existing > 1) {
        state.quantities[id] = existing - 1;
      } else {
        delete state.quantities[id];
      }
    },
    clear: (state) => {
      state.quantities = {};
    },
  },
});

export const { setQuantity, increment, decrement, clear } = cartSlice.actions;

export default cartSlice.reducer;
