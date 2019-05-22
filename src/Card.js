import React, { Component } from "react";

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.drag = this.drag.bind(this);
  }

  drag(event) {
    event.dataTransfer.setData("text", event.target.id);
  }

  render() {
    let className = this.props.className;
    let rank = this.props.rank;
    let color = this.props.color;
    let isDraggable = this.props.isDraggable;
    let symbol = this.props.symbol;
    let id = `${rank} ${color} ${className}`;
    if (!isDraggable) {
      rank = "";
      symbol = "";
    }
    return (
      <div
        className={className}
        onDragStart={this.drag}
        id={id}
        draggable={isDraggable}
      >
        <div className="upperPartOfCard">{rank}</div>
        <div className="symbol">{symbol}</div>
        <div className="lowerPartOfCard">{rank}</div>
      </div>
    );
  }
}
