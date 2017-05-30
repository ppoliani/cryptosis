import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {renderPrice} from '../common/InvestmentValueHelpers';
import {
  getTotalExposure,
  getTotalPortfolioValue,
  getTotalCash,
  getTotalInvested
} from '../../../../common/metrics/portfolio';

export default class PortfolioSummary extends Component {
  render() {
    const {investment, currency, portfolio} = this.props;
    const totalExposure = getTotalExposure(portfolio);
    const totalPortfolioValue = getTotalPortfolioValue(portfolio);
    const totalCash = getTotalCash(portfolio);
    const totalInvested = getTotalInvested(portfolio);
    const currentLiquidValue = totalCash + totalPortfolioValue;
    const percentageChange =  (currentLiquidValue / totalInvested) * 100;

    return (
      <Container title='Portfolio' subtitle='Aggregates'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <List>
            <ListItem>Exposure: {renderPrice(totalExposure, currency)}</ListItem>
            <ListItem>Total Cash: {renderPrice(totalCash, currency)}</ListItem>
            <ListItem>Total Amount Invested: {renderPrice(totalInvested, currency)}</ListItem>
            <ListItem>Portfolio Value: {renderPrice(totalPortfolioValue, currency)}</ListItem>
            <ListItem>Current Liquid Value(CLV): {renderPrice(currentLiquidValue, currency)}</ListItem>
            <ListItem>Change: {percentageChange.toFixed(2)}%</ListItem>
          </List>
        </AsyncPanel>
      </Container>
    )
  }
}
