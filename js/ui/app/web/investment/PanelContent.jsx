import React, {PureComponent} from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {List} from 'immutable'
import {AsyncDataAll, AsyncDataSome} from '../../data/core/AsyncData'
import AsyncPanel from '../panel/AsyncPanel'
import createInvestmentForm from './form/InvestmentForm'

export default class PanelContent extends PureComponent {
  getCombinedAsyncResult() {
    return AsyncDataAll([
      this.props.fetchInvestmentTypeResult,
      this.props.fetchBrokersResult
    ]);
  }

  getOptionsFromMap(records) {
    return records.reduce(
      (acc, v, k) => acc.push({
        value: v.get('name'),
        text: v.get('name')
      }),
      List()
    )
    .toJS();
  }

  createDynamicForm() {
    const {brokers, investmentTypes, selectedInvestment} = this.props;

    return this.getCombinedAsyncResult()
      .matchWith({
        Empty: () => null,
        Loading: () => null,
        Success: () => createInvestmentForm(
          this.getOptionsFromMap(investmentTypes),
          this.getOptionsFromMap(brokers),
          selectedInvestment
        ),
        Failure: ({error}) => console.log('Error building the form', error)
    });
  }

  render() {
    const {saveInvestmentResult, onInvestmentSave} = this.props;

    const asyncResult = AsyncDataSome([
      this.getCombinedAsyncResult(),
      saveInvestmentResult
    ]);

    const InvestmentForm = this.createDynamicForm();

    return (
      <AsyncPanel asyncResult={asyncResult}>
        <Col xs={12}>
          <h1>New Investment</h1>
          {InvestmentForm && <InvestmentForm onSubmit={onInvestmentSave} />}
        </Col>
      </AsyncPanel>
    );
  }
}
