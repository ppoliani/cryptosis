import React, {Component} from 'react'
import {List} from 'material-ui/List'
import {Grid, Row, Col} from 'react-flexbox-grid'
import Container from '../common/Container'
import AsyncPanel from '../panel/AsyncPanel'
import ListItem from '../list/ListItem'
import {renderPrice} from '../common/InvestmentValueHelpers'
import {renderInvestmentChange} from '../common/InvestmentValueHelpers'
import {getPercentageChange} from '../../../../common/core/utils'
import TitledBox from '../box/TitledBox'
import {
  getTotalExposure,
  getTotalPortfolioValue,
  getTotalCash,
  getTotalInvested
} from '../../../../common/metrics/portfolio'

export default class PortfolioSummary extends Component {
  render() {
    const {investment, currency, portfolio, assetLife} = this.props;
    const portfolioValue = getTotalPortfolioValue(portfolio, assetLife);
    const exposure = getTotalExposure(portfolio, assetLife);

    return (
      <Container title='Current' subtitle='Status'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <Row around='xs'>
            <Col xs={5} className='row-spacing'>
              <TitledBox color='primary' header='Exposure'>{renderPrice(exposure, currency)}</TitledBox>
            </Col>
            <Col xs={5} className='row-spacing'>
              <TitledBox color='primary' header='Cash'>{renderPrice(getTotalCash(portfolio, assetLife), currency)}</TitledBox>
            </Col>
          </Row>
          <Row around='xs'>
            <Col xs={5} className='row-spacing'>
              <TitledBox color='primary' header='Total Value'>{renderPrice(portfolioValue, currency)}</TitledBox>
            </Col>
            <Col xs={5} className='row-spacing'>
              <TitledBox color='primary' header='Total Invested'>{renderPrice(getTotalInvested(portfolio, assetLife), currency)}</TitledBox>
            </Col>
          </Row>
          <Row around='xs'>
            <Col xs={11} className='row-spacing'>
              <TitledBox color='primary' header='Profit/Loss'>{renderInvestmentChange(portfolioValue, exposure, currency)}</TitledBox>
            </Col>
          </Row>
        </AsyncPanel>
      </Container>
    )
  }
}
