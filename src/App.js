import React, { Component } from 'react';
import './App.css';
import Card from './Card';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spade: props.spade,
      heart: props.heart,
      club: props.club,
      diamond: props.diamond
    };
    this.allowDrop = this.allowDrop.bind(this);
    this.drop = this.drop.bind(this);
  }

  allowDrop(event) {
    event.preventDefault();
  }

  drop(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text');
    let length = event.target.parentNode.id.split(' ').length;
    let elementToPlace = document.getElementById(id);
    if (length != 2) event.target.appendChild(elementToPlace);
    else event.target.parentNode.parentNode.appendChild(elementToPlace);
  }

  createFoundation() {
    let pile = <div className="foundationPiles" />;
    let piles = new Array(4).fill(pile);
    return (
      <div
        id="foundation"
        className="foundation"
        onDragOver={this.allowDrop}
        onDrop={this.drop}
      >
        {piles}
      </div>
    );
  }

  getSymbol(className) {
    let symbols = {
      spade: this.state.spade,
      heart: this.state.heart,
      club: this.state.club,
      diamond: this.state.diamond
    };

    return symbols[className];
  }

  getSuit(className) {
    let suit = new Array();
    let symbol = this.getSymbol(className);

    let king = <Card symbol={symbol} rank="K" className={className} />;
    let queen = <Card symbol={symbol} rank="Q" className={className} />;
    let jack = <Card symbol={symbol} rank="J" className={className} />;

    for (let i = 1; i <= 10; i++)
      suit.push(<Card symbol={symbol} rank={i} className={className} />);

    suit.push(jack);
    suit.push(queen);
    suit.push(king);
    return suit;
  }

  getDeck() {
    let spade = this.getSuit('spade');
    let heart = this.getSuit('heart');
    let club = this.getSuit('club');
    let diamond = this.getSuit('diamond');
    return spade
      .concat(heart)
      .concat(club)
      .concat(diamond);
  }

  getStockAndTableauCards = function(deck) {
    let stockCards = [];
    for (let i = 1; i <= 24; i++) {
      let index = [Math.floor(Math.random() * deck.length)];
      stockCards.push(deck[index]);
      deck.splice(index, 1);
    }
    return { stockCards, deck };
  };

  getUpperLeftDiv(stockCards) {
    return (
      <div id="upperDivLeft" className="upperDivLeft">
        <div id="stocks" className="stocks">
          {stockCards}
        </div>
        <div id="waste" className="waste" />;
      </div>
    );
  }

  getUpperRightDiv() {
    return (
      <div id="upperDivRight" className="upperDivRight">
        {this.createFoundation()}
      </div>
    );
  }

  getUpperDiv(stocks) {
    return (
      <div id="upperDiv" className="upperDiv">
        {this.getUpperLeftDiv(stocks)}
        {this.getUpperRightDiv()}
      </div>
    );
  }

  getTableauPiles(deck) {
    let tableauPiles = new Array();
    for (let i = 1; i <= 7; i++) {
      let cardsForEachPile = new Array();
      for (let j = 1; j <= i; j++) {
        let randomIndex = Math.floor(Math.random() * deck.length);
        let cardToAdd = deck[randomIndex];
        cardsForEachPile.push(cardToAdd);
        deck.splice(randomIndex, 1);
      }
      let tablePile = (
        <div
          className="tableauPiles"
          onDrop={this.drop}
          onDragOver={this.allowDrop}
        >
          {cardsForEachPile}
        </div>
      );
      tableauPiles.push(tablePile);
    }
    return tableauPiles;
  }

  getBottomDiv(tableauPiles) {
    return (
      <div id="bottomDiv" className="bottomDiv">
        <div id="tableau" className="tableau">
          {tableauPiles}
        </div>
      </div>
    );
  }

  getBoard() {
    let totalDeck = this.getDeck();
    let { stockCards, deck } = this.getStockAndTableauCards(totalDeck);
    let upperDiv = this.getUpperDiv(stockCards);
    let tableauPiles = this.getTableauPiles(deck);
    let bottomDiv = this.getBottomDiv(tableauPiles);
    return { upperDiv, bottomDiv };
  }

  render() {
    let { upperDiv, bottomDiv } = this.getBoard();
    return (
      <div id="Game-table">
        {upperDiv}
        {bottomDiv}
      </div>
    );
  }
}

export default App;
