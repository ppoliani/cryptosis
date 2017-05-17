import {fromJS} from 'immutable';
import {create} from '@most/create'
import curry from 'folktale/core/lambda/curry';
import compose from 'folktale/core/lambda/compose'
import {partial} from '../../helpers/fn';
import {getTotalForInvestment, getCurrentTotalForInvestment} from './common';


const getInvestmentValue = curry(2, (currentPrice, investment) =>
  getCurrentTotalForInvestment(investment, currentPrice) - getTotalForInvestment(investment));

const getCurrentPrice = (prices, investment) => prices.getIn([investment.get('investmentType')], 'price');

export const calculateInvestmentValues = ({investments, prices}) =>
  create((add, end, error) => {
    add(investments.map(
      investment => compose(getInvestmentValue, partial(getCurrentPrice, prices))(investment)(investment)
    ));
    end();

    return () => console.log('Unsubscribe calculateTotalPortfolioValue');
  });
