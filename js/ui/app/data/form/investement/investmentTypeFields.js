import {required} from '../validator';

export default [{
  type: 'text',
  name: 'name',
  label: 'Name',
  validate: [required]
}, {
  type: 'dropdown',
  name: 'type',
  label: 'Type',
  validate: [required],
  options: [{
    value: 'equity',
    text: 'Equity'
  }, {
    value: 'debt',
    text: 'Debt'
  }]
}, {
  type: 'textarea',
  name: 'notes',
  label: 'Notes',
  stetch: true,
  multiline: true,
  content: 'Notes'
}];
