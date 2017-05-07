import React from 'react';
import createForm from '../../form/formCreator';
import fields from '../../../data/form/investement/investmentTypeFields';
import './form.scss';

export default createForm('investmentTypeForm', 2, fields);
