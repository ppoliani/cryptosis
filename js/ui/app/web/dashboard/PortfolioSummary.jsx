import React, {Component} from 'react'
import {List} from 'material-ui/List'
import {Row, Col} from 'react-flexbox-grid'
import Container from '../common/Container'
import AsyncPanel from '../panel/AsyncPanel'
import {renderPrice, renderCapitalGain} from '../common/TransactionHelpers'
import TitledBox from '../box/TitledBox'
import { 
  getTotalExposure,
  getTotalPortfolioValue,
  getTotalCash,
  getTotalInvested,
  getCapitalGain
} from '../../../../common/metrics/portfolio'

class PortfolioSummary extends Component {
  render() {
    const {investment, currency, portfolio} = this.props;
    const portfolioValue = getTotalPortfolioValue(portfolio);
    const exposure = getTotalExposure(portfolio);
    const totalCash = getTotalCash(portfolio);
    const totalInvested = getTotalInvested(portfolio);

    return (
      <Container title='Current' subtitle='Status'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <Row around='xs'>
            <Col xs={5} className='row-spacing'>
              <TitledBox color='primary' header='Exposure'>{renderPrice(exposure, currency)}</TitledBox>
            </Col>
            <Col xs={5} className='row-spacing'>
              <TitledBox color='primary' header='Cash'>{renderPrice(totalCash, currency)}</TitledBox>
            </Col>
          </Row>
          <Row around='xs'>
            <Col xs={5} className='row-spacing'>
              <TitledBox color='primary' header='Total Value'>{renderPrice(portfolioValue, currency)}</TitledBox>
            </Col>
            <Col xs={5} className='row-spacing'>
              <TitledBox color='primary' header='Total Invested'>{renderPrice(totalInvested, currency)}</TitledBox>
            </Col>
          </Row>
          <Row around='xs'>
            <Col xs={11} className='row-spacing'>
              <TitledBox color='primary' header='Capital Gain'>{renderCapitalGain(getCapitalGain(portfolio), currency)}</TitledBox>
            </Col>
          </Row>
        </AsyncPanel>
      </Container>
    )
  }
}

export default PortfolioSummary

