import React from 'react';
import createForm from '../../form/formBuilder';
import getFields from '../../../data/form/investement/investementFields';
import './form.scss';

export default (brokerOptions, investmentTypeOptions, values) => createForm(
  'investmentForm',
  1,
  getFields(brokerOptions, investmentTypeOptions),
  values
)
