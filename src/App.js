import React, { Component } from "react";
import "./App.css";
import Card from "./Card";

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
    let upperCard = document.getElementById("waste").lastChild;
    if (upperCard != null) {
      this.state.stocksCards.push(this.state.wasteCards.pop());
      this.updateStocksAndWaste();
    }
  }

  putOnWaste(event) {
    event.preventDefault();
    let length = event.target.parentNode.id.split(" ").length;
    if (length == 3) {
      this.state.wasteCards.push(this.state.stocksCards.pop());
      this.updateStocksAndWaste();
    }
  }

  allowDrop(event) {
    event.preventDefault();
  }

  compareRank(firstRank, secondRank, diff) {
    if (
      (firstRank == "tableau" && secondRank == "K") ||
      (firstRank == "K" && secondRank == "Q") ||
      (firstRank == "Q" && secondRank == "J") ||
      (firstRank == "J" && secondRank == "10") ||
      +firstRank == +secondRank + diff
    )
      return true;
    return false;
  }

  isValidToDrop(droppableCardId, targetElementId) {
    let cardDetails = droppableCardId.split(" ");
    let cardRank = cardDetails[0];
    let cardColor = cardDetails[1];

    let targetDetails = targetElementId.split(" ");
    let targetRank = targetDetails[0];
    let targetColor = targetDetails[1];

    let isDifferentColors = cardColor != targetColor;
    if (this.compareRank(targetRank, cardRank, 1)) return isDifferentColors;
    return false;
  }

  searchCardLocation(rank, className) {
    let location;
    this.state.wasteCards.forEach(card => {
      if (card.rank == rank && card.className == className)
        // this part can be taken into callback function
        location = this.state.wasteCards;
    });
    this.state.tableauPiles.forEach(pile => {
      pile.forEach(card => {
        if (card.rank == rank && card.className == className) location = pile;
      });
    });
    return location;
  }

  drop(event) {
    event.preventDefault();
    const droppableCardId = event.dataTransfer.getData("text");
    let targetElementId = event.target.parentNode.id;

    if (!this.isValidToDrop(droppableCardId, targetElementId)) return;
    let elementToPlace = document.getElementById(droppableCardId);
    let idData = targetElementId.split(" ");
    let length = idData.length;
    if (length == 3) {
      let cardDetail = droppableCardId.split(" ");
      let initialLocation = this.searchCardLocation(
        cardDetail[0],
        cardDetail[2]
      );

      // console.log(
      //   "initial location is ",
      //   initialLocation,
      //   " length is ",
      //   initialLocation.length
      // );

      let finalLocation = this.searchCardLocation(idData[0], idData[2]);
      finalLocation.push(initialLocation.pop());
      this.setState({
        stocksCards: this.state.stocksCards,
        tableauPiles: this.state.tableauPiles
      });
    }
    if (event.target.id == "tableau") {
      event.target.appendChild(elementToPlace);
    }
  }

  isValidToDropOnFoundationPile(event, droppableCardId) {
    let cardDetails = droppableCardId.split(" ");
    let cardRank = cardDetails[0];
    let cardSuit = cardDetails[2];
    let upperCard = event.target.lastChild;
    let targetDetails = [];
    if (upperCard != null) targetDetails = upperCard.id.split(" ");
    let targetRank = targetDetails[0];
    let targetSuit = targetDetails[2];
    if (upperCard == null && cardRank == 1) return true;
    if (this.compareRank(cardRank, targetRank, 1))
      return cardSuit == targetSuit;
    return false;
  }

  hasWon() {
    let foundationCards = this.state.foundationCards;
    let hasWon = true;
    let totalCards = Object.values(foundationCards);
    totalCards.forEach(cards => {
      if (cards.length != 13) hasWon = false;
    });
    if (hasWon) alert("you won this game");
  }

  dropOnFoundationPiles(event) {
    const droppableCardId = event.dataTransfer.getData("text");
    let targetId = event.target.id;
    if (!this.isValidToDropOnFoundationPile(event, droppableCardId)) return;
    let card = document.getElementById(droppableCardId);
    this.state.foundationCards[targetId].push(card);
    document.getElementById(targetId).appendChild(card);
    this.setState({
      foundationCards: this.state.foundationCards
    });
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
      spade: { symbol: this.state.spade, color: "black" },
      heart: { symbol: this.state.heart, color: "red" },
      club: { symbol: this.state.club, color: "black" },
      diamond: { symbol: this.state.diamond, color: "red" }
    };

    let symbolAndColor = symbolAndColors[className];
    return { symbol: symbolAndColor.symbol, color: symbolAndColor.color };
  }

  getCardDetail(rank, cardDetails) {
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
    for (let i = 1; i <= 10; i++)
      this.deckJSON.push(this.getCardDetail(i, card));
    this.deckJSON.push(this.getCardDetail("K", card));
    this.deckJSON.push(this.getCardDetail("Q", card));
    this.deckJSON.push(this.getCardDetail("J", card));
  }

  generateDeckJSON() {
    this.generateSuitJSON("spade");
    this.generateSuitJSON("club");
    this.generateSuitJSON("diamond");
    this.generateSuitJSON("heart");
  }

  getRandomCard() {
    let deck = this.deckJSON;
    let index = Math.floor(Math.random() * deck.length);
    let card = deck[index];
    deck.splice(index, 1);
    return card;
  }

  putCardsOnStock = function() {
    for (let i = 1; i <= 24; i++)
      this.state.stocksCards.push(this.getRandomCard());
  };

  getCardDom(cardDetail, isDraggable) {
    return (
      <Card
        isDraggable={isDraggable}
        isFaceUp={isDraggable}
        rank={cardDetail.rank}
        color={cardDetail.color}
        className={cardDetail.className}
        symbol={cardDetail.symbol}
      />
    );
  }

  getCardsComponent(cards, areAllCardsFlipped) {
    return cards.map((card, i) => {
      let isDraggable = false;
      if (i == cards.length - 1 && !areAllCardsFlipped) isDraggable = true;
      return this.getCardDom(card, isDraggable);
    });
  }

  getWastesDiv() {
    return (
      <div id="waste" className="waste">
        {this.getCardsComponent(this.state.wasteCards, false)}
      </div>
    );
  }

  getStocksDiv() {
    return (
      <div id="stocks" className="stocks" onClick={this.putOnWaste}>
        {this.getCardsComponent(this.state.stocksCards, true)}
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

  getTableauPilesCard() {
    for (let i = 1; i <= 7; i++) {
      let cardsForEachPile = new Array();
      for (let j = 1; j <= i; j++) {
        cardsForEachPile.push(this.getRandomCard());
      }
      this.state.tableauPiles.push(cardsForEachPile);
    }
  }

  getTablePile(cardsForEachPile) {
    let allCards = this.getCardsComponent(cardsForEachPile, false);
    return (
      <div
        className="tableauPiles"
        onDrop={this.drop}
        onDragOver={this.allowDrop}
      >
        {allCards}
      </div>
    );
  }

  createTableauPiles() {
    return this.state.tableauPiles.map(cardsForEachPile => {
      return this.getTablePile(cardsForEachPile);
    });
  }

  getBottomDiv() {
    return (
      <div id="bottomDiv" className="bottomDiv">
        <div id="tableau" className="tableau">
          {this.createTableauPiles()}
        </div>
      </div>
    );
  }

  getBoard() {
    if (!this.isCreatedDeck) {
      this.isCreatedDeck = true;
      this.generateDeckJSON();
      this.putCardsOnStock();
      this.getTableauPilesCard();
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
