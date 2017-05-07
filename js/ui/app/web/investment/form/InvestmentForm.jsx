import React from 'react';
import createForm from '../../form/formCreator';
import fields from '../../../data/form/investement/investementFields';
import './form.scss';

export default createForm('investmentForm', 1, fields);
