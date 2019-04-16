import React, { Component } from 'react';

export default class Div extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      className: props.className
    };
  }

  render() {
    return <div className={this.state.className} id={this.state.id} />;
  }
}
