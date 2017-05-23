import {combineReducers} from 'redux';
import {reducer as reduxFormReducer} from 'redux-form';
import brokerReducer from '../broker/brokerReducer';
import investmentReducer from '../investment/investmentReducer';
import streamReducer from '../stream/streamReducer';
import portfolioReducer from '../portfolio/portfolioReducer';
import priceReducer from '../prices/priceReducer';

export default combineReducers({
  form: reduxFormReducer,
  broker: brokerReducer,
  investment: investmentReducer,
  stream: streamReducer,
  portfolio: portfolioReducer,
  prices: priceReducer
});
