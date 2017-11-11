import React from 'react'
import createForm from '../form/formBuilder'
import fields from '../../data/form/assetFields'
import '../form/form.scss'

export default values => createForm('assetForm', 1, fields, values)
 