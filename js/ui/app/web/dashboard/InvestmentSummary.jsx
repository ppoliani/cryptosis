import React, {Component} from 'react';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

export default class InvestmentSummary extends Component {
  getPercentageChange(initial, current) {
    return (current - initial) / initial * 100;
  }

  getInvestmentRows() {
    return this.props.portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => total.get('totalAssets').map((v, k) => {
          const totalInvested = Math.floor(v);
          const current = Math.floor(total.get('currentValue').get(k));

          return (
            <div key={k}>
              <List>
                <Subheader>{k}</Subheader>
                <ListItem>Total Invested: £{totalInvested}</ListItem>
                <ListItem>Current Value: £{current}</ListItem>
                <ListItem>Value %: {this.getPercentageChange(totalInvested, current).toFixed(2)}%</ListItem>
              </List>
              <Divider />
            </div>
          )
        })
        .toList()
        .toJS(),
        Nothing: () => 0
      });
  }

  render() {
    const {portfolio, investment} = this.props;

    return (
      <Container title='Investment' subtitle='Summary'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          {this.getInvestmentRows()}
        </AsyncPanel>
      </Container>
    )
  }
}
