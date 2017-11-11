import React from 'react'
import {getPercentageChange} from '../../../../common/core/utils'

const DEFAULT_CURRENCY = 'GBP';

const signedCurrency = (value, currency) =>  value >= 0
  ? `${getCurrencySymbol(currency)}${value}`
  : `-${getCurrencySymbol(currency)}${Math.abs(value)}`;

export const renderCapitalGain = ([capitalGain, capitalGainPercentage], currency) => 
    `${signedCurrency(capitalGain.toFixed(2), currency)} (${capitalGainPercentage.toFixed(2)}%)`

export const renderTransactionValue = (id, transactions, currency) => {
  const transaction = transactions.get(id);

  if(transaction) {
    const value = transaction.get('value').toFixed(2);
    return `${signedCurrency(value, currency)} (${transaction.get('percentage').toFixed(2)}%)`;
  }

  return '';
}

export const getSelectedCurrency = form => {
  const values = form.currencySelector && form.currencySelector.values;
  return values ? values.currency : DEFAULT_CURRENCY;
}

export const getSelectedAsset = form => {
  const values = form.assetSelector && form.assetSelector.values;
  return values ? values.asset : '';
}

export const renderPrice = (price=0, currency) => {
  return price != undefined
    ? <span>{signedCurrency(price.toFixed && price.toFixed(2), currency)}</span>
    : <span>Unavailable</span>
}

export const getCurrencySymbol = currency => {
  switch(currency) {
    case 'GBP':
      return '£';
    case 'EUR':
      return '€';
    case 'USD':
      return '$';
  }
}
