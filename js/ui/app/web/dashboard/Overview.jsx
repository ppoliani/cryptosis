import React, {Component} from 'react';
import {merge} from 'most';
import {connect} from '../../sockets/cryptoCompare';

export default class Overview extends Component {
  componentDidMount() {
    const btc$ = connect('BTC', 'Coinfloor')
    const eth$ = connect('ETH', 'Kraken');

    merge(btc$, eth$)
      .map(v => ({
        price: v.PRICE,
        market: v.MARKET,
        symbol: v.FROMSYMBOL
      }))
      .forEach(values => {
        console.log(values);
      })
  }
  render() {
    return (
      <p>Dashboard</p>
    );
  }
}
