import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Row, Col} from 'react-flexbox-grid'
import PortfolioSummary from './PortfolioSummary'
import InvestmentSummary from './InvestmentSummary'
import ChartContainer from '../chart/ChartConainer'

export default class TabView extends Component {
  renderTab(label, assetLife) {
    const {currency, portfolio, investment, prices} = this.props;
    const lastNDaysData = portfolio.getIn(['last30Days', assetLife]);

    return (
      <Tab label={label}>
        <Row between='xs'>
          <Col lg={8} xs={12} className='row-spacing'>
            <ChartContainer lastNDaysData={lastNDaysData} />
          </Col>
          <Col lg={4} xs={12}>
            <Col className='row-spacing'>
              <PortfolioSummary
                currency={currency}
                portfolio={portfolio}
                investment={investment}
                assetLife={assetLife} />
            </Col>
            <Col>
              <InvestmentSummary
                currency={currency}
                investment={investment}
                portfolio={portfolio}
                assetLife={assetLife}/>
            </Col>
          </Col>
        </Row>
      </Tab>
    )
  }

  render() {
    return (
      <Col xs={12}>
        <Tabs>
          {this.renderTab('Long Term', 'longTerm')}
          {this.renderTab('Short Term', 'shortTerm')}
        </Tabs>
      </Col>
    )
  }
}
