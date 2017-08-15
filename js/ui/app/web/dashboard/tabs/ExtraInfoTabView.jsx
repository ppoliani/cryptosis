import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Row, Col} from 'react-flexbox-grid'
import Widget from '../Widget'

class ExtraInfoTabView extends Component {
  getNewsWidget() {
    return (
      <Widget src='https://widgets.cryptocompare.com/serve/v1/coin/feed?fsym=BTC&tsym=GBP&feedType=CoinTelegraph'/>
    )
  }

  getPriceWidget() {
    return (
      <Widget src='https://widgets.cryptocompare.com/serve/v3/coin/chart?fsym=BTC&tsyms=USD,EUR,GBP'/>
    )
  }

  render() {
    return (
      <Col xs={12}>
        <Tabs>
          <Tab label='News'>
            {this.getNewsWidget()}
          </Tab>
          <Tab label='Price Analysis'>
            {this.getPriceWidget()}
          </Tab>
        </Tabs>
      </Col>
    )
  }
}


export default ExtraInfoTabView
