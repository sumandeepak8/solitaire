import React, { Component } from 'react';
import './App.css';
import Card from './Card';
import Div from './Div';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spade: props.spade,
      heart: props.heart,
      club: props.club,
      diamond: props.diamond,
      deck: [],
      stocksCards: [],
      foundationCards: {
        firstFoundationPile: [],
        secondFoundationPile: [],
        thirdFoundationPile: [],
        fourthFoundationPile: []
      }
    };
    this.allowDrop = this.allowDrop.bind(this);
    this.drop = this.drop.bind(this);
    this.dropOnWaste = this.dropOnWaste.bind(this);
    this.PutOnWaste = this.PutOnWaste.bind(this);
    this.putBackOnStocks = this.putBackOnStocks.bind(this);
    this.dropOnFoundationPiles = this.dropOnFoundationPiles.bind(this);
  }

  putBackOnStocks(event) {
    event.preventDefault();
    let upperCard = document.getElementById('waste').lastChild;
    if (upperCard != null) {
      document.getElementById('stocks').appendChild(upperCard);
    }
  }

  PutOnWaste(event) {
    event.preventDefault();
    let length = event.target.parentNode.id.split(' ').length;
    if (length == 3) {
      document.getElementById('waste').appendChild(event.target.parentNode);
    }
  }

  allowDrop(event) {
    event.preventDefault();
  }

  isOfHighRank(cardRank, targetRank) {
    if (
      (cardRank == 'tableau' && targetRank == 'K') ||
      (cardRank == 'K' && targetRank == 'Q') ||
      (cardRank == 'Q' && targetRank == 'J') ||
      (cardRank == 'J' && targetRank == '10') ||
      cardRank == targetRank + 1
    )
      return true;
    return false;
  }

  isOfLowRank(cardRank, targetRank) {
    if (
      (targetRank == 'tableau' && cardRank == 'K') ||
      (targetRank == 'K' && cardRank == 'Q') ||
      (targetRank == 'Q' && cardRank == 'J') ||
      (targetRank == 'J' && cardRank == '10') ||
      cardRank == targetRank - 1
    )
      return true;
    return false;
  }

  isValidToDrop(droppableCardId, targetElementId) {
    let cardDetails = droppableCardId.split(' ');
    let cardRank = cardDetails[0];
    let cardColor = cardDetails[1];

    let targetDetails = targetElementId.split(' ');
    let targetRank = targetDetails[0];
    let targetColor = targetDetails[1];

    let isDifferentColors = cardColor != targetColor;
    if (this.isOfLowRank(cardRank, targetRank)) return isDifferentColors;
  }

  dropOnWaste(event) {
    event.preventDefault();
    const droppableCardId = event.dataTransfer.getData('text');
    event.target.appendChild(document.getElementById(droppableCardId));
  }

  drop(event) {
    event.preventDefault();
    const droppableCardId = event.dataTransfer.getData('text');
    let targetElementId = event.target.parentNode.id;
    if (!this.isValidToDrop(droppableCardId, targetElementId)) return;
    let elementToPlace = document.getElementById(droppableCardId);
    let length = targetElementId.split(' ').length;
    if (length != 3) event.target.appendChild(elementToPlace);
    else event.target.parentNode.parentNode.appendChild(elementToPlace);
  }

  isValidToDropOnFoundationPile(event, droppableCardId) {
    let cardDetails = droppableCardId.split(' ');
    let cardRank = cardDetails[0];
    let cardSuit = cardDetails[2];

    let upperCard = event.target.lastChild;
    let targetDetails = [];
    if (upperCard != null) targetDetails = upperCard.id.split(' ');
    let targetRank = targetDetails[0];
    let targetSuit = targetDetails[2];
    if (upperCard == null && cardRank == 1) return true;
    if (this.isOfHighRank(cardRank, targetRank)) return cardSuit == targetSuit;
    return false;
  }

  isWon() {
    let foundationCards = this.state.foundationCards;
    let isWon = true;
    let totalCards = Object.values(foundationCards);
    totalCards.forEach(cards => {
      if (cards.length != 13) isWon = false;
    });
    if (isWon) alert('you won this game');
  }

  dropOnFoundationPiles(event) {
    const droppableCardId = event.dataTransfer.getData('text');
    let targetId = event.target.id;
    if (!this.isValidToDropOnFoundationPile(event, droppableCardId)) return;
    let card = document.getElementById(droppableCardId);
    this.state.foundationCards[targetId].push(card);
    document.getElementById(targetId).appendChild(card);
    this.isWon();
  }

  createFoundation() {
    return (
      <div
        id="foundation"
        className="foundation"
        onDragOver={this.allowDrop}
        onDrop={this.dropOnFoundationPiles}
      >
        <Div className="foundationPiles" id="firstFoundationPile" />
        <Div className="foundationPiles" id="secondFoundationPile" />
        <Div className="foundationPiles" id="thirdFoundationPile" />
        <Div className="foundationPiles" id="fourthFoundationPile" />
      </div>
    );
  }

  getSymbolAndColor(className) {
    const symbolAndColors = {
      spade: { symbol: this.state.spade, color: 'black' },
      heart: { symbol: this.state.heart, color: 'red' },
      club: { symbol: this.state.club, color: 'black' },
      diamond: { symbol: this.state.diamond, color: 'red' }
    };

    let symbolAndColor = symbolAndColors[className];
    return { symbol: symbolAndColor.symbol, color: symbolAndColor.color };
  }

  createSuit(className) {
    let { symbol, color } = this.getSymbolAndColor(className);

    let king = (
      <Card symbol={symbol} color={color} rank="K" className={className} />
    );
    let queen = (
      <Card symbol={symbol} color={color} rank="Q" className={className} />
    );
    let jack = (
      <Card symbol={symbol} color={color} rank="J" className={className} />
    );

    for (let i = 1; i <= 10; i++)
      this.state.deck.push(
        <Card symbol={symbol} color={color} rank={i} className={className} />
      );

    this.state.deck.push(jack);
    this.state.deck.push(queen);
    this.state.deck.push(king);
  }

  createDeck() {
    this.createSuit('spade');
    this.createSuit('heart');
    this.createSuit('club');
    this.createSuit('diamond');
  }

  putCardsOnStock = function() {
    let deck = this.state.deck;
    for (let i = 1; i <= 24; i++) {
      let index = [Math.floor(Math.random() * deck.length)];
      this.state.stocksCards.push(deck[index]);
      deck.splice(index, 1);
    }
  };

  getStocksDiv() {
    return (
      <div id="stocks" className="stocks" onClick={this.PutOnWaste}>
        {this.state.stocksCards}
      </div>
    );
  }

  getUndoDiv() {
    return (
      <div class="undo" onClick={this.putBackOnStocks}>
        &#x2940;
      </div>
    );
  }

  getUpperLeftDiv(stockCards) {
    return (
      <div id="upperDivLeft" className="upperDivLeft">
        {this.getStocksDiv(stockCards)}
        {this.getUndoDiv()}
        <div
          id="waste"
          className="waste"
          onDrop={this.dropOnWaste}
          onDragOver={this.allowDrop}
        />
        ;
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

  getTablePile(cardsForEachPile) {
    return (
      <div
        className="tableauPiles"
        onDrop={this.drop}
        onDragOver={this.allowDrop}
      >
        {cardsForEachPile}
      </div>
    );
  }

  getTableauPiles() {
    let deck = this.state.deck;
    let tableauPiles = new Array();
    for (let i = 1; i <= 7; i++) {
      let cardsForEachPile = new Array();
      for (let j = 1; j <= i; j++) {
        let randomIndex = Math.floor(Math.random() * deck.length);
        let cardToAdd = deck[randomIndex];
        cardsForEachPile.push(cardToAdd);
        deck.splice(randomIndex, 1);
      }
      let tablePile = this.getTablePile(cardsForEachPile);
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
    this.createDeck();
    this.putCardsOnStock();
    let upperDiv = this.getUpperDiv();
    let tableauPiles = this.getTableauPiles();
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
