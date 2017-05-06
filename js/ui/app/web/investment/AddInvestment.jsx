import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import Layout from 'material-ui/Layout';
import TextField from 'material-ui/TextField';
import ContentEditable from 'react-contenteditable';
import './form.scss';

class AddInvestment extends Component {
  renderErrorIfNeeded(field) {
    return field.meta.touched && field.meta.error
      ? <span className="error">{field.meta.error}</span>
      : null;
  }

  renderInput(field) {
    return <TextField id={field.name} label={field.label}/>;
  }

  renderTextArea(field) {
    return <ContentEditable html={field.content} className="form__content-editable"/>
  }

  handleSubmit() {}

  render() {
    const layoutProps = {
      direction: 'column',
      justify: 'center',
      align: 'center'
    };

    return (
      <Layout container {...layoutProps}>
        <Layout item>
          <form onSubmit={this.handleSubmit}>
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
          </form>
        </Layout>
      </Layout>
    );
  }
}

export default reduxForm({form: 'addInvestmentForm'})(AddInvestment)
