import React, {Component} from 'react';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {List} from 'material-ui/List';
import ListItem from '../common/ListItem';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {getPercentageChange} from '../../../../common/core/utils';
import {renderInvestmentChange} from '../common/InvestmentValueHelpers';
import {renderPrice} from '../common/InvestmentValueHelpers';
import {getTotalCashForType, getQtyForType} from '../../../../common/metrics/portfolio';

export default class InvestmentSummary extends Component {
  getInvestmentRows() {
    const {currency, portfolio, assetLife} = this.props;

    return portfolio
      .getIn(['total', assetLife])
      .matchWith({
        Just: ({value: total}) => total.get('totalExposure')
          .map((v, k) => {
            const exposure = v;
            const holdings = getQtyForType(portfolio, k, assetLife);
            const currentValue = total.get('currentValue').get(k);
            const totalInvested = total.get('totalInvested').get(k);
            const totalCash = getTotalCashForType(portfolio, k, assetLife);
            const percentageChange = renderInvestmentChange(currentValue, exposure, currency);

            return (
              <div key={k}>
                <List>
                  <Subheader>{k}</Subheader>
                  <ListItem first='Holdings' second={holdings} />
                  <ListItem first='Exposure' second={renderPrice(exposure, currency)} />
                  <ListItem first='Total Cash' second={renderPrice(totalCash, currency)} />
                  <ListItem first='Total Amount Invested' second={renderPrice(totalInvested, currency)} />
                  <ListItem first='Current Value' second={renderPrice(currentValue, currency)} />
                  <ListItem first='Safe Sell Price' second={renderPrice(exposure / holdings, currency)} />
                  <ListItem first='Change' second={percentageChange} />
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
