import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Grid, Row, Col} from 'react-flexbox-grid';
import PortfolioChart from './PortfolioChart';
import PortfolioSummary from './PortfolioSummary';
import PriceSummary from './PriceSummary';
import InvestmentSummary from './InvestmentSummary';

export default class TabView extends Component {
  renderTab(label, assetLife) {
    const {currency, portfolio, investment, prices} = this.props;

    return (
      <Tab label={label}>
        <Row between='xs'>
          <Col lg={8} xs={12} className='row-spacing'>
            <PortfolioChart
              investment={investment}
              portfolio={portfolio}
              assetLife={assetLife} />
          </Col>
          <Col lg={4} xs={12}>
            <Col className='row-spacing'>
              <PriceSummary
                currency={currency}
                investment={investment}
                prices={prices}/>
            </Col>
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
