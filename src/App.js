import React, { Component } from 'react';
import './App.css';
import Heart from './Heart';
import Diamond from './Diamond';
import Club from './Club';
import Spade from './Spade';

class App extends Component {
  createFoundation() {
    let pile = <div className="foundationPiles" />;
    let piles = new Array(4).fill(pile);
    return <div id="foundation">{piles}</div>;
  }

  getDeck() {
    let spade = <Spade className="spade" />;
    let heart = <Heart className="heart" />;
    let club = <Club className="club" />;
    let diamond = <Diamond className="diamond" />;
    return { spade, heart, club, diamond };
  }

  getTotalCards() {
    let { spade, heart, club, diamond } = this.getDeck();
    return (
      <div id="total">
        {spade}
        {heart}
        {club}
        {diamond}
      </div>
    );
  }

  getBoard() {
    let stocks = <div id="stocks" />;
    let waste = <div id="waste" />;
    let foundation = this.createFoundation();
    let upperDivLeft = (
      <div id="upperDivLeft">
        {stocks}
        {waste}
      </div>
    );
    let upperDivRight = <div id="upperDivRight">{foundation}</div>;
    let upperDiv = (
      <div id="upperDiv">
        {upperDivLeft}
        {upperDivRight}
      </div>
    );

    let tablePile = <div className="tableauPiles" />;
    let tableauPiles = new Array(7).fill(tablePile);

    let tableau = <div id="tableau">{tableauPiles}</div>;
    let bottomDiv = <div id="bottomDiv">{tableau}</div>;

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
