import React from 'react';
import createForm from '../../form/formBuilder';
import fields from '../../../data/form/investement/brokerFields';
import './form.scss';

export default createForm('brokerForm', 1, fields);
