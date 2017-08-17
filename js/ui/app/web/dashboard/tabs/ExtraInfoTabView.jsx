import React, {Component} from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Row, Col} from 'react-flexbox-grid'
import pureComponent from '../../mixins/pureComponent'
import Widget from '../Widget'

const DEFAULT_ASSET = 'BTC';

@pureComponent
class ExtraInfoTabView extends Component {
  normalizeAsset() {
    const {currency, asset=DEFAULT_ASSET} = this.props;
    // TODO: we need to change btx to btc
    return asset === 'BTX' ? 'BTC' : asset;
  }

  getNewsWidget() {
    return (
      <Widget src={`https://widgets.cryptocompare.com/serve/v1/coin/feed?fsym=${this.normalizeAsset()}&tsym=${this.props.currency}&feedType=CoinTelegraph`}/>
    )
  }

  getPriceWidget() {
    return (
      <Widget src={`https://widgets.cryptocompare.com/serve/v3/coin/chart?fsym=${this.normalizeAsset()}&tsyms=GBP,EUR,USD`}/>
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
