import React from 'react';

const DEFAULT_CURRENCY = 'GBP';

export const renderInvestmentValue = (id, investmentValues, currency) => {
  const investmentValue = investmentValues.get(id);
  const symbol = getCurrencySymbol(currency);

  if(investmentValue) {
    const value = investmentValue.get('value').toFixed(2);
    const signedValue = value > 0 ? `${symbol}${value}` : `-${symbol}${Math.abs(value)}`;

    return `${signedValue} (${investmentValue.get('percentage').toFixed(2)}%)`;
  }

  return '';
}

export const getSelectedCurrency = form => {
  const values = form.currencySelector && form.currencySelector.values;
  return values ? values.currency : DEFAULT_CURRENCY;
}

export const renderPrice = (price=0, currency) => price != undefined
    ? <span>{`${getCurrencySymbol(currency)}${price.toFixed(2)}`}</span>
    : <span>Unavailable</span>

export const getCurrencySymbol = currency => {
  switch(currency) {
    case 'GBP':
      return '£';
    case 'EUR':
      return '€'
  }
}
