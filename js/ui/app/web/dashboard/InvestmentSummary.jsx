import React, {Component} from 'react';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

export default class InvestmentSummary extends Component {
  getInvestmentRows() {
    return this.props.portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => total.get('totalAssets').map((v, k) => {
          return (
            <List key={k}>
               <Subheader>{k}</Subheader>
               <ListItem>Total Invested: £{Math.floor(v.toFixed(2))}</ListItem>
               <ListItem>Current Value: £{Math.floor(total.get('currentValue').get(k))}</ListItem>
            </List>
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
          <List>
            {this.getInvestmentRows()}
          </List>
        </AsyncPanel>
      </Container>
    )
  }
}
