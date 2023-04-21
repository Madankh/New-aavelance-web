import { createSlice } from "@reduxjs/toolkit";

export const ordersSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    ordersStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    ordersSuccess: (state, action) => {
      state.isFetching = false;
      state.orders.push(action.payload);
    },
    ordersFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    
  },
});

export const { ordersStart, ordersSuccess, ordersFailure} = ordersSlice.actions;
export default ordersSlice.reducer;