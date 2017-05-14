import React from 'react';
import createForm from '../../form/formBuilder';
import fields from '../../../data/form/investement/investementFields';
import './form.scss';

// overrideFields is essentially some dynamic fields usually the options for a select box
export default (overrideFields, values) => createForm('investmentForm', 1, Object.assign({}, fields, overrideFields));
