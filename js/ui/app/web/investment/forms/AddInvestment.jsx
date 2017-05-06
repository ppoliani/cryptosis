import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import Layout from 'material-ui/Layout';
import TextField from 'material-ui/TextField';
import ContentEditable from 'react-contenteditable';
import {autobind} from 'core-decorators';
import Button from 'material-ui/Button';
import SubmitButton from './SubmitButton';

import './form.scss';

const required = value => {
  return value ? undefined : 'Required'
};

class AddInvestment extends Component {
  renderErrorIfNeeded(field) {
    return field.meta.touched && field.meta.error
      ? <span className="error">{field.meta.error}</span>
      : null;
  }

  @autobind
  renderInput(field) {
    return <div>
      <TextField
        id={field.name}
        label={field.label} />
      {this.renderErrorIfNeeded(field)}
    </div>;
  }

  renderTextArea(field) {
    return <ContentEditable html={field.content} className="form__content-editable"/>
  }

  render() {
    const layoutProps = {
      direction: 'column',
      justify: 'center',
      align: 'center'
    };

    const Submit = SubmitButton('addInvestmentForm');

    return (
      <Layout container {...layoutProps}>
        <Layout item xs={12}>
          <form onSubmit={this.props.handleSubmit}>
            <Layout container direction="row">
              <Layout item>
                <Field
                  name="investmentType"
                  label="Investement Type"
                  component={this.renderInput}
                  type="text"/>
              </Layout>
              <Layout item>
                <Field name="broker" label="Broker" component={this.renderInput} type="text"/>
              </Layout>
            </Layout>
            <Layout container direction="row">
              <Layout item>
                <Field name="dd/mm/yyyy" label="Date" component={this.renderInput} type="text"/>
              </Layout>
              <Layout item>
                <Field
                  name="moneyInvested"
                  label="Money Invested"
                  component={this.renderInput}
                  type="text"/>
              </Layout>
            </Layout>
            <Layout container direction="row">
              <Layout item>
                <Field
                  name="expenses"
                  label="Total Expenses"
                  component={this.renderInput}
                  type="text"/>
              </Layout>
              <Layout item>
                <Field
                  name="quantity"
                  label="Quantity"
                  component={this.renderInput}
                  type="text"/>
              </Layout>
            </Layout>
            <Layout container direction="row">
              <Layout item xs={12}>
                <Field
                  name="price"
                  label="Price"
                  component={this.renderInput}
                  type="text"/>
              </Layout>
              </Layout>
            <Layout container direction="row">
              <Layout item xs={12}>
                <Field
                  name="notes"
                  content="Notes"
                  component={this.renderTextArea}
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
}

export default reduxForm({
  form: 'addInvestmentForm'
})(AddInvestment)
