import {handleActions} from 'redux-actions';
import {Map} from 'immutable';
import identity from 'folktale/core/lambda/identity';
import {SAVE_NEW_POSITION} from './positionActions';
import AsyncData from '../core/AsyncData';

const handleSavePosition = (state, {payload: savePositionResult}) =>
  savePositionResult.matchWith({
    Empty: identity,
    Loading: () => state.set('savePositionResult', savePositionResult),
    Success: ({data: position}) => state
      .set('savePositionResult', savePositionResult)
      .set(['positions', position.id], position),
    Failure: () => state.set('savePositionResult', savePositionResult),
  });

const setPositionList = (state, {payload: positions}) => state.set('positions', positions);
const updatePosition = (state, {payload: position}) => state.updateIn(['positions', position.id], list => list.push(position));

const PositionData = Map({
  savePositionResult: AsyncData.Empty(),
  positions: AsyncData.Empty()
});

export default handleActions({
  [SAVE_NEW_POSITION]: handleSavePosition
}, PositionData);

