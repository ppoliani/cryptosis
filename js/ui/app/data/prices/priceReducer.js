import {handleActions} from 'redux-actions';
import Maybe from 'folktale/maybe'
import {Map} from 'immutable';
import {SET_PRICES} from './priceActions';

const handleSetPrices = (state, action) => state.set('live', Maybe.fromNullable(action.payload));

const priceData = Map({
  live: Maybe.Nothing()
});

export default handleActions({
  [SET_PRICES]: handleSetPrices
}, priceData);
