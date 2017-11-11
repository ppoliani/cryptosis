import {combineReducers} from 'redux'
import {reducer as reduxFormReducer} from 'redux-form'
import brokerReducer from '../broker/brokerReducer'
import assetReducer from '../asset/assetReducer'
import transactionReducer from '../transaction/transactionReducer'
import streamReducer from '../stream/streamReducer'
import portfolioReducer from '../portfolio/portfolioReducer'
import priceReducer from '../prices/priceReducer'
import profileReducer from '../profile/profileReducer'

export default combineReducers({
  form: reduxFormReducer,
  broker: brokerReducer,
  asset: assetReducer,
  transaction: transactionReducer,
  stream: streamReducer,
  portfolio: portfolioReducer,
  prices: priceReducer,
  userProfile: profileReducer
})
