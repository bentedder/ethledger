import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import fetch from 'isomorphic-fetch';

class App extends Component {
  doFetch = () => {
    fetch('http://localhost:5000/api/address/1234')
      .then(res => {
        console.log(res);
      })
  }
  render() {
    this.doFetch();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
