import React, { Component } from "react";

export default class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rank: props.rank,
      symbol: props.symbol,
      className: props.className,
      color: props.color,
      isDraggable: props.isDraggable
    };
    this.drag = this.drag.bind(this);
  }

  drag(event) {
    event.dataTransfer.setData("text", event.target.id);
  }

  render() {
    let className = this.state.className;
    let rank = this.state.rank;
    let color = this.state.color;
    let isDraggable = this.state.isDraggable;
    let id = `${rank} ${color} ${className}`;
    if (!isDraggable) {
      rank = "";
      this.state.symbol = "";
    }
    return (
      <div
        className={className}
        onDragStart={this.drag}
        id={id}
        draggable={isDraggable}
      >
        <div className="upperPartOfCard">{rank}</div>
        <div className="symbol">{this.state.symbol}</div>
        <div className="lowerPartOfCard">{rank}</div>
      </div>
    );
  }
}
