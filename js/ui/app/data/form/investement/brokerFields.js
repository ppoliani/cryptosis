import {required} from '../validator';

export default [{
  type: 'text',
  name: 'name',
  label: 'Name',
  validate: [required]
}, {
  type: 'text',
  name: 'website',
  label: 'Website'
}, {
  type: 'email',
  name: 'email',
  label: 'Email'
}, {
  type: 'text',
  name: 'telephone',
  label: 'Telephone'
}, {
  type: 'textarea',
  name: 'notes',
  multiline: true,
  label: 'Notes',
  stretch: true
}];
