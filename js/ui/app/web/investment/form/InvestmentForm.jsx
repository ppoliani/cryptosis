import React from 'react';
import createForm from '../../form/formBuilder';
import fields from '../../../data/form/investement/investementFields';
import './form.scss';

export default createForm('investmentForm', 1, fields);
