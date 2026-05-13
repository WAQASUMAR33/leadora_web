'use client';

import { useSelector } from 'react-redux';

export const useCurrency = () => {
  const currency = useSelector((state) => state.currency);

  const formatPrice = (cadPrice) => {
    const converted = (Number(cadPrice) || 0) * currency.rate;
    return `${currency.symbol}${converted.toLocaleString(currency.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return { ...currency, formatPrice };
};
