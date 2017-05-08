import {handleActions} from 'redux-actions';
import {Map} from 'immutable';
import identity from 'folktale/core/lambda/identity';
import {SAVE_NEW_BROKER} from './brokerActions';
import AsyncData from '../core/AsyncData';

const handleSaveBroker = (state, {payload: brokerResult}) =>
  brokerResult.matchWith({
    Empty: identity,
    Loading: () => state.set('saveBrokerResult', brokerResult),
    Success: ({data: broker}) => state
      .set('saveBrokerResult', brokerResult)
      .set(['brokers', broker.id], broker),
    Failure: () => state.set('saveBrokerResult', brokerResult),
  });

const setBrokersList = (state, action) => state.set('brokers', action.payload);
const updateBroker = (state, action) => state.updateIn(['brokers', ], list => list.push(broker));

const BrokerData = Map({
  saveBrokerResult: AsyncData.Empty(),
  brokers: AsyncData.Empty()
});

export default handleActions({
  [SAVE_NEW_BROKER]: handleSaveBroker
}, BrokerData);

