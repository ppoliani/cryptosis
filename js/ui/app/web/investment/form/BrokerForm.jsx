import React from 'react';
import createForm from '../../form/formBuilder';
import fields from '../../../data/form/investement/brokerFields';
import './form.scss';

const extendWithValues = (fields, values={}) => {
  return fields.map(o => Object.assign({}, o, {value: values[o.name]}));
}

export default values => createForm('brokerForm', 1, extendWithValues(fields, values));
