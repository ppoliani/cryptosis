const {merge} = require('most');
const io = require('socket.io-client');
const {connect} = require('./cryptoCompare');

const btc$ = currency => merge(
  connect(io, 'BTC', 'Coinfloor', currency),
  connect(io, 'BTC', 'Kraken', currency),
  connect(io, 'BTC', 'Coinbase', currency)
).startWith({});;

const bch$ = currency => merge(
  connect(io, 'BCH', 'Coinfloor', currency),
  connect(io, 'BCH', 'Kraken', currency),
  connect(io, 'BCH', 'Coinbase', currency)
).startWith({});;

const eth$ = currency => connect(io, 'ETH', 'Kraken', currency).startWith({MARKET: 'Kraken'});
const xrp$ = currency => connect(io, 'XRP', 'Bitstamp', currency).startWith({MARKET: 'Bitstamp'});
const xtz$ = currency => connect(io, 'XTZ', 'HitBTC', currency).startWith({MARKET: 'HitBTC'});;

module.exports = {btc$, bch$, eth$, xrp$, xtz$};
