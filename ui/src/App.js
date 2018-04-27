import React, { Component } from 'react';
import './App.css';
import NewAddress from './components/NewAddress';
import AddressList from './components/AddressList';
import Details from './components/Details';

class App extends Component {
  state = {
    activeAddress: ''
  }

  setActiveAddress = (address) => {
    this.setState({ activeAddress: address });
  }

  render() {
    return (
      <div className="App">
        EtherFam
        <NewAddress />
        <AddressList onActivate={this.setActiveAddress} />
        <Details address={this.state.activeAddress} /> 
      </div>
    );
  }
}

export default App;
