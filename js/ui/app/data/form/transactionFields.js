import {required, date, number} from './validator'
import {currencyOptions} from '../constants/currencies'

const fields = [{
  type: 'date',
  name: 'date',
  label: 'Date',
  validate: [required]
}, {
  type: 'text',
  name: 'expenses',
  label: 'Expenses',
  validate: [required, number]
}, {
  type: 'textarea',
  name: 'notes',
  multiline: true,
  label: 'Notes',
  stretch: true
}];

export default (brokerOptions, assetOptions) => [
  {
    type: 'dropdown',
    name: 'buyAsset',
    label: 'Buy Currency',
    validate: [required],
    options: assetOptions
  }, {
    type: 'text',
    name: 'buyAmount',
    label: 'Buy Amount',
    validate: [required, number]
  },
  {
    type: 'dropdown',
    name: 'sellAsset',
    label: 'Sell Currency',
    validate: [required],
    options: assetOptions
  },
  {
    type: 'text',
    name: 'sellAmount',
    label: 'Sell Amount',
    validate: [required, number]
  },
  {
    type: 'dropdown',
    name: 'broker',
    label: 'Broker',
    validate: [required],
    options: brokerOptions
  },
  ...fields
]
