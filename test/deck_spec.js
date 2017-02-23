import {fromJS, List, Map} from 'immutable';
import {expect} from 'chai';
import {createDeck, setDeck, shuffle} from '../src/core';

describe('deck suite', () => {

  describe('createDeck', () => {

    it('creates a new deck of 52 cards', () => {
      const newDeck = createDeck();
      expect(newDeck.length).to.equal(52);
    });

  });

  
  describe('setDeck', () => {

    it('attaches a new deck to the state', () => {
      const state = Map();
      const deck = createDeck();
      const deckState = setDeck(state, deck);
      expect(deckState.get('deck')).to.equal(fromJS(deck));
    });
    
  });

  describe('shuffle', () => {

    it('shuffles cards in the state\'s deck', () => {
      const state = fromJS({ deck: createDeck() });
      const shuffledState = shuffle(state);
      expect(state).to.not.equal(shuffledState);
    });
    
  });

});