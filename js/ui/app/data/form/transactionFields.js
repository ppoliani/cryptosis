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
  type: 'text',
  name: 'quantity',
  label: 'Quantity',
  validate: [required, number]
}, {
  type: 'text',
  name: 'price',
  label: 'Price',
  validate: [required, number],
  stretch: true
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
    type: 'dropdown',
    name: 'broker',
    label: 'Broker',
    validate: [required],
    options: brokerOptions
  },
  {
    type: 'dropdown',
    name: 'sellAsset',
    label: 'Sell Currency',
    validate: [required],
    options: assetOptions
  },
  ...fields
]
