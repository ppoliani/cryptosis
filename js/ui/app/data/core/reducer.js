import {combineReducers} from 'redux';
import {reducer as reduxFormReducer} from 'redux-form';
import brokerReducer from '../broker/brokerReducer';

export default combineReducers({
  form: reduxFormReducer,
  broker: brokerReducer
});
