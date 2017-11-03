import {handleActions} from 'redux-actions'
import Maybe from 'folktale/maybe'
import {Map} from 'immutable'
import {SET_PRICE, SET_PRICES} from './priceActions'


const handleSetPrice = (state, {payload}) => state.set(payload.get('symbol'), payload); 
const handleSetPrices = (state, {payload}) => payload; 
 
const priceData = Map();
 
export default handleActions({
  [SET_PRICE]: handleSetPrice,
  [SET_PRICES]: handleSetPrices
}, priceData)
