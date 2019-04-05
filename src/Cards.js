import React, { Component } from 'react';

import Card from './Card';

export default class Cards extends Component {
  constructor(props) {
    super(props);
    this.setState = {
      symbol: this.props.symbol,
      count: this.props.count,
      className: this.props.className
    };
  }
  render() {
    let card = <Card symbol={9824} className={this.props.className} />;
    let cards = new Array(this.props.count).fill(card);
    return cards;
  }
}
