const {merge} = require('most');
const io = require('socket.io-client');
const {connect} = require('./cryptoCompare');

const btc$ = currency => merge(
  connect(io, 'BTC', 'Coinfloor', currency),
  connect(io, 'BTC', 'Kraken', currency),
  connect(io, 'BTC', 'Coinbase', currency)
)

const bch$ = currency => merge(
  connect(io, 'BCH', 'Coinfloor', currency),
  connect(io, 'BCH', 'Kraken', currency),
  connect(io, 'BCH', 'Coinbase', currency)
);

const eth$ = currency => connect(io, 'ETH', 'Kraken', currency);

const xrp$ = () => merge(
  connect(io, 'XRP', 'Bitstamp', 'EUR'),
  connect(io, 'XRP', 'Kraken', 'USD')
);

const xtz$ = () => connect(io, 'XTZ', 'HitBTC', 'USD');

module.exports = {btc$, bch$, eth$, xrp$, xtz$};
