import { createReducer } from "./helper";
import { REQUEST_ACCOUNTS_SUCCESS, REQUEST_ACCOUNT_SUCCESS, REQUEST_TRANSACTIONS, REQUEST_TRANSACTIONS_SUCCESS } from "./actions";

const initial = {
  accounts: [],
  transactions: [],
  transactionFilters: {},
  activeAccount: null,
  loadingAccount: false,
  loadingAccounts: false,
  loadingTransactions: false,
}

const receiveAccounts = (state, action) => ({
  ...state,
  accounts: action.payload
});

const receiveAccount = (state, action) => ({
  ...state,
  activeAccount: action.payload
});

const requestTransactions = (state, action) => ({
  ...state,
  transactions: [],
  loadingTransactions: true,
});

const receiveTransactions = (state, action) => ({
  ...state,
  loadingTransactions: false,
  transactions: action.payload
});

export const accountReducer = createReducer(initial, {
  [REQUEST_ACCOUNTS_SUCCESS]: receiveAccounts,
  [REQUEST_ACCOUNT_SUCCESS]: receiveAccount,
  [REQUEST_TRANSACTIONS]: requestTransactions,
  [REQUEST_TRANSACTIONS_SUCCESS]: receiveTransactions,
});