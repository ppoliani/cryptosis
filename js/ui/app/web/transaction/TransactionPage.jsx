import React, {PureComponent} from 'react'
import {List, fromJS, Map} from 'immutable'
import dateformat from 'date-fns/format'
import {partial, pipe, noop, prop} from '../../../../common/core/fn'
import {filterObject} from '../../services/utils'
import {connect} from 'react-redux'
import {identity} from 'folktale/core/lambda'
import {Row, Col} from 'react-flexbox-grid'
import Button from 'material-ui/FlatButton'
import PageWithPanel from '../panel/PageWithPanel'
import AsyncPanel from '../panel/AsyncPanel'
import {AsyncDataAll} from '../../data/core/AsyncData'
import DataGrid from '../grid/DataGrid'
import Container from '../common/Container'
import DialogBoxMixin from '../mixins/DialogBoxMixin'
import PanelContent from './PanelContent'
import {getBrokers} from '../../data/broker/brokerActions'
import {startTransactionCurrentValueStream} from '../../data/stream/transactionValueStream'
import {renderTransactionValue, getSelectedCurrency, renderPrice} from '../common/TransactionHelpers'
import CurrencySelector from '../form/selectors/CurrencySelector'
import {getAssets} from '../../data/asset/assetActions'
import {
  getTransactionsCount,
  getTransactions,
  createTransaction,
  updateTransaction, 
  deleteTransaction
} from '../../data/transaction/transactionActions'

const DEFAULT_CURRENCY = 'GBP';

@DialogBoxMixin
class TransactionPage extends PureComponent {
  state = {
    isPanelOpen: false,
    page: 0,
    limit: 10
  }

  rendereDeleteBtn(txn) {
    return (
      <Button label="Delete" primary={true} onClick={partial(this.onTxnDeleteClick, txn)} />
    )
  }

  getColumns() {
    return [
      {id: 'buyAsset', Header: 'Buy Asset', accessor: prop('buyAsset'), filterable: true},
      {id: 'buyAmount', Header: 'Buy Amount', accessor: prop('buyAmount')},
      {id: 'sellAsset', Header: 'Sell Asset',  accessor: prop('sellAsset'), filterable: true},
      {id: 'sellAmount', Header: 'Sell Amount',  accessor: prop('sellAmount')},
      {id: 'feesAsset', Header: 'Fees Currency',  accessor: prop('feesAsset'), filterable: true},
      {id: 'feesAmount', Header: 'Fees Amount',  accessor: prop('feesAmount')},
      {id: 'broker', Header: 'Broker',  accessor: prop('broker'), filterable: true},
      {id: 'date', Header: 'Date', accessor: ({date}) => dateformat(date, 'DD/MM/YYYY'), filterable: true},
      {id: 'status', Header: 'Status', accessor: prop('status')},
      {id: 'action', Header: 'Action', accessor: this.rendereDeleteBtn}
    ];
  }

