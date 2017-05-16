import {Map, List, fromJS} from 'immutable';
import {create} from '@most/create'
import isBefore from 'date-fns/is_before'
import {async, Subject} from 'most-subject';

const getTotalForInvestment = i => i.get('price') * i.get('quantity');

const calculateTotalPerType = investments =>
  investments.reduce(
    (acc, v) => acc.update(
      v.get('investmentType'),
      0,
      sum => sum + getTotalForInvestment(v)
    ),
    Map()
  )

const getCurrentTotalForInvestment = (investment, currentPrice) => investment.get('quantity') * currentPrice;

const calculateCurrentValuePerType = (investments, prices) =>
  investments.reduce(
    (acc, v) => {
      const type = v.get('investmentType');
      return acc.update(
        type,
        0,
        sum => sum + getCurrentTotalForInvestment(v, prices[type].price)
      )
    },
    Map()
  )

export const calculateTotalPortfolioValue = ({investments, prices}) =>
  create((add, end, error) => {
    add(fromJS({
      totalAssets: calculateTotalPerType(investments),
      currentValue: calculateCurrentValuePerType(investments, prices)
    }));
    end();

    return () => console.log('Unsubscribe calculateTotalPortfolioValue');
  });

// we need to find the total portfolio value on the given date.
// Investments that didn't exist on that date should not contribute to the figure
const getTotalValueAfterDate = (investments, symbol, date, priceOfDay) =>
  investments
    .filter(i => i.get('investmentType') === symbol && isBefore(i.get('date'), date))
    .reduce(
      (sum, investment) => sum + (getCurrentTotalForInvestment(investment, priceOfDay) - getTotalForInvestment(investment)),
      0
    );

// Gets all prices for the last 30 days for the given symbol i.e. ETH
// and returns the protfilio values for each day
const getPortfolioValueForSymbol = (priceList, investments, symbol) =>
  priceList.map(p => {
    const {day, price} = p.toJS();
    return Map({
      day,
      value: getTotalValueAfterDate(investments, symbol, day, price)
    })
  })

// returns a Map with keys for each symbol and the entries
// for each day as long as the portfolio value on that date
// e.g. { ETH: [{day: 123, value: 2000}], BTC:  [{day: 123, value: 2000}]}
export const calculateHistoricPortfolioValues = ({investments, prices}) =>
  create((add, end, error) => {
    const result = prices.reduce(
      (acc, priceList, symbol) => acc.set(
        symbol,
        getPortfolioValueForSymbol(priceList, investments, symbol)
      ),
      Map()
    )

    add(result);
    end();

    return () => console.log('Unsubscribe calculateHistoricPortfolioValues');
  });
