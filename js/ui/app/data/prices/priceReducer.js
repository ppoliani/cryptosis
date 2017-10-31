import {handleActions} from 'redux-actions'
import Maybe from 'folktale/maybe'
import {Map} from 'immutable'
import {SET_PRICES} from './priceActions'

const handleSetPrices = (state, {payload}) => state.set(payload.get('symbol'), payload); 
 
const priceData = Map();
 
export default handleActions({
  [SET_PRICES]: handleSetPrices
}, priceData)
