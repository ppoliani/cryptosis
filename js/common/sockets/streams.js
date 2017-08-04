const {merge} = require('most');
const io = require('socket.io-client');
const {connect} = require('./cryptoCompare');

const btc$ = currency => merge(
  connect(io, 'BTC', 'Coinfloor', currency),
  connect(io, 'BTC', 'Kraken', currency),
  connect(io, 'BTC', 'Coinbase', currency)
);
const eth$ = currency => connect(io, 'ETH', 'Kraken', currency);
const xrp$ = currency => connect(io, 'XRP', 'Bitstamp', currency);
const xtz$ = currency => connect(io, 'XTZ', 'HitBTC', currency);

module.exports = {btc$, eth$, xrp$, xtz$};