  componentDidMount() {
    const {form, getTransactionsCount, getBrokers, getAssets} = this.props;
    const currency = getSelectedCurrency(form);

    getTransactionsCount();
    getBrokers();
    getAssets();
    this.subscribe(currency);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidUpdate(prevProps) {
    const currency = getSelectedCurrency(this.props.form);

    if(getSelectedCurrency(prevProps.form) !== currency) {
      this.unsubscribe();
      this.subscribe(currency);
    }
  }

  unsubscribe() {
    this.props.stream
      .get('transactionCurrentValueSubscription')
      .matchWith({
        Just: ({value}) => value.unsubscribe(),
        Nothing: identity
      });
  }

  subscribe(currency) {
    this.props.startTransactionCurrentValueStream(currency);
  }

  loadTransactions(filters = []) {
    const {getTransactions, transactions, getTransactionsCount} = this.props;
    const {page, limit} = this.state;

    const execRequest = () => transactions.get('fetchTxnCountResult').matchWith({
      Empty: noop, 
      Loading: noop, 
      Success: () => {
        const skip = page * limit;
        getTransactions({skip, limit, filters});
      },
      Failure: noop
    });

    if(filters.length > 0) {
      getTransactionsCount(filters);
      return execRequest();
    }

    execRequest()
  }

  togglePanel = (_, selectedTransaction={}) => {
    this.setState({isPanelOpen: !this.state.isPanelOpen, selectedTransaction});
  }

  onTxnSave = txn => {
    const {createTransaction, updateTransaction} = this.props;

    if(txn.id) {
     pipe(
       updateTransaction,
       filterObject(txn, ['action', 'status'])
      );
    }
    else {
      createTransaction(fromJS(txn));
    }

    this.togglePanel();
  }

  onTxnDelete = txn => {
    this.props.deleteTransaction(txn);
  }

  onTxnDeleteClick = (txn, e) => {
    e.stopPropagation();
    this.openDialog(partial(this.onTxnDelete, txn))
  }

  handlePageChange = page => {
    this.setState(Object.assign({}, this.state, {page}), this.loadTransactions);

  }

  handlePageSizeChange = (pageSize, page) => {
    this.setState(Object.assign({}, this.state, {page, limit: pageSize}), this.loadTransactions);
  }

  handleSortedChange = (newSorted, column, shiftKey) => {
    console.log('>>>>>>>>>>', column);
    console.log('>>>>>>>>>>', newSorted);
    console.log('>>>>>>>>>>', shiftKey);
  }

  handleFilteredChange = filters => {
    this.loadTransactions(filters);
  }

  // will include the value for each transaction
  getExtendedTableData = (txns, transactionValues) =>
    txns.reduce(
      (acc, v, id) => acc.push(
        v.set('id', id)
          .set('status', v.get('positionType') === 'buy' ? renderTransactionValue(id, transactionValues, getSelectedCurrency(this.props.form)) : '')
      ),
      List()
    )
    .toJS();

  getTransactionsData = txns => this.props.portfolio
      .get('transactionValues')
      .matchWith({
        Just: ({value}) => this.getExtendedTableData(txns, value),
        Nothing: () => this.getExtendedTableData(txns, Map())
      });

  getTransactions() {
    return this.props.transactions
      .get('transactions');
  }

  renderTransactionTable(data) {
    const {transactions} = this.props;
    const {page, limit} = this.state;

    const render = ({value}) => (
      <DataGrid 
        data={data}
        page={page}
        pageSize={limit}
        loading={transactions.get('fetchTxnsResult')}
        columns={this.getColumns()}
        pages={transactions.get('count')}
        handlePageChange={this.handlePageChange} 
        handlePageSizeChange={this.handlePageSizeChange}
        handleSortedChange={this.handleSortedChange} 
        handleFilteredChange={this.handleFilteredChange} />
    )

    return transactions.get('fetchTxnCountResult').matchWith({
      Empty: noop,
      Loading: render,
      Success: render,
      Failure: noop
    })
  }

  renderTransactionsTableContainer = (data=[]) => {
    const {transactions} = this.props;
    
    const asyncResult = AsyncDataAll([
      transactions.get('fetchTxnsResult'),
      transactions.get('fetchTxnCountResult')
    ]);

    return (
      <Container title='' subtitle=''>
        <AsyncPanel asyncResult={asyncResult}>
          {this.renderTransactionTable(data)}
        </AsyncPanel>
      </Container>
    )
  }

  renderTable() { 
    return this.props.transactions.get('fetchTxnsResult')
      .matchWith({
        Empty: () => this.loadTransactions(),
        Loading: () => this.renderTransactionsTableContainer(),
        Success: ({value}) =>
           pipe(
              this.renderTransactionsTableContainer,
              this.getTransactionsData,
              this.getTransactions()
            ),
        Failure: noop
      })
  }

  getPanelContent() {
    const {transactions, asset, fetchBrokersResult, brokers} = this.props;

    return (
      <PanelContent
        saveTxnResult={transactions.get('saveTxnResult')}
        assets={asset.get('assets')}
        brokers={brokers}
        selectedTransaction={this.state.selectedTransaction}
        onTxnSave={this.onTxnSave}
        fetchAssetsResult={asset.get('fetchAssetsResult')}
        fetchBrokersResult={fetchBrokersResult}
      />
    )
  }

  render() {
    const {isPanelOpen} = this.state;

    return (
      <PageWithPanel
        PanelContent={isPanelOpen && this.getPanelContent()}
        togglePanel={this.togglePanel}
        isPanelOpen={isPanelOpen}>
          <Row className='row-spacing'>
            <Col xs>
              <CurrencySelector value={getSelectedCurrency(this.props.form)}/>
              <Button type="submit" className="right" onClick={this.togglePanel}>New</Button>
            </Col>
          </Row>
          <Row className='row-spacing'>
            <Col xs>
              {this.renderTable()}
            </Col>
          </Row>
          {this.renderDialogBox('Are you sure you want to delete this transaction?')}
      </PageWithPanel>
    );
  }
}

const mapStateToProps = state => ({
  form: state.form,
  stream: state.stream,
  transactions: state.transaction,
  brokers: state.broker.get('brokers'),
  portfolio: state.portfolio,
  fetchBrokersResult: state.broker.get('fetchBrokersResult'),
  asset: state.asset
});

const mapDispatchToProps = dispatch => ({
  getTransactionsCount: (dispatch) ['∘'] (getTransactionsCount),
  getTransactions: (dispatch) ['∘'] (getTransactions),
  createTransaction: (dispatch) ['∘'] (createTransaction),
  updateTransaction: (dispatch) ['∘'] (updateTransaction), 
  deleteTransaction: (dispatch) ['∘'] (deleteTransaction),
  getBrokers: (dispatch) ['∘'] (getBrokers),
  getAssets: (dispatch) ['∘'] (getAssets),
  startTransactionCurrentValueStream: (dispatch) ['∘'] (startTransactionCurrentValueStream)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps 
)(TransactionPage)

