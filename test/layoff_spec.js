import {fromJS, List, Map} from 'immutable';
import {expect} from 'chai';

import { layoff } from '../src/core';

describe('layoff suite', function () {

  describe('when making a valid layoff onto a set', function () {
    const state = fromJS({
      melds: [{
        cards: [
          { suit: 'diamonds', value: 3, owner: 'computer' },
          { suit: 'clubs', value: 3, owner: 'computer' },
          { suit: 'hearts', value: 3, owner: 'computer' }
        ],
        type: 'set'
      }],
      hands: { human: [{ suit: 'spades', value: 3 }] },
      currentPlayer: 'human' 
    });

    const card = state.getIn(['hands', 'human', 0]), 
          meld = state.getIn(['melds', 0, 'cards']);

    const nextState = layoff(state, meld, card);

    it('the card is added to the existing meld', function () {
      expect(nextState.getIn(['melds', 0])).to.equal(fromJS({
          cards: [
            { suit: 'diamonds', value: 3, owner: 'computer' },
            { suit: 'clubs', value: 3, owner: 'computer' },
            { suit: 'hearts', value: 3, owner: 'computer' },
            { suit: 'spades', value: 3, owner: 'human' }
          ],
          type: 'set'
        })
      )
    });

    it('the card is assigned the correct ownership', function () {
      expect(nextState.getIn(['melds', 0, 'cards']).last()).to.have.property('owner', 'human');
    });

    it('the card is deleted from the current player\'s hand', function () {
      expect(nextState.getIn(['hands', 'human'])).to.equal(List());
    });
  });

  describe('when making a valid layoff onto a run', function () {
    const state = fromJS({
      melds: [
        {
          cards: [
            { suit: 'diamonds', value: 4, owner: 'human' },
            { suit: 'diamonds', value: 5, owner: 'human' },
            { suit: 'diamonds', value: 6, owner: 'human' }
          ],
          type: 'run'
        }
      ],
      hands: { human: [{ suit: 'diamonds', value: 7 }] },
      currentPlayer: 'human' 
    });

    const card = state.getIn(['hands', 'human', 0]), 
          meld = state.getIn(['melds', 0, 'cards']);

    const nextState = layoff(state, meld, card);

    it('the card is added to the existing meld', function () {
      expect(nextState.getIn(['melds', 0])).to.equal(fromJS({
        cards: [
          { suit: 'diamonds', value: 4, owner: 'human' },
          { suit: 'diamonds', value: 5, owner: 'human' },
          { suit: 'diamonds', value: 6, owner: 'human' },
          { suit: 'diamonds', value: 7, owner: 'human' }
        ],
        type: 'run'
      }));
    });

    it('the card is assigned the correct ownership', function () {
      expect(nextState.getIn(['melds', 0, 'cards']).last()).to.have.property('owner', 'human');
    });

    it('the card is deleted from the current player\'s hand', function () {
      expect(nextState.getIn(['hands', 'human'])).to.equal(List());
    });

  });

  describe('when layoff is invalid', function () {
    const state = fromJS({
      melds: [
        {
          cards: [
            { suit: 'diamonds', value: 3, owner: 'computer' },
            { suit: 'clubs', value: 3, owner: 'computer' },
            { suit: 'hearts', value: 3, owner: 'computer' }
          ],
          type: 'set'
        }
      ],
      hands: { human: [{ suit: 'spades', value: 4 }] },
      currentPlayer: 'human' 
    });

    const card = state.getIn(['hands', 'human', 0]), 
          meld = state.getIn(['melds', 0, 'cards']);

    const nextState = layoff(state, meld, card);
    
    it('the current state is returned', function () {
      expect(nextState).to.equal(state);
    });

  });

});