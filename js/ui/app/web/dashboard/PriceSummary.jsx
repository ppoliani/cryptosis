import React, {Component} from 'react';
import Container from '../common/Container';
import AsyncPanel from '../panel/AsyncPanel';
import {List} from 'material-ui/List';
import ListItem from '../list/ListItem';
import {renderPrice} from '../common/InvestmentValueHelpers';

export default class PriceSummary extends Component {
  renderFullPriceInfo(value, currency) {
    return <span>
      <span>{renderPrice(value.get('price'), currency)}</span>
      <span> ({value.get('market')})</span>
    </span>
  }

  render() {
    const {investment, currency, prices} = this.props;

    return (
      <Container title='Prices' subtitle='Live'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <List>
            {
              prices.get('live').matchWith({
                Just: ({value: prices}) => prices.map((v, k, i) => (
                  <ListItem key={k} first={k} second={this.renderFullPriceInfo(v, currency)}/>
                ))
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
