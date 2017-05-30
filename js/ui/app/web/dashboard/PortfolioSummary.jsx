import React, {Component} from 'react';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {List, ListItem} from 'material-ui/List';
import {renderPrice} from '../common/InvestmentValueHelpers';

export default class PortfolioSummary extends Component {
  getTotalExposure() {
    return this.props.portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => Math.floor(total.get('totalExposure').reduce((acc, v) => acc + v, 0)),
        Nothing: () => 0
      });
  }

  getTotalPortfolioValue() {
    return this.props.portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => Math.floor(total.get('currentValue').reduce((acc, v) => acc + v, 0)),
        Nothing: () => 0
      });
  }

  getTotalCash() {
    return this.props.portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => Math.floor(total.get('totalCash').reduce((acc, v) => acc + v, 0)),
        Nothing: () => 0
      });
  }

  getTotalInvested() {
    return this.props.portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => Math.floor(total.get('totalInvested').reduce((acc, v) => acc + v, 0)),
        Nothing: () => 0
      });
  }

  render() {
    const {investment, currency} = this.props;
    const totalExposure = this.getTotalExposure();
    const totalPortfolioValue = this.getTotalPortfolioValue();
    const totalCash = this.getTotalCash();
    const totalInvested = this.getTotalInvested();
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
