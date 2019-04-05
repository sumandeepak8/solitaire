import React, { Component } from 'react';
import Card from './Card';

export default class Suit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: props.symbol,
      className: props.className
    };
  }
  render() {
    let suit = new Array();
    let symbol = this.state.symbol;
    let className = this.state.className;

    let king = <Card symbol={symbol} number="K" className={className} />;
    let queen = <Card symbol={symbol} number="Q" className={className} />;
    let jack = <Card symbol={symbol} number="J" className={className} />;

    for (let i = 0; i < 10; i++) {
      suit[i] = <Card symbol={symbol} number={i + 1} className={className} />;
    }
    suit.push(jack);
    suit.push(queen);
    suit.push(king);
    return suit;
  }
}
