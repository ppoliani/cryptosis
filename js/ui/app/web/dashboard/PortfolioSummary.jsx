import React, {Component} from 'react';
import {List} from 'material-ui/List';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import ListItem from '../common/ListItem';
import {renderPrice} from '../common/InvestmentValueHelpers';
import {renderInvestmentChange} from '../common/InvestmentValueHelpers';
import {getPercentageChange} from '../../../../common/core/utils';
import {
  getTotalExposure,
  getTotalPortfolioValue,
  getTotalCash,
  getTotalInvested
} from '../../../../common/metrics/portfolio';

export default class PortfolioSummary extends Component {
  render() {
    const {investment, currency, portfolio, assetLife} = this.props;
    const totalExposure = getTotalExposure(portfolio, assetLife);
    const totalPortfolioValue = getTotalPortfolioValue(portfolio, assetLife);
    const totalCash = getTotalCash(portfolio, assetLife);
    const totalInvested = getTotalInvested(portfolio, assetLife);
    const currentLiquidValue = totalCash + totalPortfolioValue;
    const percentageChange = renderInvestmentChange(currentLiquidValue, totalInvested, currency);

    return (
      <Container title='Portfolio' subtitle='Aggregates'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <List>
            <ListItem first='Exposure' second={renderPrice(totalExposure, currency)} />
            <ListItem first='Total Cash' second={renderPrice(totalCash, currency)} />
            <ListItem first='Total Amount Invested' second={renderPrice(totalInvested, currency)} />
            <ListItem first='Portfolio Value' second={renderPrice(totalPortfolioValue, currency)} />
            <ListItem first='Current Liquid Value(CLV)' second={renderPrice(currentLiquidValue, currency)} />
            <ListItem first='Change' second={percentageChange} />
          </List>
        </AsyncPanel>
      </Container>
    )
  }
}
