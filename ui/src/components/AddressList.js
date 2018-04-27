import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

class AddressList extends Component {

  state = {
    addresses: [],
  }

  getAddresses = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/address`, {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(res => res.json())
    .then(data => {
      this.setState({ addresses: data.addresses });
    })
    .catch(err => {
      console.error(err.message);
    });
  }

  deleteAddress = (address, i) => {
    console.log(address, i);
    fetch(`${process.env.REACT_APP_API_URL}/api/address/${address}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(res => res.json())
    .then(data => {
      this.setState({ addresses: this.state.addresses.filter((a, j) => j !== i) });
    })
    .catch(err => {
      console.error(err.message);
    });
  }

  componentDidMount() {
    this.getAddresses();
  }

  render() {
    return (
      <div>
        {this.state.addresses.map((address, i) => 
          <div key={i}>
            {address.name} ({address.address}) <button type="button" onClick={this.deleteAddress.bind(null, address.address, i)}>delete</button> <button onClick={this.props.onActivate.bind(null, address.address)}>view</button>
          </div>
        )}
      </div>
    );
  }
}

export default AddressList;
