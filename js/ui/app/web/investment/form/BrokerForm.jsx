import React from 'react';
import createForm from '../../form/formCreator';
import fields from '../../../data/form/investement/brokerFields';
import './form.scss';

export default createForm('brokerForm', 2, fields);
