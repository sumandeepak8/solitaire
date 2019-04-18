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
      diamond: props.diamond,
      deck: [],
      stocksCards: [],
      foundationCards: {
        firstFoundationPile: [],
        secondFoundationPile: [],
        thirdFoundationPile: [],
        fourthFoundationPile: []
      },
      wasteCards: [],
      tableauPiles: []
    };
    this.deckJSON = [];
    this.isCreatedDeck = false;
    this.allowDrop = this.allowDrop.bind(this);
    this.drop = this.drop.bind(this);
    this.generateDeckJSON = this.generateDeckJSON.bind(this);
    this.putOnWaste = this.putOnWaste.bind(this);
    this.putBackOnStocks = this.putBackOnStocks.bind(this);
    this.dropOnFoundationPiles = this.dropOnFoundationPiles.bind(this);
  }

  updateStocksAndWaste() {
    this.setState({
      stocksCards: this.state.stocksCards,
      wasteCards: this.state.wasteCards
    });
  }

  putBackOnStocks(event) {
    event.preventDefault();
    let upperCard = document.getElementById('waste').lastChild;
    if (upperCard != null) {
      this.state.stocksCards.push(this.state.wasteCards.pop());
      this.updateStocksAndWaste();
    }
  }

  putOnWaste(event) {
    event.preventDefault();
    let length = event.target.parentNode.id.split(' ').length;
    if (length == 3) {
      this.state.wasteCards.push(this.state.stocksCards.pop());
      this.updateStocksAndWaste();
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
      +cardRank == +targetRank + 1
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
      +cardRank == +targetRank - 1
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

  drop(event) {
    event.preventDefault();
    const droppableCardId = event.dataTransfer.getData('text');
    const dragLocation = event.dataTransfer.getData('draggingLocation');

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

  hasWon() {
    let foundationCards = this.state.foundationCards;
    let hasWon = true;
    let totalCards = Object.values(foundationCards);
    totalCards.forEach(cards => {
      if (cards.length != 13) hasWon = false;
    });
    if (hasWon) alert('you won this game');
  }

  dropOnFoundationPiles(event) {
    const droppableCardId = event.dataTransfer.getData('text');
    let targetId = event.target.id;
    if (!this.isValidToDropOnFoundationPile(event, droppableCardId)) return;
    let card = document.getElementById(droppableCardId);
    this.state.foundationCards[targetId].push(card);
    document.getElementById(targetId).appendChild(card);
    this.hasWon();
  }

  createFoundation() {
    return (
      <div
        id="foundation"
        className="foundation"
        onDragOver={this.allowDrop}
        onDrop={this.dropOnFoundationPiles}
      >
        <div className="foundationPiles" id="firstFoundationPile" />
        <div className="foundationPiles" id="secondFoundationPile" />
        <div className="foundationPiles" id="thirdFoundationPile" />
        <div className="foundationPiles" id="fourthFoundationPile" />
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

  getCard(rank, cardDetails) {
    let card = Object.assign({}, cardDetails);
    card.rank = rank;
    return card;
  }

  generateSuitJSON(className) {
    let { symbol, color } = this.getSymbolAndColor(className);
    let card = {
      symbol: symbol,
      color: color,
      rank: undefined,
      className: className
    };
    for (let i = 1; i <= 10; i++) this.deckJSON.push(this.getCard(i, card));
    this.deckJSON.push(this.getCard('K', card));
    this.deckJSON.push(this.getCard('Q', card));
    this.deckJSON.push(this.getCard('J', card));
  }

  generateDeckJSON() {
    this.generateSuitJSON('spade');
    this.generateSuitJSON('club');
    this.generateSuitJSON('diamond');
    this.generateSuitJSON('heart');
  }

  getCardComponent(on) {
    let deck = this.deckJSON;
    let index = Math.floor(Math.random() * deck.length);
    let card = (
      <Card
        rank={deck[index].rank}
        color={deck[index].color}
        className={deck[index].className}
        on={on}
        symbol={deck[index].symbol}
      />
    );
    deck.splice(index, 1);
    return card;
  }

  putCardsOnStock = function() {
    for (let i = 1; i <= 24; i++) {
      let card = this.getCardComponent('stocksCard');
      this.state.stocksCards.push(card);
    }
  };

  getWastesDiv() {
    return (
      <div id="waste" className="waste">
        {this.state.wasteCards}
      </div>
    );
  }

  getStocksDiv() {
    return (
      <div id="stocks" className="stocks" onClick={this.putOnWaste}>
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

  getUpperLeftDiv() {
    return (
      <div id="upperDivLeft" className="upperDivLeft">
        {this.getStocksDiv()}
        {this.getUndoDiv()}
        {this.getWastesDiv()}
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

  getUpperDiv() {
    return (
      <div id="upperDiv" className="upperDiv">
        {this.getUpperLeftDiv()}
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

  createTableauPiles() {
    for (let i = 1; i <= 7; i++) {
      let cardsForEachPile = new Array();
      for (let j = 1; j <= i; j++) {
        let card = this.getCardComponent(`tableuPilesCard ${i}`);
        cardsForEachPile.push(card);
      }
      let tablePile = this.getTablePile(cardsForEachPile);
      this.state.tableauPiles.push(tablePile);
    }
  }

  getBottomDiv() {
    return (
      <div id="bottomDiv" className="bottomDiv">
        <div id="tableau" className="tableau">
          {this.state.tableauPiles}
        </div>
      </div>
    );
  }

  getBoard() {
    if (!this.isCreatedDeck) {
      this.isCreatedDeck = true;
      this.generateDeckJSON();
      this.putCardsOnStock();
      this.createTableauPiles();
      this.deckJSON = [];
    }
    let bottomDiv = this.getBottomDiv();
    let upperDiv = this.getUpperDiv();
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
