import React from 'react'
import createForm from '../../form/formBuilder'
import fields from '../../../data/form/investement/investmentTypeFields'
import './form.scss'

export default values => createForm('investmentTypeForm', 1, fields, values)
