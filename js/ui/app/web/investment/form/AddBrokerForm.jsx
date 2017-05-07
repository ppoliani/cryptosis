import React from 'react';
import createForm from '../../form/formCreator';
import fields from '../../../data/form/investement/addBroker';
import './form.scss';

export default createForm('addBrokerForm', 2, fields);
