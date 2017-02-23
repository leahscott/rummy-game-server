import {List, Map} from 'immutable';
import {expect} from 'chai';

import { playMeld } from '../src/core';

describe('meld suite', () => {
  
  describe('when meld is a valid set', () => {
    const state = Map({ 
      currentPlayer: 'human',
      hands: Map({ 
        human: List.of(
          Map({ suit: 'diamonds', value: 3 }),
          Map({ suit: 'spades', value: 3 }),
          Map({ suit: 'hearts', value: 3 }),
          Map({ suit: 'spades', value: 7 })
        )
      })
    });
    const meld = state.getIn(['hands', 'human']).take(3);
    const nextState = playMeld(state, meld);

    it('the meld is added to the current state', () => {
      expect(nextState.get('melds')).to.have.sizeOf(1);
    });

    it('the melded cards are assigned to the correct owner', () => {
      const firstMeldedCard = (nextState.getIn(['melds', 0, 'cards', 0]));
      expect(firstMeldedCard.get('owner')).to.equal('human');
    });

    it('the melded cards are removed from the current player\'s hand', () => {
      expect(nextState.getIn(['hands', 'human'])).to.equal(List.of(
        Map({ suit: 'spades', value: 7 })
      ));
    });

  });

  describe('when meld is a valid run', () => {
    const state = Map({ 
      currentPlayer: 'human',
      hands: Map({ 
        human: List.of(
          Map({ suit: 'diamonds', value: 2 }),
          Map({ suit: 'diamonds', value: 3 }),
          Map({ suit: 'diamonds', value: 4 }),
          Map({ suit: 'spades', value: 7 })
        )
      })
    });
    const meld = state.getIn(['hands', 'human']).take(3);
    const nextState = playMeld(state, meld);

    it('the meld is added to the current state', () => {
      expect(nextState.get('melds')).to.have.sizeOf(1);
    });

    it('the melded cards are assigned to the correct owner', () => {
      const firstMeldedCard = (nextState.getIn(['melds', 0, 'cards', 0]));
      expect(firstMeldedCard.get('owner')).to.equal('human');
    });

    it('the melded cards are removed from the current player\'s hand', () => {
      expect(nextState.getIn(['hands', 'human'])).to.equal(List.of(
        Map({ suit: 'spades', value: 7 })
      ));
    });

  });

  describe('when meld is invalid', () => {
    const state = Map({ currentPlayer: 'human' });
    const badMeld = List.of(
      Map({ suit: 'diamonds', value: 3 }),
      Map({ suit: 'spades', value: 4 }),
      Map({ suit: 'hearts', value: 3 })
    );
    const nextState = playMeld(state, badMeld);

    it('the current state is returned', () => {
      expect(nextState).to.equal(state);
    });
  });

});