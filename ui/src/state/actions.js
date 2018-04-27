const headers = new Headers({
  'Content-Type': 'application/json',
});

export const REQUEST_ACCOUNTS = 'Request Accounts';
export const REQUEST_ACCOUNTS_SUCCESS = 'Request Accounts Success';
export const REQUEST_ACCOUNTS_FAIL = 'Request Accounts Failure';

export const REQUEST_ACCOUNT = 'Request Specific Account';
export const REQUEST_ACCOUNT_SUCCESS = 'Request Specific Account Success';
export const REQUEST_ACCOUNT_FAIL = 'Request Specific Account Failure';

export const REQUEST_CREATE_ACCOUNT = 'Request Create Accounts';
export const REQUEST_CREATE_ACCOUNT_SUCCESS = 'Request Create Accounts Success';
export const REQUEST_CREATE_ACCOUNT_FAIL = 'Request Create Accounts Failure';

export const REQUEST_TRANSACTIONS = 'Request Transactions';
export const REQUEST_TRANSACTIONS_SUCCESS = 'Request Transactions Success';
export const REQUEST_TRANSACTIONS_FAIL = 'Request Transactions Failure';

const requestAccounts = () => ({
  type: REQUEST_ACCOUNTS
});

const requestAccountsSuccess = (accounts) => ({
  type: REQUEST_ACCOUNTS_SUCCESS,
  payload: accounts,
});

const requestAccountsFail = (err) => ({
  type: REQUEST_ACCOUNTS_FAIL,
  payload: {
    fail: true,
    err,
  }
});

const requestCreateAccount = () => ({
  type: REQUEST_CREATE_ACCOUNT,
});

const requestCreateAccountSuccess = () => ({
  type: REQUEST_CREATE_ACCOUNT_SUCCESS,
});

const requestCreateAccountFail = () => ({
  type: REQUEST_CREATE_ACCOUNT_FAIL,
});


const requestGetAccount = () => ({
  type: REQUEST_ACCOUNT,
});

const requestGetAccountSuccess = (account) => ({
  type: REQUEST_ACCOUNT_SUCCESS,
  payload: account,
});

const requestGetAccountFail = () => ({
  type: REQUEST_ACCOUNT_FAIL,
});


const requestGetTransactions = () => ({
  type: REQUEST_TRANSACTIONS,
});

const requestGetTransactionsSuccess = (transactions) => ({
  type: REQUEST_TRANSACTIONS_SUCCESS,
  payload: transactions,
});

const requestGetTransactionsFail = () => ({
  type: REQUEST_TRANSACTIONS_FAIL,
});

export const getAccount = (address) => (dispatch) => {
  dispatch(requestGetAccount());
  fetch(`${process.env.REACT_APP_API_URL}/api/address/${address}`, { headers })
  .then(res => res.json())
  .then(data => dispatch(requestGetAccountSuccess(data.account)))
  .catch(err => {
    dispatch(requestGetAccountFail());
  });
}

export const getAccounts = () => (dispatch) => {
  dispatch(requestAccounts());
  return fetch(`${process.env.REACT_APP_API_URL}/api/address`, { headers })
  .then(res => res.json())
  .then(data => dispatch(requestAccountsSuccess(data.accounts)))
  .catch(err => {
    dispatch(requestAccountsFail(err));
  });
}

// export const deleteAccount = (address, i) => {
//   fetch(`${process.env.REACT_APP_API_URL}/api/address/${address}`, {
//     method: 'DELETE',
//     headers: new Headers({
//       'Content-Type': 'application/json',
//     }),
//   })
//   .then(res => res.json())
//   .then(() => true)
//   .catch(err => {
//     console.error(err.message);
//   });
// }

export const getTransactions = (address, refresh, filters) => (dispatch) => {
  dispatch(requestGetTransactions());
  let url = `${process.env.REACT_APP_API_URL}/api/transactions/${address}?`;
  if (refresh) {
    url += 'refresh=1&';
  }
  if (filters && filters.sort) {
    url += `sort=${filters.sort}&`;
  }
  if (filters && filters.direction) {
    url += `direction=${filters.direction}&`;
  }
  fetch(url, { headers })
  .then(res => res.json())
  .then(data => dispatch(requestGetTransactionsSuccess(data.transactions)))
  .catch(err => {
    dispatch(requestGetTransactionsFail(err));
  });
}

export const createAccount = (address, name) => (dispatch) => {
  dispatch(requestCreateAccount());
  return fetch(`${process.env.REACT_APP_API_URL}/api/address`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      address,
      name,
    }),
  })
  .then(res => res.json())
  .then(() => {
    dispatch(requestCreateAccountSuccess());
    // Side effect: call to fetch accounts after saving a new account
    dispatch(getAccounts());
  })
  .catch(err => {
    dispatch(requestCreateAccountFail(err));
  });
}