import {required, date, number} from '../validator';

export default [{
  type: 'text',
  name: 'investmentType',
  label: 'Investement Type',
  validate: [required]
}, {
  type: 'text',
  name: 'broker',
  label: 'Broker',
  validate: [required]
}, {
  type: 'text',
  name: 'date',
  label: 'dd/mm/yyyy',
  validate: [required, date]
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
  content: 'Notes',
  validate: [required],
  stretch: true
}];
