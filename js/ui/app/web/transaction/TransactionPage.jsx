import React, {PureComponent} from 'react'
import {List, fromJS, Map} from 'immutable'
import dateformat from 'date-fns/format'
import {partial, pipe, noop} from '../../../../common/core/fn'
import {filterObject} from '../../services/utils'
import {connect} from 'react-redux'
import {identity} from 'folktale/core/lambda'
import {Row, Col} from 'react-flexbox-grid'
import Button from 'material-ui/FlatButton'
import PageWithPanel from '../panel/PageWithPanel'
import AsyncPanel from '../panel/AsyncPanel'
import {AsyncDataAll} from '../../data/core/AsyncData'
import Table from '../table/Table'
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

const columns = [
  {key: 'buyAsset', label: 'Buy Asset'},
  {key: 'sellAsset', label: 'Sell Asset'},
  {key: 'broker', label: 'Broker'},
  {key: 'date', label: 'Date', render: date => dateformat(date, 'DD/MM/YYYY')},
  {key: 'quantity', label: 'Quantity'},
  {key: 'price', label: 'Price'},
  {key: 'status', label: 'Status'},
  {key: 'action', label: 'Action'}
];
const DEFAULT_CURRENCY = 'GBP';

@DialogBoxMixin
class TransactionPage extends PureComponent {
  state = {
    isPanelOpen: false,
    limit: 10,
    page: 1
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

  loadTransactions() {
    const {getTransactions, transactions} = this.props;

    transactions.get('fetchTxnCountResult').matchWith({
      Empty: noop,
      Loading: noop,
      Success: () => {
        const {limit, page} = this.state;
        const skip = (page - 1) * limit;
        getTransactions({skip, limit});
      },
      Failure: noop
    });
  }

  togglePanel = (_, selectedTransaction={}) => {
    this.setState({isPanelOpen: !this.state.isPanelOpen, selectedTransaction});
  }

  onTxnSave = txn => {
    const {createTransaction, updatedTransaction} = this.props;

    if(txn.id) {
     pipe(
       updatedTransaction,
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

  handleCellClick = (e, _, txn) => {
    this.togglePanel(e, txn);
  }

  handleRowSizeChange = (e, rows) => {
    this.setState(Object.assign({}, this.state, {page: 1, limit: rows}), this.loadTransactions);
  }

  handleNextPageClick = (e, page) => {
    this.setState(Object.assign({}, this.state, {page: this.state.page + 1}), this.loadTransactions);
  }

  handlePreviousPageClick = (e, page) => {
    this.setState(Object.assign({}, this.state, {page: this.state.page - 1}), this.loadTransactions);
  }

  // will include the value for each investment
  getExtendedTableData = (txns, transactionValues) =>
    txns.reduce(
      (acc, v, id) => acc.push(
        v.set('id', id)
          .set('status', v.get('positionType') === 'buy' ? renderTransactionValue(id, transactionValues, getSelectedCurrency(this.props.form)) : '')
          .set('action', <Button label="Delete" primary={true} onClick={partial(this.onTxnDeleteClick, v)} />)
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

    return transactions.get('fetchTxnCountResult').matchWith({
      Empty: noop,
      Loading: noop,
      Success: ({value}) => (
        <Table
          columns={columns}
          limit={this.state.limit}
          page={this.state.page}
          data={data}
          count={transactions.get('count')}
          onRowSizeChange={this.handleRowSizeChange}
          onNextPageClick={this.handleNextPageClick}
          onPreviousPageClick={this.handlePreviousPageClick}
          handleCellClick={this.handleCellClick}
        />
      ),
      Failure: noop
    })
  }

  renderTransactionsTableContainer = data => {
    const {transactions} = this.props;
    
    const asyncResult = AsyncDataAll([
      transactions.get('fetchTxnsResult'),
      transactions.get('fetchTxnCountResult')
    ]);

    return (
      <Container title='Completed Transactions' subtitle=''>
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
        Loading: noop,
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
            <Col>
              {this.renderTable()}
            </Col>
          </Row>
          {this.renderDialogBox('Are you sure you want to delete this investment?')}
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

