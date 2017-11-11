import {required} from './validator'

export default [{
  type: 'text',
  name: 'name',
  label: 'Name',
  validate: [required]
}, {
  type: 'textarea',
  name: 'notes',
  label: 'Notes',
  stetch: true,
  multiline: true,
  content: 'Notes'
}]
