import {handleActions} from 'redux-actions';
import {Map, fromJS} from 'immutable';
import identity from 'folktale/core/lambda/identity';
import {GET_BROKERS, SAVE_NEW_BROKER, UPDATE_BROKER, DELETE_BROKER} from './brokerActions';
import AsyncData from '../core/AsyncData';

const handleSetBrokers = (state, {payload: brokerResult}) =>
  brokerResult.matchWith({
    Empty: identity,
    Loading: () => state.set('fetchBrokersResult', brokerResult),
    Success: ({data}) => state
      .set('fetchBrokersResult', brokerResult)
      .set('brokers', fromJS(data.result)),
    Failure: () => state.set('fetchBrokersResult', brokerResult),
  });

const handleSaveBroker = (state, {payload: brokerResult}) =>
  brokerResult.matchWith({
    Empty: identity,
    Loading: () => state.set('saveBrokerResult', brokerResult),
    Success: ({data: {result: [result]}}) => state
      .set('saveBrokerResult', brokerResult)
      .updateIn(['brokers'], brokers => brokers.set(result.id, fromJS(result))),
    Failure: () => state.set('saveBrokerResult', brokerResult),
  });

const handleDeleteBroker = (state, {payload: brokerResult}) =>
  brokerResult.matchWith({
    Empty: identity,
    Loading: () => state.set('deleteBrokerResult', brokerResult),
    Success: ({data: {result}}) => state
      .set('deleteBrokerResult', brokerResult)
      .updateIn(['brokers'], brokers => brokers.delete(result.id)),
    Failure: () => state.set('deleteBrokerResult', brokerResult),
  });

const BrokerData = Map({
  fetchBrokersResult: AsyncData.Empty(),
  saveBrokerResult: AsyncData.Empty(),
  deleteBrokerResult: AsyncData.Empty(),
  brokers: Map()
});

export default handleActions({
  [GET_BROKERS]: handleSetBrokers,
  [SAVE_NEW_BROKER]: handleSaveBroker,
  [UPDATE_BROKER]: handleSaveBroker,
  [DELETE_BROKER]: handleDeleteBroker
}, BrokerData);

