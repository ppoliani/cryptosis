import {required, date, number} from '../validator'
import {currencyOptions} from '../../../data/constants/currencies'

const fields = [{
  type: 'date',
  name: 'date',
  label: 'Date',
  validate: [required]
}, {
  type: 'dropdown',
  name: 'currency',
  label: 'Sell Currency',
  validate: [required],
  options: currencyOptions
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

export default (brokerOptions, investmentTypesOptions) => [
  {
    type: 'dropdown',
    name: 'buyCurrency',
    label: 'Buy Currency',
    validate: [required],
    options: brokerOptions
  }, {
    type: 'dropdown',
    name: 'broker',
    label: 'Broker',
    validate: [required],
    options: investmentTypesOptions
  },
  ...fields
]
