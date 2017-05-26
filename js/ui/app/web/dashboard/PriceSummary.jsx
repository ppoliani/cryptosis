import React, {Component} from 'react';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {List, ListItem} from 'material-ui/List';
import {renderPrice} from '../common/InvestmentValueHelpers';

export default class PriceSummary extends Component {
  render() {
    const {investment, currency, prices} = this.props;

    return (
      <Container title='Prices' subtitle='Live'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <List>
            {
              prices.get('live').matchWith({
                Just: ({value: prices}) => prices.map((v, k, i) => {
                  return <ListItem key={k}>{k}: {renderPrice(v.get('price'), currency)}</ListItem>
                })
                .toList()
                .toJS(),
                Nothing: () => {}
              })
            }
          </List>
        </AsyncPanel>
      </Container>
    )
  }
}
