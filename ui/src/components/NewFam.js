import fetch from 'isomorphic-fetch';
import React, { Component } from 'react';
import styled from 'styled-components';

import { base } from '../common';

class NewFam extends Component {

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
      this.props.onAdd(data);
    })
    .catch(err => {
      console.error(err.message);
    });
  }

  render() {
    return (
      <Wrap>
        {!this.props.canAdd &&
          <div className="capacity">
            Your EtherFam is at capacity!<br/>
            <small>If you'd like to add more members to your fam, delete one first.</small>
          </div>
        }
        {this.props.canAdd &&
          <form onSubmit={this.submitNew}>
            <div className="field">
              <label>Ethereum Address</label>
              <input
                required={true}
                type="text"
                value={this.state.address}
                placeholder="Enter Ethereum address"
                onChange={this.changeAddress}
              />
            </div>
            <div className="field">
              <label>Name/handle</label>
              <input
                required={true}
                type="text"
                value={this.state.name}
                placeholder="Enter nickname for address"
                onChange={this.changeName}
              />
            </div>
            <button
              disabled={!this.props.canAdd}
              type="submit"
            >Add</button>
          </form>
        }
      </Wrap>
    );
  }
}

const Wrap = styled.div`
  padding: ${base};

  .capacity {
    margin: ${base * 2}px 0;
  }

  form {
    display: flex;
    align-items: center;

    .field {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: ${base}px;
    }

    label {
      font-weight: bold;
      font-size: 0.7rem;
      text-transform: uppercase;
      margin-bottom: ${base / 2}px;
    }

    input {
      padding: ${base}px;
      border: 1px solid #aaa;
      outline: none;
      width: 100%;
    }
  }
`;

export default NewFam;
