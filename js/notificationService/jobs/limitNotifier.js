const {combine, merge, fromPromise} = require('most');
const {fromJS, Map, List, is} = require('immutable');
const logger = require('../../common/core/logger');
const {btc$, eth$, xrp$, xtz$} = require('../../common/sockets/streams');
const Maybe = require('folktale/data/maybe');
const {getAllPartialInvestments} = require('../../common/data/repositories/investmentRepository');
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

    return combine(getPrices, fromPromise(getInvestments(unwrapCypherResult)), btc$(currency), eth$(currency), xrp$(currency))
      .map(checkLimits)
      .skipRepeatsWith(is)
      .subscribe(observer);
  }
  catch(error) {
    logger.error(error);
  }
}

module.exports = {start};
