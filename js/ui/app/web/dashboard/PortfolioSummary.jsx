import React, {Component} from 'react'
import {List} from 'material-ui/List'
import {Row, Col} from 'react-flexbox-grid'
import {autobind} from 'core-decorators'
import Container from '../common/Container'
import AsyncPanel from '../panel/AsyncPanel'
import {renderPrice, renderCapitalGain} from '../common/TransactionHelpers'
import TitledBox from '../box/TitledBox'
import {calculatePercentageChange} from '../../../../common/aggregators/utils'

class PortfolioSummary extends Component {
  @autobind 
  renderTotalValue({value}) {
    const {currency} = this.props;
    const totalPortfolioValue = value.getIn(['value', 'totalValue']);
    const exposure = value.getIn(['exposure', 'totalExposure']);
    const capitalGain = value.getIn(['capitalGain', 'totalValue']);
    const percChange = calculatePercentageChange(exposure, capitalGain);

    return (
      <Row around='xs'>
        <Col key={0} xs={11} className='row-spacing'>
          <TitledBox color='primary' header='Value'>{renderPrice(totalPortfolioValue, currency)}</TitledBox>
        </Col>
        <Col key={1} xs={11} className='row-spacing'>
          <TitledBox color='primary' header='Capital Gain'>{renderCapitalGain([capitalGain,percChange], currency)}</TitledBox>
        </Col>
      </Row>
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

    return (
      <Container title='Portfolio' subtitle='Overview'>
        <AsyncPanel asyncResult={transaction.get('fetchTxnsResult')}>
          {this.renderSummary()}
        </AsyncPanel>
      </Container>
    )
  }
}

export default PortfolioSummary

