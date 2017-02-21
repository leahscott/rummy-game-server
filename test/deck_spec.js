import {fromJS, List, Map} from 'immutable';
import {expect} from 'chai';
import {createDeck, setDeck, shuffle} from '../src/core';

describe('deck suite', function() {

  describe('createDeck', function() {

    it('creates a new deck of 52 cards', function() {
      const newDeck = createDeck();
      expect(newDeck.length).to.equal(52);
    });

  });

  
  describe('setDeck', function() {

    it('attaches a new deck to the state', function() {
      const state = Map();
      const deck = createDeck();
      const deckState = setDeck(state, deck);
      expect(deckState.get('deck')).to.equal(fromJS(deck));
    });
    
  });

  describe('shuffle', function() {

    it('shuffles cards in the state\'s deck', function() {
      const state = fromJS({ deck: createDeck() });
      const shuffledState = shuffle(state);
      expect(state).to.not.equal(shuffledState);
    });
    
  });

});