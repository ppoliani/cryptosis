import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Row, Col} from 'react-flexbox-grid'
import PortfolioSummary from './PortfolioSummary'
import InvestmentSummaryContainer from './investment/InvestmentSummaryContainer'
import ChartContainer from '../chart/ChartContainer'
import AssetAllocationContainer from '../chart/AssetAllocationContainer'
import './tab.scss'

export default class TabView extends Component {
  renderTab(label, assetLife) {
    const {currency, portfolio, investment, prices} = this.props;
    const lastNDaysData = portfolio.getIn(['last30Days', assetLife]);
    const totalValue = portfolio.getIn(['total', assetLife])

    return (
      <Tab label={label}>
        <Row between='xs'>
          <Col lg={8} xs={12} className='row-spacing'>
            <Col className='row-spacing'>
              <ChartContainer lastNDaysData={lastNDaysData} />
            </Col>
          </Col>
          <Col lg={4} xs={12} className='row-spacing'>
            <Col className='row-spacing'>
              <AssetAllocationContainer totalValue={totalValue} />
            </Col>
          </Col>
        </Row>
        <Row between='xs'>
          <Col lg={8} xs={12} className='row-spacing news-feed-container'>
            <Col className='row-spacing'>
              News Feed
            </Col>
          </Col>
          <Col lg={4} xs={12} className='row-spacing'>
            <Col className='row-spacing'>
              <PortfolioSummary
                currency={currency}
                portfolio={portfolio}
                investment={investment}
                assetLife={assetLife} />
            </Col>
            <Col>
              <InvestmentSummaryContainer assetLife={assetLife} />
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
