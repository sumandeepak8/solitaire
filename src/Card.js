import React, { Component } from 'react';

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.setState = {
      symbol: this.props.symbol,
      className: this.props.className
    };
  }
  render() {
    return (
      <div className="symbol" className={this.props.className}>
        &#{this.setState.symbol};
      </div>
    );
  }
}
