import React from 'react';
import {reduxForm} from 'redux-form';
import Layout from 'material-ui/Layout';
import Button from 'material-ui/Button';
import createForm from '../../form/formCreator';
import fields from '../../../data/form/investement/addInvestementFields';

import './form.scss';

const AddInvestment = props => {
  const formProps = {
    numOfCols: 2,
    handleSubmit: props.handleSubmit,
    fields
  };

  const layoutProps = {
    direction: 'column',
    justify: 'center',
    align: 'center'
  };

  return (
    <Layout container {...layoutProps}>
      <Layout item xs={12}>
        {createForm(formProps)}
      </Layout>
    </Layout>
  );
}

export default reduxForm({
  form: 'addInvestmentForm'
})(AddInvestment)
