import React from 'react'
import createForm from '../form/formBuilder'
import fields from '../../data/form/brokerFields' 
import '../form/form.scss'

export default values => createForm('brokerForm', 1, fields, values)
  