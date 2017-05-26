export const renderInvestmentValue = (id, investmentValues) => {
  const investmentValue = investmentValues.get(id);

  if(investmentValue) {
    const value = investmentValue.get('value').toFixed(2);
    const signedValue = value > 0 ? `£${value}` : `-£${Math.abs(value)}`;

    return `${signedValue} (${investmentValue.get('percentage').toFixed(2)}%)`;
  }

  return '';
}
