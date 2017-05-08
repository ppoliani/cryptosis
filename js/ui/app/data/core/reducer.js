import {combineReducers} from 'redux';
import {reducer as reduxFormReducer} from 'redux-form';
import brokerReducer from '../broker/brokerReducer';
import positionReducer from '../position/positionReducer';

export default combineReducers({
  form: reduxFormReducer,
  broker: brokerReducer,
  position: positionReducer
});
