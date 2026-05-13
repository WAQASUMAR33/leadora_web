import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import currencyReducer from './currencySlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    currency: currencyReducer,
  },
});

export default store;
