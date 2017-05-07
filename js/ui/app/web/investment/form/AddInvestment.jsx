import React from 'react';
import createForm from '../../form/formCreator';
import fields from '../../../data/form/investement/addInvestementFields';
import './form.scss';

export default createForm('addInvestmentForm', 2, fields);
