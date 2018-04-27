import * as moment from 'moment';
import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

import { base, weiToEth } from '../common';

class FamLive extends Component {
  interval;
  ws;

  state = {
    liveResults: [],
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.addresses) !== JSON.stringify(this.props.addresses)) {
      this.restartLive(nextProps.addresses);
    }
  }

  componentWillUnmount = () => {
    this.ws.close();
  }

  restartLive = (addresses) => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.ws) {
      this.ws.close();
    }
    this.setState({ liveResults: [] });
    this.ws = new WebSocket('wss://socket.etherscan.io/wshandler');

    this.ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      console.log(data);
      if (data.event === 'txlist' && data.result.length) {
        const newResults = [
          ...data.result.map((result) => ({
            from: result.from,
            to: result.to,
            timestamp: moment(result.timeStamp * 1000),
            friendlyTime: moment(result.timeStamp * 1000).fromNow(),
            value: (parseInt(result.value, 10) / weiToEth).toPrecision(4)
          })),
          ...this.state.liveResults.map((result) => ({
            ...result,
            friendlyTime: result.timestamp.fromNow(),
          }))
        ].sort((a, b) => b.timestamp - a.timestamp).filter(n => n);
        newResults.length = 300;
        this.setState({ liveResults: newResults });
      }
    };

    this.ws.onopen = () => {
      this.interval = setInterval(() => {
        this.ws.send('{"event": "ping"}');
      }, 18000);
      addresses.forEach((address) => {
        this.ws.send(`{"event": "txlist", "address": "${address.address}" }`);
      })
    };
  }

  render() {
    return (
      <Wrap>
        <div className="live" />
        <h2>EtherFam Live</h2>
        <div className="list">
          {this.state.liveResults.length === 0 &&
            <div className="loading">Loading...</div>
          }
          {this.state.liveResults.map((result, i) =>
            <div key={i} className="item">{result.value} ({result.friendlyTime})</div>
          )}
        </div>
      </Wrap>
    );
  }
}

const blinker = keyframes`
  0% {
    background-color: green;
  }

  50% {
    background-color: yellow;
  }

  100% {
    background-color: green;
  }
`;


const Wrap = styled.div`
  position: relative;

  .live {
    display: block;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 10px;
    height: 10px;
    animation: ${blinker} 3s linear infinite;
    border-radius: 50%;
  }

  .loading {
    padding: ${base * 2}px;
  }

  .list {
    max-height: 380px;
    overflow: auto;
    border: 1px solid #aaa;
   
    .item {
      padding: ${base}px;
      border-bottom: 1px solid #aaa;
      font-size: 0.8rem;
    }
  }
`;

export default FamLive;
