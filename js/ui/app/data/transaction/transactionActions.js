import {createAction} from 'redux-actions'
import {map} from 'folktale/core/lambda'
import {Map} from 'immutable'
import fetch, {constructUrl} from '../../services/api'
import {partial} from '../../../../common/core/fn'
import config from '../../services/config'

const TRANSACTIONS_COUNT_ENDPOINT = `${config.API_URL}/transactions/count`;
const TRANSACTION_ENDPOINT = `${config.API_URL}/transactions`;

export const GET_PARTIAL_TRANSACTIONS = 'TRANSACTION::GET_PARTIAL_TRANSACTIONS'
export const GET_TRANSACTIONS_COUNT = 'TRANSACTION::GET_TRANSACTIONS_COUNT';
export const GET_TRANSACTIONS = 'TRANSACTION::GET_TRANSACTIONS'
export const GET_TRANSACTION = 'TRANSACTION::GET_TRANSACTION'
export const CREATE_NEW_TRANSACTION = 'TRANSACTION::CREATE_NEW_TRANSACTION'
export const UPDATE_TRANSACTION = 'TRANSACTION::UPDATE_TRANSACTION'
export const DELETE_TRANSACTION = 'TRANSACTION::DELETE_TRANSACTION'

const getTxnIdUrl = txnId => `${TRANSACTION_ENDPOINT}/${txnId}`;
const getTxnUrl = txn => `${TRANSACTION_ENDPOINT}/${txn.get('id')}`;

const getPartialTransactionsRoot = fetch => {
  const fetchData = partial(fetch, 'GET', `${TRANSACTION_ENDPOINT}/partial`);

  return createAction(
    GET_PARTIAL_TRANSACTIONS,
    fetchData
  );
}

const getTransactionRoot = fetch => {
  const fetchData = txnId => fetch('GET', getTxnIdUrl(txnId));

  return createAction(
    GET_TRANSACTION,
    fetchData
  );
}

const getTransactionsCountRoot = fetch => {
  return createAction(
    GET_TRANSACTIONS_COUNT,
    partial(fetch, 'GET', TRANSACTIONS_COUNT_ENDPOINT)
  );
}

const getTransactionsRoot = fetch => {
  const getUrl = ({skip=0, limit=10}) => constructUrl(TRANSACTION_ENDPOINT, Map({skip, limit}));
  const fetchData = (partial(fetch, 'GET')) ['∘'] (getUrl);

  return createAction(
    GET_TRANSACTIONS,
    fetchData
  );
}

const transform = txn => txn.map(
  (v, k) => ['buyAmount', 'sellAmount', 'expenses', 'date'].includes(k)
    ? Number(v)
    : v
)

const updateTransactionRoot = fetch => {
  const fetchData = txn => fetch('PUT', getTxnUrl(txn), txn);

  return createAction(
    UPDATE_TRANSACTION,
    (fetchData) ['∘'] (transform)
  );
}

const createTransactionRoot = fetch => {
  const createTransactionResult = partial(fetch, 'POST', TRANSACTION_ENDPOINT);
  
  return createAction(
    CREATE_NEW_TRANSACTION,
    (createTransactionResult) ['∘'] (transform)
  );
}

const deleteTransactionRoot = fetch => {
  const fetchData = txn => fetch('DELETE', getTxnUrl(txn), txn.toJS());

  return createAction(
    DELETE_TRANSACTION,
    fetchData
  )
}


export const getPartialTransactions = getPartialTransactionsRoot(fetch)
export const getTransactionsCount = getTransactionsCountRoot(fetch)
export const getTransactions = getTransactionsRoot(fetch)
export const getTransaction = getTransactionRoot(fetch)
export const createTransaction = createTransactionRoot(fetch)
export const updateTransaction = updateTransactionRoot(fetch)
export const deleteTransaction = deleteTransactionRoot(fetch)
