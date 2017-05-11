import {handleActions} from 'redux-actions';
import {Map} from 'immutable';
import identity from 'folktale/core/lambda/identity';
import {GET_BROKERS, SAVE_NEW_BROKER} from './brokerActions';
import AsyncData from '../core/AsyncData';

const handleSetBrokers = (state, {payload: brokerResult}) =>
  brokerResult.matchWith({
    Empty: identity,
    Loading: () => state.set('fetchBrokersResult', brokerResult),
    Success: ({data}) =>  {
      return state
      .set('fetchBrokersResult', brokerResult)
      .updateIn(
        ['brokers'],
        brokers => brokers.concat(Map(data.result))
      )
    },
    Failure: () => state.set('fetchBrokersResult', brokerResult),
  });

const handleSaveBroker = (state, {payload: brokerResult}) =>
  brokerResult.matchWith({
    Empty: identity,
    Loading: () => state.set('saveBrokerResult', brokerResult),
    Success: ({data: broker}) => state
      .set('saveBrokerResult', brokerResult)
      .set(['brokers', broker.id], broker),
    Failure: () => state.set('saveBrokerResult', brokerResult),
  });

const setBrokersList = (state, {payload: brokers}) => state.set('brokers', brokers);
const updateBroker = (state, {payload: broker}) => state.updateIn(['brokers', broker.id], list => list.push(broker));

const BrokerData = Map({
  fetchBrokersResult: AsyncData.Empty(),
  saveBrokerResult: AsyncData.Empty(),
  brokers: Map()
});

export default handleActions({
  [GET_BROKERS]: handleSetBrokers,
  [SAVE_NEW_BROKER]: handleSaveBroker
}, BrokerData);

