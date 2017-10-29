const {merge} = require('most');
const io = require('socket.io-client');
const {connect} = require('./cryptoCompare');

const priceStream$ = currency => connect(io, currency)

module.exports = {priceStream$};
