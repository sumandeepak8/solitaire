import React, { Component } from 'react';
import Draggable from 'react-draggable';

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: props.number,
      symbol: props.symbol,
      className: props.className
    };
  }
  render() {
    return (
      <Draggable handle="div">
        <div className={this.state.className}>
          <div className="upperPartOfCard">{this.state.number}</div>
          <div className="symbol">{this.state.symbol}</div>
          <div className="lowerPartOfCard">{this.state.number}</div>
        </div>
      </Draggable>
    );
  }
}
