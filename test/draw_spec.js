import {fromJS, List, Map, Stack} from 'immutable';
import {expect} from 'chai';

import { createDeck, deal, drawFromStock,  drawFromDiscard } from '../src/core';

describe('draw suite', () => {

  describe('when dealing', () => {
    
    it('each player is delt a hand of 10 cards', () => {
      const state = fromJS({
        deck : createDeck(),
        players: ['human', 'computer']
      });
      const nextState = deal(state);

      expect(nextState.getIn(['hands', 'human'])).to.have.size(10);
      expect(nextState.getIn(['hands', 'computer'])).to.have.size(10);
      expect(nextState.get('deck')).to.have.size(32);
    });

  });

  describe('if drawing from the stock', () => {
    const deck = fromJS(createDeck());
    const state = fromJS({
      hands: {
        human: deck.take(10)
      },
      deck: deck.skip(10),
      currentPlayer: 'human'
    });
    const nextState = drawFromStock(state, state.get('currentPlayer'));

    it('1 card is added to the current player\'s hand', () => {
      expect(nextState.getIn(['hands', 'human']).size).to.equal(11);
    });

    it('1 card is taken from the stock', () => {
      expect(nextState.get('deck').size).to.equal(state.get('deck').size - 1);
    });

  });

  describe('if drawing from the discard pile', () => {
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

    it('a card is removed from the top of the discard pile', () => {
      expect(nextState.get('discardPile')).to.equal(Stack.of(
        Map({ suit: 'clubs', value: 10 })
      ));
    });

    it('the drawn card is added to the current player\'s hand', () => {
      expect(nextState.getIn(['hands', 'human']).last()).to.equal(Map({ suit: 'diamonds', value: 6 }));
    });

  });

});