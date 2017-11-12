import React, {Component} from 'react'
import {List} from 'material-ui/List'
import {Row, Col} from 'react-flexbox-grid'
import {autobind} from 'core-decorators'
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
  @autobind
  renderTotalValue({value}) {
    const totalPortfolioValue = value.getIn(['value', 'totalValue']);
    const exposure = value.getIn(['exposure', 'totalExposure']);
    const capitalGain = value.getIn(['capitalGain', 'totalValue']);

    // const capitalGain = renderCapitalGain([], currency)  value.get('totalValue')
    
    return (
      <Col xs={11} className='row-spacing'>
        <TitledBox color='primary' header='Value'>{renderPrice(totalPortfolioValue, this.props.currency)}</TitledBox>
      </Col>
    )
  }

  renderSummary() {
    return this.props.portfolioAgg.matchWith({
      Just: this.renderTotalValue,
      Nothing: () => []
    })
  }

  render() {
    const {transaction, currency} = this.props;
    // renderCapitalGain(10, currency)
    //   renderPrice(1000, currency)
    // const portfolioValue = getTotalPortfolioValue(portfolio);


    return (
      <Container title='Current' subtitle='Status'>
        <AsyncPanel asyncResult={transaction.get('fetchTxnsResult')}>
          <Row around='xs'>
            {this.renderSummary()}
            <Col xs={11} className='row-spacing'>
              <TitledBox color='primary' header='Capital Gain'>{10}</TitledBox>
            </Col>
          </Row>
        </AsyncPanel>
      </Container>
    )
  }
}

export default PortfolioSummary

