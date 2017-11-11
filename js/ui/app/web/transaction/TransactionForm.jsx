import React from 'react'
import parse from 'date-fns/parse'
import createForm from '../form/formBuilder'
import getFields from '../../data/form/transactionFields'
import '../form/form.scss'

const setDateObj = values => { 
  if(!values) return values;
  values.date = parse(values.date || new Date())
  return values;
}

export default (brokerOptions, assetOptions, values) => createForm(
  'transactionForm',
  1,
  getFields(brokerOptions, assetOptions),
  setDateObj(values)
)
