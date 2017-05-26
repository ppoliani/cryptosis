import React, {Component} from 'react';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {getPercentageChange} from '../../../../common/core/utils';
import {renderPrice} from '../common/InvestmentValueHelpers';

export default class InvestmentSummary extends Component {
  getInvestmentRows() {
    const {currency, portfolio} = this.props;

    return portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => total.get('totalAssets').map((v, k) => {
          const totalInvested = Math.floor(v);
          const current = Math.floor(total.get('currentValue').get(k));

          return (
            <div key={k}>
              <List>
                <Subheader>{k}</Subheader>
                <ListItem>Total Invested: {renderPrice(totalInvested, currency)}</ListItem>
                <ListItem>Current Value: {renderPrice(current, currency)}</ListItem>
                <ListItem>Value %: {getPercentageChange(totalInvested, current).toFixed(2)}%</ListItem>
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
