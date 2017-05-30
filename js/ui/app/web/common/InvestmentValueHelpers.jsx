import React from 'react';
import {getPercentageChange} from '../../../../common/core/utils';

const DEFAULT_CURRENCY = 'GBP';

const signedCurrency = (value, currency) =>  value > 0
  ? `${getCurrencySymbol(currency)}${value.toFixed(2)}`
  : `-${getCurrencySymbol(currency)}${Math.abs(value.toFixed(2))}`;

export const renderInvestmentChange = (current, initial, currency) =>
    `${signedCurrency(current - initial, currency)} (${getPercentageChange(initial, current).toFixed(2)}%)`;

export const renderInvestmentValue = (id, investmentValues, currency) => {
  const investmentValue = investmentValues.get(id);

  if(investmentValue) {
    const value = investmentValue.get('value').toFixed(2);
    return `${signedCurrency(value, getCurrencySymbol(currency))} (${investmentValue.get('percentage').toFixed(2)}%)`;
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
