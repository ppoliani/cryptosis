import React, {Component} from 'react';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {List, ListItem} from 'material-ui/List';
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
            const exposure = Math.floor(v);
            const currentValue = total.get('currentValue').get(k);
            const totalInvested = total.get('totalInvested').get(k);
            const totalCash = getTotalCashForType(portfolio, k, assetLife);
            const currentLiquidValue = totalCash + currentValue;
            const percentageChange = renderInvestmentChange(currentLiquidValue, totalInvested, currency);

            return (
              <div key={k}>
                <List>
                  <Subheader>{k}</Subheader>
                  <ListItem>Holdings: {getQtyForType(portfolio, k, assetLife)}</ListItem>
                  <ListItem>Total Cash: {renderPrice(totalCash, currency)}</ListItem>
                  <ListItem>Total Amount Invested: {renderPrice(totalInvested, currency)}</ListItem>
                  <ListItem>Exposure: {renderPrice(exposure, currency)}</ListItem>
                  <ListItem>Current Value: {renderPrice(currentValue, currency)}</ListItem>
                  <ListItem>Current Liquid Value(CLV): {renderPrice(currentLiquidValue, currency)}</ListItem>
                  <ListItem>Change: {percentageChange}</ListItem>
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
