import './App.css';

import React, { Component } from 'react';
import styled from 'styled-components';

import FamList from './components/FamList';
import FamLive from './components/FamLive';
import FamMember from './components/FamMember';
import NewFam from './components/NewFam';
import { base } from './common';

class App extends Component {
  state = {
    activeAddress: '',
    famList: [],
    famLimit: 5,
  }

  getAddresses = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/address`, {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(res => res.json())
    .then(data => {
      this.setState({ famList: data.addresses });
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
      this.setState({ famList: this.state.famList.filter((a, j) => j !== i) });
    })
    .catch(err => {
      console.error(err.message);
    });
  }
  
  updateFam = (member) => {
    this.setState({
      famList: [
        ...this.state.famList,
        member,
      ]
    })
  }

  componentDidMount() {
    this.getAddresses();
  }

  setActiveAddress = (address) => {
    this.setState({ activeAddress: address });
  }

  getBalance = (address) => {
    this.getBalance(address);
  }

  render() {
    return (
      <Wrap>
        <h1>EtherFam</h1>
        <div className="fam-row">
          <div className="fam-list">
            <h2>Fam Membership</h2>
            <div className="fam-progress">
              <div className="bar" style={{ width: (this.state.famList.length / this.state.famLimit) * 100 + '%' }} />
            </div>
            <NewFam canAdd={this.state.famLimit > this.state.famList.length} onAdd={this.updateFam} />
            <FamList
              addresses={this.state.famList}
              onActivate={this.setActiveAddress}
              onDelete={this.deleteAddress}
            />
          </div>
          <div className="fam-live">
            <FamLive addresses={this.state.famList} />
          </div>
        </div>
        <FamMember address={this.state.activeAddress} />
      </Wrap>
    );
  }
}

const Wrap = styled.div`

  h1 {
    display: block;
    margin: 0;
    padding: ${base * 2}px;
    font-size: 1.2rem;
    font-weight: normal;
    text-align: center;
    background: #efefef;
    text-transform: uppercase;
    letter-spacing: 4px;
  }

  .fam-row {
    display: flex;

    .fam-list {
      flex: 1;
      padding: ${base * 2}px;
    }

    .fam-live {
      flex: 0 1 330px;
      padding: ${base * 2}px;
    }
  }

  .fam-progress {
    width: 100%;
    background: #ccc;
    height: 10px;
    position: relative;
    margin: ${base}px 0;

    .bar {
      height: 10px;
      position: absolute;
      top: 0;
      left: 0;
      background: #333;
      transition: all 300ms linear;
    }
  }
`;

export default App;
