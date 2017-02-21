import {fromJS, List, Map, Stack} from 'immutable';
import {expect} from 'chai';

import { createDeck, drawFromStock,  drawFromDiscard } from '../src/core';

describe('draw suite', function() {

  describe('if drawing from the stock', function () {
    
    describe('and the current player does not have a hand', function() {
      const state = Map({ 
        deck: fromJS(createDeck()),
        currentPlayer: 'human'
      });
      const nextState = drawFromStock(state);

      it('10 cards are added to the current player\'s hand', function() {
        expect(nextState.getIn(['hands', 'human']).size).to.equal(10);
      });
      
      it('10 cards are taken from the stock', function() {
        expect(nextState.get('deck').size).to.equal(42);
      });

    });

    describe('and the current player already has a hand', function() {
      const deck = List(createDeck());
      const state = Map({
        hands: Map({
          human: deck.take(10)
        }),
        deck: deck.skip(10),
        currentPlayer: 'human'
      });
      const nextState = drawFromStock(state);
      
      it('1 card is added to the current player\'s hand', function() {
        expect(nextState.getIn(['hands', 'human']).size).to.equal(11);
      });

      it('1 card is taken from the stock', function() {
        expect(nextState.get('deck').size).to.equal(state.get('deck').size - 1);
      });

    });

  });

  describe('if drawing from the discard pile', function () {
    const state = Map({
      hands: Map({ 
        human: List.of( Map({ suit: 'spades', value: 3 }) )
      }),
      discardPile: Stack.of( 
          Map({ suit: 'diamonds', value: 6 }),
          Map({ suit: 'clubs', value: 10 })
      ),
      currentPlayer: 'human'
    });
    const nextState = drawFromDiscard(state);

    it('a card is removed from the top of the discard pile', function () {
      expect(nextState.get('discardPile')).to.equal(Stack.of(
        Map({ suit: 'clubs', value: 10 })
      ));
    });

    it('the drawn card is added to the current player\'s hand', function () {
      expect(nextState.getIn(['hands', 'human']).last()).to.equal(Map({ suit: 'diamonds', value: 6 }));
    });

  });

});