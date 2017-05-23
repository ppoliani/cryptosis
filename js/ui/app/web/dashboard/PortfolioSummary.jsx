import React, {Component} from 'react';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {List, ListItem} from 'material-ui/List';

export default class PortfolioSummary extends Component {
  getPercentageChange(initial, current) {
    return (current - initial) / initial * 100;
  }

  getTotalInvested() {
    return this.props.portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => Math.floor(total.get('totalAssets').reduce((acc, v) => acc + v, 0)),
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


  render() {
    const {investment} = this.props;
    const totalInvested = this.getTotalInvested();
    const totalPortfolioValue = this.getTotalPortfolioValue();

    return (
      <Container title='Portfolio' subtitle='Aggregates'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <List>
            <ListItem primaryText={`Total Invested: £${totalInvested}`} />
            <ListItem primaryText={`Total Portfolio Value: £${totalPortfolioValue}`} />
            <ListItem primaryText={`Change: £${totalPortfolioValue - totalInvested}`} />
            <ListItem primaryText={`Change (%): ${this.getPercentageChange(totalInvested, totalPortfolioValue).toFixed(2)}%`} />
          </List>
        </AsyncPanel>
      </Container>
    )
  }
}
