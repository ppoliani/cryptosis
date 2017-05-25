const combine = require('most');
const fromJS = require('immutable');
const logger = require('../../common/core/logger');
const connect = require('../../common/sockets/cryptoCompare');
const calculateTotalPortfolioValue = require('../../common/aggregators');


const start = async (unwrapCypherResult, getAllPartialInvestments) => {
  const actionResult = await getAllPartialInvestments();

  unwrapCypherResult(actionResult)
    .matchWith({
      Just: ({value}) => {
        console.log(value)
      },
      Nothing: () => {
        logger.info('No investements found');
      }
    });
}

module.exports = {start};
