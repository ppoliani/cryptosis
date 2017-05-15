import {required, date, number} from '../validator';

const fields = [{
  type: 'date',
  name: 'date',
  label: 'Date',
  validate: [required]
}, {
  type: 'text',
  name: 'moneyInvested',
  label: 'Money Invested',
  validate: [required, number]
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
