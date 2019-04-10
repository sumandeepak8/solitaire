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
  }

  createFoundation() {
    let pile = <div className="foundationPiles" />;
    let piles = new Array(4).fill(pile);
    return (
      <div id="foundation" className="foundation">
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

    let king = <Card symbol={symbol} number="K" className={className} />;
    let queen = <Card symbol={symbol} number="Q" className={className} />;
    let jack = <Card symbol={symbol} number="J" className={className} />;

    for (let i = 1; i <= 10; i++)
      suit.push(<Card symbol={symbol} number={i} className={className} />);

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

    let deck = spade
      .concat(heart)
      .concat(club)
      .concat(diamond);
    return deck.slice(0, 52);
  }

  createStocks = function(deck) {
    let cards = [];
    for (let i = 1; i <= 24; i++) {
      let index = [Math.floor(Math.random() * deck.length)];
      cards.push(deck[index]);
      deck.splice(index, 1);
    }
    let stocks = (
      <div id="stocks" className="stocks">
        {cards}
      </div>
    );
    return { stocks, deck };
  };

  getUpperLeftDiv(stocks) {
    let waste = <div id="waste" className="waste" />;
    return (
      <div id="upperDivLeft" className="upperDivLeft">
        {stocks}
        {waste}
      </div>
    );
  }

  getUpperRightDiv() {
    let foundation = this.createFoundation();
    return (
      <div id="upperDivRight" className="upperDivRight">
        {foundation}
      </div>
    );
  }

  getUpperDiv(stocks) {
    let upperDivLeft = this.getUpperLeftDiv(stocks);
    let upperDivRight = this.getUpperRightDiv();
    return (
      <div id="upperDiv" className="upperDiv">
        {upperDivLeft}
        {upperDivRight}
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
      let tablePile = <div className="tableauPiles">{cardsForEachPile}</div>;
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
    let { stocks, deck } = this.createStocks(totalDeck);
    let upperDiv = this.getUpperDiv(stocks);
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
