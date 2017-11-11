import React, {PureComponent} from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {List} from 'immutable'
import {AsyncDataAll, AsyncDataSome} from '../../data/core/AsyncData'
import AsyncPanel from '../panel/AsyncPanel'
import createTransactionForm from './TransactionForm'

export default class PanelContent extends PureComponent {
  getCombinedAsyncResult() {
    return AsyncDataAll([
      this.props.fetchAssetsResult,
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
    const {brokers, assets, selectedTransaction} = this.props;

    return this.getCombinedAsyncResult()
      .matchWith({
        Empty: () => null,
        Loading: () => null,
        Success: () => createTransactionForm(
          this.getOptionsFromMap(brokers),
          this.getOptionsFromMap(assets),
          selectedTransaction
        ),
        Failure: ({error}) => console.log('Error building the form', error)
    });
  }

  render() {
    const {saveTxnResult, onTxnSave} = this.props;

    const asyncResult = AsyncDataSome([
      this.getCombinedAsyncResult(),
      saveTxnResult
    ]);

    const TransactionForm = this.createDynamicForm();

    return (
      <AsyncPanel asyncResult={asyncResult}>
        <Col xs={12}>
          <h1>New Transaction</h1>
          {TransactionForm && <TransactionForm onSubmit={onTxnSave} />}
        </Col>
      </AsyncPanel>
    );
  }
}
