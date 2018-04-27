import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import * as moment from 'moment';

class FamMember extends Component {

  state = {
    transactions: [],
    fetching: false,
  }

  getTransactions = (address) => {
    this.setState({ fetching: true });
    fetch(`${process.env.REACT_APP_API_URL}/api/address/${address}/transactions`, {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(res => res.json())
    .then(data => {
      this.setState({ transactions: data.transactions, fetching: false });
    })
    .catch(err => {
      console.error(err.message);
      this.setState({ fetching: false });
    });
  }

  updateTransactions = () => {
    this.setState({ fetching: true });
    fetch(`${process.env.REACT_APP_API_URL}/api/address/${this.props.address}/transactions/update`, {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(res => res.json())
    .then(data => {
      this.setState({ transactions: data.transactions, fetching: false });
    })
    .catch(err => {
      console.error(err.message);
      this.setState({ fetching: false });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      if (!this.state.fetching) {
        this.getTransactions(nextProps.address);
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.fetching &&
          <div>Fetching data...</div>
        }
        {!this.state.fetching &&
          <div>
            {/* balance: {this.state.details.balance}<br/> */}
            Transactions:<br/>
            {this.state.transactions.length === 0 &&
              <div>No transactions loaded. <button onClick={this.updateTransactions}>Update transactions</button></div>
            }
            <ul>
              {this.state.transactions && this.state.transactions.map((transaction, i) =>
                <li key={i}>{moment(transaction.timestamp * 1000).format('YYYY-MM-DD')}<strong>{transaction.value}</strong> (from: {transaction.from}, to: {transaction.to})</li>
              )}
            </ul>
          </div>
        }
      </div>
    );
  }
}

export default FamMember;
