import React from 'react';
import {Field, reduxForm} from 'redux-form';
import Layout from 'material-ui/Layout';
import TextField from 'material-ui/TextField';
import ContentEditable from 'react-contenteditable';
import {autobind} from 'core-decorators';
import Button from 'material-ui/Button';
import './form.scss';

const required = value => value ? undefined : 'Required';

const renderErrorIfNeeded = field => field.meta.touched && field.meta.error
  ? <span className="error">{field.meta.error}</span>
  : null;

const renderInput = field => <div>
    <TextField
      id={field.name}
      label={field.label} />
    {renderErrorIfNeeded(field)}
  </div>

const renderTextArea = field => <ContentEditable html={field.content} className="form__content-editable"/>;

const AddInvestment = props => {
  const layoutProps = {
    direction: 'column',
    justify: 'center',
    align: 'center'
  };

  return (
    <Layout container {...layoutProps}>
      <Layout item xs={12}>
        <form onSubmit={props.handleSubmit}>
          <Layout container direction="row">
            <Layout item>
              <Field
                name="investmentType"
                label="Investement Type"
                component={renderInput}
                type="text"/>
            </Layout>
            <Layout item>
              <Field name="broker" label="Broker" component={renderInput} type="text"/>
            </Layout>
          </Layout>
          <Layout container direction="row">
            <Layout item>
              <Field name="dd/mm/yyyy" label="Date" component={renderInput} type="text"/>
            </Layout>
            <Layout item>
              <Field
                name="moneyInvested"
                label="Money Invested"
                component={renderInput}
                type="text"/>
            </Layout>
          </Layout>
          <Layout container direction="row">
            <Layout item>
              <Field
                name="expenses"
                label="Total Expenses"
                component={renderInput}
                type="text"/>
            </Layout>
            <Layout item>
              <Field
                name="quantity"
                label="Quantity"
                component={renderInput}
                type="text"/>
            </Layout>
          </Layout>
          <Layout container direction="row">
            <Layout item xs={12}>
              <Field
                name="price"
                label="Price"
                component={renderInput}
                type="text"/>
            </Layout>
            </Layout>
          <Layout container direction="row">
            <Layout item xs={12}>
              <Field
                name="notes"
                content="Notes"
                component={renderTextArea}
                type="text"/>
            </Layout>
          </Layout>
          <Layout container>
            <Layout item xs={12}>
              <Button type="submit" raised primary className="right">Submit</Button>
            </Layout>
          </Layout>
        </form>
      </Layout>
    </Layout>
  );
}

export default reduxForm({
  form: 'addInvestmentForm'
})(AddInvestment)
