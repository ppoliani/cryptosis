const {combine, fromPromise} = require('most');
const io = require('socket.io-client');
const {fromJS, Map, List, is} = require('immutable');
const logger = require('../../common/core/logger');
const {connect} = require('../../common/sockets/cryptoCompare');
const Maybe = require('folktale/data/maybe');
const {getAllPartialInvestments} = require('../../common/data/investmentRepository');
const calculateTotalPortfolioValue = require('../../common/aggregators');
const {getPriceObjFromStreamData} = require('../../common/aggregators/common');
const {getInvestmentValues} = require('../../common/aggregators/investmentValues');

const createInvestmentReportObj = (percentage, investment) => investment.set('current', percentage)

const checkInvestmentLimit = (investment, prices) => {
  // getInvestmentValues expects a Map<InvestmentId, Investement>
  const investmentValue = getInvestmentValues(
    Map({[investment.get('id')]: investment}),
    prices
  );

  const percentage = investmentValue.getIn([investment.get('id'), 'percentage']);
  const lowerLimit = Number(investment.get('lowerLimit'));
  const upperLimit = Number(investment.get('upperLimit'));

  if(percentage <= lowerLimit) {
    return Maybe.Just(createInvestmentReportObj(percentage, investment));
  }
  else if(percentage >= upperLimit) {
    return Maybe.Just(createInvestmentReportObj(percentage, investment));
  }

  return Maybe.Nothing();
};

const checkLimits = ({investments, prices}) => investments.reduce(
  (acc, userInvestments, userId) => {
    const userWarnings = userInvestments.reduce(
      (warnings, investment) =>
        checkInvestmentLimit(investment, prices)
          .matchWith({
            Just: ({value}) => warnings.push(value),
            Nothing: () => warnings
          }),
      List()
    );

    return acc.set(userId, userWarnings)
  },
  Map()
)

const getInvestments = async unwrapCypherResult => {
  const actionResult = await getAllPartialInvestments();

  return unwrapCypherResult(actionResult)
    .matchWith({
      Just: ({value: investments}) => investments,
      Nothing: () => Map()
    });
}

const filterCurrency = (investments, currency, unwrapCypherListNodeResult, send) =>
  investments
    .map(
      i => i
        .update('investments', userInvestments =>
          unwrapCypherListNodeResult(userInvestments)
            .matchWith({
              Just: ({value: unwrapedInvestments}) => unwrapedInvestments.filter(v => v.get('currency') === currency),
              Nothing: () => userInvestments
            })
        )
        .get('investments')
    )

const start = async (currency, unwrapCypherResult, unwrapCypherListNodeResult, getAllPartialInvestments, send) => {
  try{
    const btc$ = connect(io, 'BTC', 'Coinfloor', currency);
    const eth$ = connect(io, 'ETH', 'Kraken', currency);
    const xrp$ = connect(io, 'XRP', 'Bitstamp', currency);

    const observer = {
      next: send,
      error: errorValue => console.log(`Error in the observer of the investment values stream: ${errorValue}`)
    }

    const getPrices = (investments, btc, eth, xrp) => ({
        investments: filterCurrency(investments, currency, unwrapCypherListNodeResult),
        prices: fromJS({
          BTX: getPriceObjFromStreamData(btc),
          ETH: getPriceObjFromStreamData(eth),
          XRP: getPriceObjFromStreamData(xrp)
        })
      })

    return combine(getPrices, fromPromise(getInvestments(unwrapCypherResult)), btc$, eth$, xrp$)
      .map(checkLimits)
      .skipRepeatsWith(is)
      .subscribe(observer);
  }
  catch(error) {
    logger.error(error);
  }
}

module.exports = {start};
