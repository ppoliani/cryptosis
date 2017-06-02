import React, {Component} from 'react';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {List} from 'material-ui/List';
import ListItem from '../common/ListItem';
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
                  return <ListItem key={k} first={k} second={renderPrice(v.get('price'), currency)}/>
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
