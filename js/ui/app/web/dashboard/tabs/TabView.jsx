import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Row, Col} from 'react-flexbox-grid'
import PortfolioSummary from '../PortfolioSummary'
import InvestmentSummaryContainer from '../investment/InvestmentSummaryContainer'
import ChartContainer from '../../chart/ChartContainer'
import AssetAllocationContainer from '../../chart/AssetAllocationContainer'
import ExtraInfoTabView from './ExtraInfoTabView'
import './tab.scss'

export default class TabView extends Component {
  render() {
    const {currency, asset, portfolio, investment} = this.props;
    const lastNDaysData = portfolio.get('last30Days');
    const totalValue = portfolio.get('total');

    return (
      <Col xs={12}>
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
              {/* <ExtraInfoTabView
                currency={currency}
                asset={asset}/> */}
            </Col>
          </Col>
          <Col lg={4} xs={12} className='row-spacing'>
            <Col className='row-spacing'>
              <PortfolioSummary
                currency={currency}
                portfolio={portfolio}
                investment={investment} />
            </Col>
            <Col>
              <InvestmentSummaryContainer />
            </Col>
          </Col>
        </Row>
      </Col>
    )
  }
}
