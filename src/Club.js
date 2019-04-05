import React, { Component } from 'react';
import Suit from './Suit';

export default class Club extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: props.className
    };
  }
  render() {
    let suit = <Suit symbol="&#9827;" className={this.state.className} />;
    return suit;
  }
}
