import {combineReducers} from 'redux';
import {reducer as reduxFormReducer} from 'redux-form';
import brokerReducer from '../broker/brokerReducer';
import investmentReducer from '../investment/investmentReducer';

export default combineReducers({
  form: reduxFormReducer,
  broker: brokerReducer,
  investment: investmentReducer
});
