const {merge} = require('most')
const io = require('socket.io-client')
const {connect} = require('./cryptoCompare')

const getFullSubscriptions = currency => [
  `2~Coinfloor~BTC~${currency}`,
  `2~Coinbase~BTC~${currency}`,
  `2~Kraken~BTC~${currency}`,
  `2~Coinfloor~BCH~${currency}`,
  `2~Kraken~BCH~${currency}`,
  `2~Coinbase~BCH~${currency}`,
  `2~Kraken~ETH~${currency}`,
  `2~Bitstamp~XRP~${currency}`,
  `2~Kraken~XRP~${currency}`,
  `2~HitBTC~XTZ~${currency}`,
  `2~BitTrex~VTC~BTC`,
  `2~BitTrex~BAT~BTC`,
  `2~BitTrex~BTG~BTC`,
  `2~BitTrex~ARK~BTC`,
  `2~BitTrex~OMG~BTC`,
  `2~BitTrex~NEO~BTC`,
  `2~BitTrex~XMR~BTC`
];

const getMajorSubscriptions = currency => [
  `2~Coinfloor~BTC~${currency}`,
  `2~Coinbase~BTC~${currency}`,
  `2~Kraken~BTC~${currency}`,
  `2~Kraken~ETH~${currency}`
];


const priceStream$ = currency => connect(io, getFullSubscriptions(currency)).multicast();
const majorPriceStream$ = currency => connect(io, getMajorSubscriptions(currency)).multicast();

module.exports = {priceStream$, majorPriceStream$};
