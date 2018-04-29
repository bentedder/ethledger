import {
  DEACTIVATE_ACCOUNT,
  REQUEST_ACCOUNT,
  REQUEST_ACCOUNT_SUCCESS,
  REQUEST_ACCOUNTS_SUCCESS,
  REQUEST_TRANSACTIONS,
  REQUEST_TRANSACTIONS_SUCCESS,
} from './actions';
import { createReducer } from './helper';

const initial = {
  accounts: [],
  transactions: [],
  transactionFilters: {},
  activeAccount: null,
  loadingAccount: false,
  loadingAccounts: true,
  loadingTransactions: false,
}

const requestAccounts = (state, action) => ({
  ...state,
  loadingAccounts: true,
  accounts: [],
});

const receiveAccounts = (state, action) => ({
  ...state,
  accounts: action.payload,
  loadingAccounts: false,
});

const requestAccount = (state, action) => ({
  ...state,
  loadingAccount: true,
});

const receiveAccount = (state, action) => ({
  ...state,
  activeAccount: action.payload,
  loadingAccount: false,
});

const requestTransactions = (state, action) => ({
  ...state,
  transactions: [],
  loadingTransactions: true,
});

const receiveTransactions = (state, action) => ({
  ...state,
  transactions: action.payload,
  loadingTransactions: false,
});

const deactivateAccount = (state, action) => ({
  ...state,
  loadingTransactions: false,
  transactions: [],
  activeAccount: null,
});

export const accountReducer = createReducer(initial, {
  [REQUEST_ACCOUNTS_SUCCESS]: receiveAccounts,
  [REQUEST_ACCOUNT]: requestAccount,
  [REQUEST_ACCOUNT_SUCCESS]: receiveAccount,
  [REQUEST_TRANSACTIONS]: requestTransactions,
  [REQUEST_TRANSACTIONS_SUCCESS]: receiveTransactions,
  [DEACTIVATE_ACCOUNT]: deactivateAccount
});