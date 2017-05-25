const {start} = require('../jobs/limitNotifier');
const {unwrapCypherResult} = require('../../common/data/utils');
const {getAllPartialInvestments} = require('../../common/data/investmentRepository');

start(unwrapCypherResult, getAllPartialInvestments);
