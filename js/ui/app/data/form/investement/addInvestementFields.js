import {required, date} from '../validator';

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
  validate: [required]
}, {
  type: 'text',
  name: 'expenses',
  label: 'Expenses',
  validate: [required]
}, {
  type: 'text',
  name: 'quantity',
  label: 'Quantity',
  validate: [required]
}, {
  type: 'text',
  name: 'price',
  label: 'Price',
  validate: [required],
  stretch: true
}, {
  type: 'textarea',
  name: 'notes',
  content: 'Notes',
  validate: [required],
  stretch: true
}];
