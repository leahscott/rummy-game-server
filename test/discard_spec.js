import {fromJS, List, Map, Stack} from 'immutable';
import {expect} from 'chai';

import { discard } from '../src/core';

describe('discard suite', () => {
  
  describe('when a card is discarded', () => {
    const state = fromJS({ 
      currentPlayer: 'human',
      discardPile: Stack.of({ suit: 'diamonds', value: 12 }),
      hands: { human: [{ suit: 'spades', value: 10 },{ suit: 'hearts', value: 3 }] }
    });
    const card = state.getIn(['hands', 'human']).first();
    const nextState = discard(state, card);

    it('it is added to the top of the discard pile', () => {
      expect(nextState.get('discardPile').first()).to.equal(card);
    });

    it('it is removed from the player\'s hand', () => {
      expect(nextState.getIn(['hands', 'human'])).to.equal(fromJS(
        [{ suit: 'hearts', value: 3 }]
      ));
    });
    
  });

});