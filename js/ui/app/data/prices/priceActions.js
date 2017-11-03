import {createAction} from 'redux-actions'

export const SET_PRICES = 'PRICES::SET_PRICES'
export const SET_PRICE = 'PRICES::SET_PRICE'

export const setPrice = createAction(SET_PRICE)
export const setPrices = createAction(SET_PRICES)
