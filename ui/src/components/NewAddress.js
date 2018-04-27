import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

class NewAddress extends Component {

  state = {
    address: '',
    name: '',
  }

  changeAddress = (e) => {
    this.setState({ address: e.target.value });
  }

  changeName = (e) => {
    this.setState({ name: e.target.value });
  }

  submitNew = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/api/address`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        address: this.state.address,
        name: this.state.name
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.setState({ address: '', name: '' });
    })
    .catch(err => {
      console.error(err.message);
    });
  }

  render() {
    return (
      <form onSubmit={this.submitNew}>
        <input
          required={true}
          type="text"
          value={this.state.address}
          placeholder="Enter Ethereum address"
          onChange={this.changeAddress}
        />
        <input
          required={true}
          type="text"
          value={this.state.name}
          placeholder="Enter nickname for address"
          onChange={this.changeName}
        />
        <button
          type="submit"
        >Add</button>
      </form>
    );
  }
}

export default NewAddress;
