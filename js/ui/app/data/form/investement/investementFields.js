import {required, date, number} from '../validator';
import {currencyOptions} from '../../../data/constants/currencies';

const fields = [{
  type: 'date',
  name: 'date',
  label: 'Date',
  validate: [required]
}, {
  type: 'dropdown',
  name: 'currency',
  label: 'Currency',
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
  type: 'dropdown',
  name: 'assetLife',
  label: 'Asset Life',
  validate: [required],
  options: [{
    value: 'Long Term',
    text: 'Long Term Investment'
  }, {
    value: 'Short Term',
    text: 'Short Term Trading Position'
  }]
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
    name: 'investmentType',
    label: 'Investement Type',
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
];
