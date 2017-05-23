import React, {Component} from 'react';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {List, ListItem} from 'material-ui/List';

export default class PriceSummary extends Component {
  render() {
    const {investment, prices} = this.props;

    return (
      <Container title='Prices' subtitle='Live'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <List>
            {
              prices.get('live').matchWith({
                Just: ({value: prices}) => prices.map((v, k, i) => {
                  return <ListItem key={k}>{k}: {v.get('price')}</ListItem>
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
