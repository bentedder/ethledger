import React, { Component } from 'react';
import './App.css';
import fetch from 'isomorphic-fetch';

class App extends Component {
  doFetch = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/address/1234`)
      .then(res => {
        console.log(res);
      })
  }
  render() {
    this.doFetch();
    return (
      <div className="App">
      </div>
    );
  }
}

export default App;
