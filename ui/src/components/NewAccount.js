import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { base } from '../common';
import { createAccount } from '../state/actions';


class NewAccount extends Component {

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
    this.props.createAccount(this.state.address, this.state.name)
      .then(() => {
        this.setState({ name: '', address: '' });
      });
  }

  render() {
    return (
      <Wrap>
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
          <button type="submit">Add</button>
        </form>
      </Wrap>
    );
  }
}

const Wrap = styled.div`
  padding: ${base};

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

const mapStateToProps = (state) => ({
  loadingAccounts: state.accounts.loadingAccounts,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    createAccount
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(NewAccount);