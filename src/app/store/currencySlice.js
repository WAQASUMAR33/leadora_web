import { createSlice } from '@reduxjs/toolkit';
import { CURRENCIES } from '../../lib/currencies';

const loadSaved = () => {
  if (typeof window !== 'undefined') {
    const code = localStorage.getItem('selectedCurrency');
    if (code && CURRENCIES[code]) return CURRENCIES[code];
  }
  return CURRENCIES.CAD;
};

const currencySlice = createSlice({
  name: 'currency',
  initialState: loadSaved(),
  reducers: {
    setCurrency: (state, action) => {
      const { code, symbol, locale, rate } = action.payload;
      state.code   = code;
      state.symbol = symbol;
      state.locale = locale;
      state.rate   = rate;
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedCurrency', code);
      }
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
