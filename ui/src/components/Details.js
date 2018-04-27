import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

class Details extends Component {

  state = {
    details: {},
    fetching: false,
  }

  getAddress = (address) => {
    this.setState({ fetching: true });
    fetch(`${process.env.REACT_APP_API_URL}/api/address/${address}`, {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({ details: data, fetching: false });
    })
    .catch(err => {
      console.error(err.message);
      this.setState({ fetching: false });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      if (!this.state.fetching) {
        this.getAddress(nextProps.address);
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
            balance: {this.state.details.balance}<br/>
            Transactions:<br/>
            <ul>
              {this.state.details.transactions && this.state.details.transactions.map((transaction, i) =>
                <li key={i}><strong>{transaction.value}</strong> (from: {transaction.from}, to: {transaction.to})</li>
              )}
            </ul>
          </div>
        }
      </div>
    );
  }
}

export default Details;
